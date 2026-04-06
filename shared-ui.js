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
  // AUDIO REACTIVITY
  // =========================================
  let audioCtx = null;
  let analyser = null;
  let audioSource = null;
  let audioActive = false;
  let audioFreqData = null;
  let audioAnimFrame = null;

  // Store original slider values to restore when audio stops
  let originalValues = {};

  function createAudioPanel() {
    const panel = document.createElement('div');
    panel.className = 'info-panel';
    panel.id = 'audio-panel';
    panel.innerHTML = `
      <div class="info-panel-header">
        <h2>Audio Reactive</h2>
        <button class="info-panel-close">&times;</button>
      </div>
      <div class="info-panel-body">
        <div class="info-section">
          <h3>Choose Audio Source</h3>
          <p>Particles will react to music in real-time. Bass drives scale, mids drive speed, highs drive bloom.</p>
        </div>

        <div class="info-section">
          <h3>Microphone</h3>
          <p>Use your mic to capture ambient sound or play music near your device.</p>
          <button class="copy-btn" id="audio-mic-btn">Use Microphone</button>
        </div>

        <div class="info-section">
          <h3>Audio File</h3>
          <p>Upload an MP3, WAV, or OGG file to drive the particles.</p>
          <input type="file" id="audio-file-input" accept="audio/*" style="display:none;">
          <button class="copy-btn" id="audio-file-btn">Choose File</button>
          <div id="audio-file-name" style="margin-top:8px;font-size:10px;color:rgba(255,255,255,0.3);"></div>
        </div>

        <div class="info-section" id="audio-controls" style="display:none;">
          <h3>Audio Visualizer</h3>
          <canvas id="audio-viz" width="420" height="80" style="width:100%;height:80px;border-radius:8px;background:rgba(255,255,255,0.03);"></canvas>
          <div style="margin-top:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span style="font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.35);">Sensitivity</span>
              <input type="range" id="audio-sensitivity" min="0.5" max="3" step="0.1" value="1.5" style="width:200px;">
            </div>
          </div>
          <button class="copy-btn" id="audio-stop-btn" style="margin-top:8px;">Stop Audio</button>
        </div>

        <div class="info-section">
          <h3>How It Works</h3>
          <p>
            <b>Bass (20-200 Hz)</b> &rarr; Particle scale (zoom pulse)<br>
            <b>Mids (200-2000 Hz)</b> &rarr; Simulation speed<br>
            <b>Highs (2000-16000 Hz)</b> &rarr; Bloom intensity<br>
            <b>Volume</b> &rarr; Particle size<br>
            <b>Beat detection</b> &rarr; Hue shift on drops
          </p>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // Close
    panel.querySelector('.info-panel-close').addEventListener('click', () => {
      panel.classList.remove('open');
    });

    // Mic button
    document.getElementById('audio-mic-btn').addEventListener('click', async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        initAudio();
        audioSource = audioCtx.createMediaStreamSource(stream);
        audioSource.connect(analyser);
        startAudioLoop();
        document.getElementById('audio-controls').style.display = 'block';
        document.getElementById('audio-mic-btn').textContent = 'Listening...';
        document.getElementById('audio-mic-btn').classList.add('copied');
        showToast('Microphone active — play some music!');
      } catch (e) {
        showToast('Microphone access denied');
      }
    });

    // File button
    document.getElementById('audio-file-btn').addEventListener('click', () => {
      document.getElementById('audio-file-input').click();
    });

    document.getElementById('audio-file-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      document.getElementById('audio-file-name').textContent = file.name;

      initAudio();
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const buffer = await audioCtx.decodeAudioData(ev.target.result);
        if (audioSource && audioSource.disconnect) audioSource.disconnect();
        audioSource = audioCtx.createBufferSource();
        audioSource.buffer = buffer;
        audioSource.loop = true;
        audioSource.connect(analyser);
        analyser.connect(audioCtx.destination); // play through speakers
        audioSource.start(0);
        startAudioLoop();
        document.getElementById('audio-controls').style.display = 'block';
        document.getElementById('audio-file-btn').textContent = 'Playing';
        document.getElementById('audio-file-btn').classList.add('copied');
        showToast('Audio playing — particles are reacting!');
      };
      reader.readAsArrayBuffer(file);
    });

    // Stop button
    document.getElementById('audio-stop-btn').addEventListener('click', () => {
      stopAudio();
    });

    return panel;
  }

  function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    audioFreqData = new Uint8Array(analyser.frequencyBinCount);

    // Save original slider values
    const sliders = ['speed', 'bloom', 'size', 'hueShift'];
    sliders.forEach(id => {
      const el = document.getElementById(id);
      if (el) originalValues[id] = parseFloat(el.value);
    });
  }

  function startAudioLoop() {
    audioActive = true;
    let prevBass = 0;
    let hueAccum = 0;

    function tick() {
      if (!audioActive) return;
      audioAnimFrame = requestAnimationFrame(tick);

      analyser.getByteFrequencyData(audioFreqData);
      const bins = audioFreqData.length; // 128

      // Frequency band averages (0-255 range)
      let bass = 0, mids = 0, highs = 0, total = 0;
      const bassEnd = Math.floor(bins * 0.08);   // ~200Hz
      const midEnd = Math.floor(bins * 0.4);     // ~2000Hz

      for (let i = 0; i < bins; i++) {
        const v = audioFreqData[i];
        total += v;
        if (i < bassEnd) bass += v;
        else if (i < midEnd) mids += v;
        else highs += v;
      }

      bass /= bassEnd || 1;
      mids /= (midEnd - bassEnd) || 1;
      highs /= (bins - midEnd) || 1;
      total /= bins;

      // Normalize to 0-1
      const bassN = bass / 255;
      const midsN = mids / 255;
      const highsN = highs / 255;
      const volN = total / 255;

      const sens = parseFloat(document.getElementById('audio-sensitivity')?.value || 1.5);

      // Beat detection (bass spike)
      const isBeat = bassN > prevBass + 0.15 && bassN > 0.4;
      prevBass = bassN * 0.7 + prevBass * 0.3;

      if (isBeat) hueAccum += 0.08;

      // Modulate sliders
      const speedEl = document.getElementById('speed');
      const bloomEl = document.getElementById('bloom');
      const sizeEl = document.getElementById('size');
      const hueEl = document.getElementById('hueShift');

      if (speedEl) {
        const base = originalValues.speed || 1;
        speedEl.value = base + midsN * 2.0 * sens;
      }
      if (bloomEl) {
        const base = originalValues.bloom || 0.4;
        bloomEl.value = base + highsN * 1.5 * sens;
      }
      if (sizeEl) {
        const base = originalValues.size || 1;
        sizeEl.value = base + volN * 1.5 * sens;
      }
      if (hueEl) {
        hueEl.value = (hueAccum + bassN * 0.1 * sens) % 1;
      }

      // Draw visualizer
      const vizCanvas = document.getElementById('audio-viz');
      if (vizCanvas) {
        const ctx = vizCanvas.getContext('2d');
        const w = vizCanvas.width, h = vizCanvas.height;
        ctx.clearRect(0, 0, w, h);

        const barW = w / bins;
        for (let i = 0; i < bins; i++) {
          const v = audioFreqData[i] / 255;
          const barH = v * h;

          // Color: bass=red, mids=green, highs=blue
          let r = 100, g = 100, b = 100;
          if (i < bassEnd) { r = 255; g = 80; b = 60; }
          else if (i < midEnd) { r = 60; g = 220; b = 120; }
          else { r = 80; g = 140; b = 255; }

          ctx.fillStyle = `rgba(${r},${g},${b},${0.5 + v * 0.5})`;
          ctx.fillRect(i * barW, h - barH, barW - 1, barH);
        }

        // Beat indicator
        if (isBeat) {
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.fillRect(0, 0, w, h);
        }
      }
    }

    tick();
  }

  function stopAudio() {
    audioActive = false;
    if (audioAnimFrame) cancelAnimationFrame(audioAnimFrame);
    if (audioSource) {
      try { audioSource.disconnect(); } catch(e) {}
      if (audioSource.stop) try { audioSource.stop(); } catch(e) {}
    }
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
      analyser = null;
      audioSource = null;
    }

    // Restore original slider values
    Object.entries(originalValues).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    });

    showToast('Audio stopped');
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

    // Mic button (one-click start/stop)
    const micBtn = document.createElement('button');
    micBtn.className = 'tool-btn';
    micBtn.innerHTML = '&#127908;'; // microphone
    micBtn.title = 'Listen to Music (Mic)';
    toolbar.appendChild(micBtn);

    // Upload MP3 button (one-click file picker)
    const uploadBtn = document.createElement('button');
    uploadBtn.className = 'tool-btn';
    uploadBtn.innerHTML = '&#9835;'; // music note
    uploadBtn.title = 'Upload MP3';
    toolbar.appendChild(uploadBtn);

    // Hidden file input
    const audioFileInput = document.createElement('input');
    audioFileInput.type = 'file';
    audioFileInput.accept = 'audio/*';
    audioFileInput.style.display = 'none';
    document.body.appendChild(audioFileInput);

    // Hidden sensitivity (default 1.5)
    const audioSensEl = document.createElement('input');
    audioSensEl.type = 'hidden';
    audioSensEl.id = 'audio-sensitivity';
    audioSensEl.value = '1.5';
    document.body.appendChild(audioSensEl);

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

    // Mic button: one-click toggle
    micBtn.addEventListener('click', async () => {
      if (audioActive) {
        stopAudio();
        micBtn.classList.remove('recording');
        micBtn.innerHTML = '&#127908;';
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        initAudio();
        audioSource = audioCtx.createMediaStreamSource(stream);
        audioSource.connect(analyser);
        startAudioLoop();
        micBtn.classList.add('recording');
        micBtn.innerHTML = '&#9632;'; // stop square
        showToast('Listening — play some music!');
      } catch (e) {
        showToast('Microphone access denied');
      }
    });

    // Upload button: one-click file picker
    uploadBtn.addEventListener('click', () => {
      if (audioActive) {
        stopAudio();
        uploadBtn.classList.remove('recording');
        uploadBtn.innerHTML = '&#9835;';
        return;
      }
      audioFileInput.click();
    });

    audioFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      initAudio();
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const buffer = await audioCtx.decodeAudioData(ev.target.result);
        if (audioSource && audioSource.disconnect) try { audioSource.disconnect(); } catch(e) {}
        audioSource = audioCtx.createBufferSource();
        audioSource.buffer = buffer;
        audioSource.loop = true;
        audioSource.connect(analyser);
        analyser.connect(audioCtx.destination);
        audioSource.start(0);
        startAudioLoop();
        uploadBtn.classList.add('recording');
        uploadBtn.innerHTML = '&#9632;'; // stop square
        showToast('Playing: ' + file.name);
      };
      reader.readAsArrayBuffer(file);
      audioFileInput.value = ''; // reset so same file can be re-selected
    });

    // Embed button (quick copy without opening panel)
    embedBtn.addEventListener('click', () => {
      const embedUrl = pageUrl.replace(/^http:/, 'https:');
      const code = `<iframe src="${embedUrl}" width="800" height="600" style="border:none;border-radius:12px;" allow="accelerometer; autoplay" loading="lazy"></iframe>`;
      copyToClipboard(code, embedBtn);
    });

    // ESC to close panels + stop audio
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (panel) panel.classList.remove('open');
        if (audioActive) {
          stopAudio();
          micBtn.classList.remove('recording');
          micBtn.innerHTML = '&#127908;';
          uploadBtn.classList.remove('recording');
          uploadBtn.innerHTML = '&#9835;';
        }
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
