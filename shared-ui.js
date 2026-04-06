/**
 * Shared UI for all particle animations
 * Adds: Info/Code panel, Embed button, Video Export button
 * Include via <script src="shared-ui.js"></script> (non-module, runs after DOM)
 */
(function() {
  'use strict';

  // =========================================
  // CSS
  // =========================================
  const style = document.createElement('style');
  style.textContent = `
    .shared-toolbar {
      position: fixed;
      top: 24px;
      right: 80px;
      z-index: 20;
      display: flex;
      gap: 8px;
    }
    .tool-btn {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.4);
      font-size: 16px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.3s;
      font-family: 'Courier New', monospace;
    }
    .tool-btn:hover {
      background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.7);
      border-color: rgba(255,255,255,0.2);
    }
    .tool-btn.recording {
      background: rgba(255,50,50,0.2);
      border-color: rgba(255,50,50,0.5);
      color: #f55;
      animation: pulse-rec 1s ease-in-out infinite;
    }
    @keyframes pulse-rec {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Info Panel */
    .info-panel {
      position: fixed;
      top: 0; right: -480px;
      width: 480px; height: 100vh;
      background: rgba(8,8,15,0.97);
      backdrop-filter: blur(20px);
      border-left: 1px solid rgba(255,255,255,0.06);
      z-index: 100;
      transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      overflow-y: auto;
      font-family: 'Courier New', monospace;
      padding: 0;
    }
    .info-panel.open { right: 0; }
    .info-panel-header {
      position: sticky; top: 0;
      background: rgba(8,8,15,0.95);
      padding: 24px 28px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex; justify-content: space-between; align-items: center;
      z-index: 2;
    }
    .info-panel-header h2 {
      font-size: 12px; font-weight: 400;
      letter-spacing: 3px; text-transform: uppercase;
      color: rgba(255,255,255,0.7);
    }
    .info-panel-close {
      background: none; border: none; color: rgba(255,255,255,0.4);
      font-size: 20px; cursor: pointer; padding: 4px 8px;
    }
    .info-panel-close:hover { color: rgba(255,255,255,0.8); }
    .info-panel-body { padding: 20px 28px 40px; }
    .info-section {
      margin-bottom: 28px;
    }
    .info-section h3 {
      font-size: 9px; font-weight: 400;
      letter-spacing: 2px; text-transform: uppercase;
      color: rgba(255,255,255,0.35);
      margin-bottom: 12px;
    }
    .info-section p {
      font-size: 12px; line-height: 1.8;
      color: rgba(255,255,255,0.55);
      letter-spacing: 0.3px;
    }
    .info-section pre {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      padding: 16px;
      font-size: 10px;
      line-height: 1.6;
      color: rgba(255,255,255,0.5);
      overflow-x: auto;
      white-space: pre;
      max-height: 400px;
      overflow-y: auto;
    }
    .copy-btn {
      display: inline-block;
      font-family: 'Courier New', monospace;
      font-size: 9px; letter-spacing: 1.5px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 6px;
      padding: 6px 14px;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 8px;
    }
    .copy-btn:hover {
      background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.7);
    }
    .copy-btn.copied {
      color: rgba(100,255,150,0.7);
      border-color: rgba(100,255,150,0.3);
    }

    .embed-code {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px;
      padding: 12px;
      font-size: 10px;
      color: rgba(255,255,255,0.45);
      word-break: break-all;
      line-height: 1.6;
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px;
      padding: 10px 24px;
      font-family: 'Courier New', monospace;
      font-size: 10px;
      letter-spacing: 1px;
      color: rgba(255,255,255,0.7);
      opacity: 0;
      transition: opacity 0.3s, transform 0.3s;
      z-index: 200;
      pointer-events: none;
    }
    .toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `;
  document.head.appendChild(style);

  // =========================================
  // HELPERS
  // =========================================
  const pageUrl = window.location.href.replace(/^http:\/\/localhost.*\//, 'https://danlex.github.io/particles/');
  const pageName = document.querySelector('#info h1')?.textContent || document.title.split('—')[0].trim();
  const pageDesc = document.querySelector('meta[name="description"]')?.content || '';

  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      if (btn) {
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      }
      showToast('Copied to clipboard');
    });
  }

  // =========================================
  // EXTRACT SHADER CODE
  // =========================================
  function extractShaders() {
    const scripts = document.querySelectorAll('script[type="module"]');
    let source = '';
    scripts.forEach(s => { source += s.textContent; });

    // Extract position shader
    const posMatch = source.match(/(?:positionShader|positionShaderFinal)\s*=\s*`([\s\S]*?)`/);
    const posShader = posMatch ? posMatch[1].trim() : null;

    // Extract vertex shader
    const vertMatch = source.match(/vertexShader\s*=\s*`([\s\S]*?)`/);
    const vertShader = vertMatch ? vertMatch[1].trim() : null;

    // Extract fragment shader
    const fragMatch = source.match(/fragmentShader\s*=\s*`([\s\S]*?)`/);
    const fragShader = fragMatch ? fragMatch[1].trim() : null;

    return { posShader, vertShader, fragShader };
  }

  // =========================================
  // INFO PANEL
  // =========================================
  function createInfoPanel() {
    const shaders = extractShaders();
    const embedUrl = pageUrl.replace(/^http:/, 'https:');
    const embedCode = `<iframe src="${embedUrl}" width="800" height="600" style="border:none;border-radius:12px;" allow="accelerometer; autoplay" loading="lazy"></iframe>`;

    const panel = document.createElement('div');
    panel.className = 'info-panel';
    panel.innerHTML = `
      <div class="info-panel-header">
        <h2>${pageName}</h2>
        <button class="info-panel-close">&times;</button>
      </div>
      <div class="info-panel-body">
        <div class="info-section">
          <h3>About</h3>
          <p>${pageDesc}</p>
          <p style="margin-top:8px;color:rgba(255,255,255,0.3);font-size:10px;">65,536 particles &middot; 256&times;256 GPU texture &middot; Three.js r160 &middot; WebGL</p>
        </div>

        <div class="info-section">
          <h3>Controls</h3>
          <p>
            <b>Speed</b> &mdash; simulation time scale<br>
            <b>Bloom</b> &mdash; glow intensity<br>
            <b>Size</b> &mdash; particle point size<br>
            <b>Hue</b> &mdash; shift the color palette<br>
            <b>+/&minus;</b> &mdash; zoom in/out<br>
            <b>Mouse</b> &mdash; attract particles<br>
            <b>Drag</b> &mdash; orbit camera<br>
            <b>Scroll</b> &mdash; zoom camera
          </p>
        </div>

        ${shaders.posShader ? `
        <div class="info-section">
          <h3>Position Shader (GPU Compute)</h3>
          <pre>${escapeHtml(shaders.posShader)}</pre>
          <button class="copy-btn" data-copy="pos">Copy</button>
        </div>` : ''}

        ${shaders.vertShader ? `
        <div class="info-section">
          <h3>Vertex Shader</h3>
          <pre>${escapeHtml(shaders.vertShader)}</pre>
          <button class="copy-btn" data-copy="vert">Copy</button>
        </div>` : ''}

        ${shaders.fragShader ? `
        <div class="info-section">
          <h3>Fragment Shader</h3>
          <pre>${escapeHtml(shaders.fragShader)}</pre>
          <button class="copy-btn" data-copy="frag">Copy</button>
        </div>` : ''}

        <div class="info-section">
          <h3>Embed</h3>
          <p>Copy the code below to embed this animation on your website:</p>
          <div class="embed-code">${escapeHtml(embedCode)}</div>
          <button class="copy-btn" data-copy="embed">Copy Embed Code</button>
        </div>

        <div class="info-section">
          <h3>Source</h3>
          <p><a href="https://github.com/danlex/particles" target="_blank" rel="noopener" style="color:rgba(255,255,255,0.5);">View on GitHub</a></p>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // Close button
    panel.querySelector('.info-panel-close').addEventListener('click', () => {
      panel.classList.remove('open');
    });

    // Copy buttons
    panel.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.copy;
        let text = '';
        if (type === 'pos') text = shaders.posShader;
        else if (type === 'vert') text = shaders.vertShader;
        else if (type === 'frag') text = shaders.fragShader;
        else if (type === 'embed') text = embedCode;
        copyToClipboard(text, btn);
      });
    });

    return panel;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // =========================================
  // VIDEO RECORDING
  // =========================================
  let mediaRecorder = null;
  let recordedChunks = [];
  let isRecording = false;

  function startRecording(canvas, btn) {
    const stream = canvas.captureStream(30); // 30 FPS
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 8000000 // 8 Mbps
    });

    recordedChunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pageName.toLowerCase().replace(/\s+/g, '-')}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Video saved');
    };

    mediaRecorder.start();
    isRecording = true;
    btn.classList.add('recording');
    btn.innerHTML = '&#9632;'; // stop square
    showToast('Recording started (click again to stop)');
  }

  function stopRecording(btn) {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    isRecording = false;
    btn.classList.remove('recording');
    btn.innerHTML = '&#9679;'; // record circle
  }

  // =========================================
  // BUILD TOOLBAR
  // =========================================
  function init() {
    // Don't run on index or 404
    if (document.querySelector('.grid') || document.title.includes('404')) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'shared-toolbar';

    // Info button
    const infoBtn = document.createElement('button');
    infoBtn.className = 'tool-btn';
    infoBtn.innerHTML = '&#9776;'; // hamburger / info
    infoBtn.title = 'Info & Code';
    toolbar.appendChild(infoBtn);

    // Record button
    const recBtn = document.createElement('button');
    recBtn.className = 'tool-btn';
    recBtn.innerHTML = '&#9679;'; // circle
    recBtn.title = 'Record Video';
    recBtn.style.color = 'rgba(255,100,100,0.5)';
    toolbar.appendChild(recBtn);

    // Embed button
    const embedBtn = document.createElement('button');
    embedBtn.className = 'tool-btn';
    embedBtn.innerHTML = '&lt;/&gt;';
    embedBtn.title = 'Copy Embed Code';
    embedBtn.style.fontSize = '11px';
    toolbar.appendChild(embedBtn);

    document.body.appendChild(toolbar);

    // Info panel (created lazily)
    let panel = null;
    infoBtn.addEventListener('click', () => {
      if (!panel) panel = createInfoPanel();
      panel.classList.toggle('open');
    });

    // Record button
    recBtn.addEventListener('click', () => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      if (isRecording) {
        stopRecording(recBtn);
      } else {
        startRecording(canvas, recBtn);
      }
    });

    // Embed button (quick copy without opening panel)
    embedBtn.addEventListener('click', () => {
      const embedUrl = pageUrl.replace(/^http:/, 'https:');
      const code = `<iframe src="${embedUrl}" width="800" height="600" style="border:none;border-radius:12px;" allow="accelerometer; autoplay" loading="lazy"></iframe>`;
      copyToClipboard(code, embedBtn);
    });

    // ESC to close panel
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel) {
        panel.classList.remove('open');
      }
    });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
