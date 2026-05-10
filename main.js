// AI Assistant Plugin for Acode
// by Rafi Studio — github.com/rafijordan4
(function () {
  'use strict';

  const PLUGIN_ID = 'rafijordan4.aiassistant';

  const CSS = `
#ai-float-btn {
  position: fixed;
  right: 14px;
  bottom: 74px;
  z-index: 9998;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 18px rgba(124,58,237,0.55);
  transition: transform .2s, box-shadow .2s;
}
#ai-float-btn:hover { transform: scale(1.1); }
#ai-float-btn.active {
  transform: rotate(45deg);
  background: linear-gradient(135deg,#4f46e5,#7c3aed);
}

#ai-panel {
  position: fixed;
  right: -360px;
  top: 0;
  width: 320px;
  height: 100%;
  background: #0f0f14;
  border-left: 1px solid #1e1e2e;
  z-index: 9997;
  display: flex;
  flex-direction: column;
  transition: right .3s cubic-bezier(.4,0,.2,1);
  font-family: monospace;
  font-size: 12px;
  color: #e5e7eb;
  overflow: hidden;
}
#ai-panel.open { right: 0; }

.ai-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: #12121a;
  border-bottom: 1px solid #1e1e2e;
  flex-shrink: 0;
}
.ai-head-title { color: #a78bfa; font-weight: bold; font-size: 13px; }
.ai-head-sub { color: #374151; font-size: 9px; }
.ai-closebtn {
  background: #1e1e2e; border: 1px solid #2d2d42;
  color: #888; width: 26px; height: 26px;
  border-radius: 6px; cursor: pointer; font-size: 12px;
}

.ai-tabs {
  display: flex;
  border-bottom: 1px solid #1e1e2e;
  flex-shrink: 0;
}
.ai-tabs button {
  flex: 1; padding: 9px; background: transparent;
  border: none; border-bottom: 2px solid transparent;
  color: #4b5563; font-family: monospace;
  font-size: 11px; cursor: pointer;
}
.ai-tabs button.active {
  color: #a78bfa;
  border-bottom-color: #7c3aed;
}

.ai-body {
  flex: 1; overflow-y: auto; padding: 12px;
  display: flex; flex-direction: column; gap: 10px;
}

.ai-label {
  color: #6b7280; font-size: 10px;
  text-transform: uppercase; margin-bottom: 3px; display: block;
}

.ai-modes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
}
.ai-mode {
  background: #13131a; border: 1px solid #1e1e2e;
  color: #6b7280; border-radius: 7px; padding: 7px;
  font-family: monospace; font-size: 11px;
  cursor: pointer; text-align: center; transition: all .15s;
}
.ai-mode.active {
  background: #7c3aed1a;
  border-color: #7c3aed;
  color: #a78bfa;
}

#ai-panel input,
#ai-panel textarea,
#ai-panel select {
  width: 100%; box-sizing: border-box;
  background: #13131a; border: 1px solid #1e1e2e;
  border-radius: 7px; color: #e5e7eb;
  font-family: monospace; font-size: 11px;
  padding: 8px 10px; outline: none;
  transition: border-color .15s;
}
#ai-panel input:focus,
#ai-panel textarea:focus,
#ai-panel select:focus { border-color: #7c3aed; }
#ai-panel textarea { min-height: 80px; resize: vertical; }
#ai-panel select option { background: #13131a; }

.ai-btn {
  width: 100%; padding: 10px;
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  border: none; border-radius: 7px; color: #fff;
  font-family: monospace; font-size: 12px;
  font-weight: bold; cursor: pointer;
  transition: opacity .15s;
}
.ai-btn:disabled { opacity: .45; cursor: not-allowed; }
.ai-btn:hover:not(:disabled) { opacity: .9; }

.ai-result-box {
  background: #0a0a10; border: 1px solid #1e1e2e;
  border-radius: 7px; overflow: hidden; display: none;
}
.ai-result-head {
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 6px 10px; background: #13131a;
  border-bottom: 1px solid #1e1e2e;
  color: #4b5563; font-size: 10px;
}
.ai-result-head button {
  background: #1e1e2e; border: 1px solid #2d2d42;
  color: #9ca3af; border-radius: 4px;
  padding: 2px 7px; font-size: 10px;
  font-family: monospace; cursor: pointer; margin-left: 4px;
}
#ai-out {
  padding: 10px; color: #86efac; font-size: 10px;
  line-height: 1.6; max-height: 200px; overflow-y: auto;
  white-space: pre-wrap; word-break: break-all; margin: 0;
}

.ai-log { font-size: 10px; min-height: 16px; }
.log-info  { color: #60a5fa; }
.log-ok    { color: #34d399; }
.log-err   { color: #f87171; }
.log-warn  { color: #fbbf24; }

.ai-row { display: flex; gap: 6px; }
.ai-row input { flex: 1; }
.ai-row button {
  background: #1e1e2e; border: 1px solid #2d2d42;
  color: #888; border-radius: 7px;
  padding: 0 10px; cursor: pointer; font-size: 13px;
}
.ai-link { color: #7c3aed; font-size: 10px; text-decoration: none; }
`;

  const HTML = `
<div class="ai-head">
  <div>
    <div class="ai-head-title">✦ AI Assistant</div>
    <div class="ai-head-sub">by Rafi Studio</div>
  </div>
  <button class="ai-closebtn" id="ai-x">✕</button>
</div>
<div class="ai-tabs">
  <button class="active" data-tab="gen">Generate</button>
  <button data-tab="cfg">Settings</button>
</div>

<div class="ai-body" id="tab-gen">
  <div>
    <span class="ai-label">Mode</span>
    <div class="ai-modes">
      <button class="ai-mode active" data-mode="folder">📁 Folder</button>
      <button class="ai-mode" data-mode="script">📄 Script</button>
      <button class="ai-mode" data-mode="image">🖼️ SVG</button>
      <button class="ai-mode" data-mode="free">💬 Bebas</button>
    </div>
  </div>
  <div>
    <span class="ai-label">Prompt</span>
    <textarea id="ai-prompt" placeholder="Contoh: Buat struktur folder project Express MVC..."></textarea>
  </div>
  <div id="ai-path-wrap">
    <span class="ai-label">Path Output <small style="color:#374151">(opsional)</small></span>
    <input id="ai-path" type="text" placeholder="/sdcard/MyProject" />
  </div>
  <button class="ai-btn" id="ai-go">⚡ Generate</button>
  <div class="ai-log" id="ai-log"></div>
  <div class="ai-result-box" id="ai-result-box">
    <div class="ai-result-head">
      <span>Output</span>
      <div>
        <button id="ai-copy">📋 Copy</button>
        <button id="ai-apply">✏️ Apply</button>
      </div>
    </div>
    <pre id="ai-out"></pre>
  </div>
</div>

<div class="ai-body" id="tab-cfg" style="display:none">
  <div>
    <span class="ai-label">OpenRouter API Key</span>
    <div class="ai-row">
      <input id="ai-key" type="password" placeholder="sk-or-v1-..." />
      <button id="ai-eye">👁</button>
    </div>
    <a class="ai-link" href="https://openrouter.ai/keys">Dapatkan API Key gratis →</a>
  </div>
  <div>
    <span class="ai-label">Model AI</span>
    <select id="ai-model">
      <option value="openai/gpt-4o-mini">GPT-4o Mini (Murah)</option>
      <option value="openai/gpt-4o">GPT-4o</option>
      <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
      <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
      <option value="google/gemini-flash-1.5">Gemini Flash 1.5</option>
      <option value="meta-llama/llama-3.1-8b-instruct:free">Llama 3.1 8B (Gratis)</option>
      <option value="mistralai/mistral-7b-instruct:free">Mistral 7B (Gratis)</option>
    </select>
  </div>
  <button class="ai-btn" id="ai-save">💾 Simpan Settings</button>
  <div class="ai-log" id="ai-cfg-log"></div>
</div>
`;

  class AIAssistant {
    constructor() {
      this._key = '';
      this._model = 'openai/gpt-4o-mini';
      this._mode = 'folder';
      this._open = false;
      this._btn = null;
      this._panel = null;
    }

    init() {
      try {
        var s = JSON.parse(localStorage.getItem(PLUGIN_ID) || '{}');
        this._key = s.apiKey || '';
        this._model = s.model || 'openai/gpt-4o-mini';
      } catch(e) {}

      var style = document.createElement('style');
      style.id = 'ai-css';
      style.textContent = CSS;
      document.head.appendChild(style);

      this._btn = document.createElement('button');
      this._btn.id = 'ai-float-btn';
      this._btn.title = 'AI Assistant';
      this._btn.textContent = '🤖';
      this._btn.addEventListener('click', this._toggle.bind(this));
      document.body.appendChild(this._btn);

      this._panel = document.createElement('div');
      this._panel.id = 'ai-panel';
      this._panel.innerHTML = HTML;
      document.body.appendChild(this._panel);

      this._bind();
    }

    _q(id) { return this._panel.querySelector('#' + id); }

    _bind() {
      var self = this;

      this._q('ai-x').addEventListener('click', function() { self._toggle(); });

      this._panel.querySelectorAll('.ai-tabs button').forEach(function(btn) {
        btn.addEventListener('click', function() {
          self._panel.querySelectorAll('.ai-tabs button').forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          self._q('tab-gen').style.display = btn.dataset.tab === 'gen' ? 'flex' : 'none';
          self._q('tab-cfg').style.display = btn.dataset.tab === 'cfg' ? 'flex' : 'none';
          if (btn.dataset.tab === 'cfg') {
            self._q('ai-key').value = self._key;
            self._q('ai-model').value = self._model;
          }
        });
      });

      this._panel.querySelectorAll('.ai-mode').forEach(function(btn) {
        btn.addEventListener('click', function() {
          self._panel.querySelectorAll('.ai-mode').forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          self._mode = btn.dataset.mode;
          self._q('ai-path-wrap').style.display = self._mode === 'free' ? 'none' : 'block';
        });
      });

      this._q('ai-eye').addEventListener('click', function() {
        var inp = self._q('ai-key');
        inp.type = inp.type === 'password' ? 'text' : 'password';
      });

      this._q('ai-save').addEventListener('click', function() {
        var key = self._q('ai-key').value.trim();
        var model = self._q('ai-model').value;
        if (!key) { self._log('ai-cfg-log', '❌ API Key kosong!', 'err'); return; }
        self._key = key;
        self._model = model;
        try { localStorage.setItem(PLUGIN_ID, JSON.stringify({ apiKey: key, model: model })); } catch(e) {}
        self._log('ai-cfg-log', '✅ Tersimpan!', 'ok');
      });

      this._q('ai-go').addEventListener('click', function() {
        var prompt = self._q('ai-prompt').value.trim();
        var path = self._q('ai-path').value.trim();
        if (!prompt) { self._log('ai-log', '❌ Tulis prompt dulu!', 'err'); return; }
        if (!self._key) { self._log('ai-log', '❌ Isi API Key di tab Settings!', 'err'); return; }
        self._generate(prompt, path);
      });

      this._q('ai-copy').addEventListener('click', function() {
        var txt = self._q('ai-out').textContent;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(txt).then(function() {
            self._log('ai-log', '✅ Copied!', 'ok');
          });
        }
      });

      this._q('ai-apply').addEventListener('click', function() {
        var txt = self._q('ai-out').textContent;
        try {
          if (window.acode) {
            var editor = acode.require('editor');
            if (editor) { editor.setValue(txt); self._log('ai-log', '✅ Applied ke editor!', 'ok'); return; }
          }
          self._log('ai-log', '⚠️ Tidak ada editor aktif', 'warn');
        } catch(e) { self._log('ai-log', '⚠️ ' + e.message, 'warn'); }
      });
    }

    _generate(prompt, outputPath) {
      var self = this;
      var goBtn = this._q('ai-go');
      goBtn.disabled = true;
      goBtn.textContent = '⏳ Generating...';
      this._q('ai-result-box').style.display = 'none';
      this._log('ai-log', '🔄 Menghubungi AI...', 'info');

      var sysMap = {
        folder: 'Kamu adalah AI developer assistant. Balas HANYA dengan JSON valid tanpa markdown:\n{"type":"folder_structure","description":"...","files":[{"path":"src/index.js","content":"// isi"},{"path":"package.json","content":"{}"}]}',
        script: 'Kamu adalah AI developer. Balas HANYA dengan JSON valid tanpa markdown:\n{"type":"script","filename":"index.js","language":"javascript","content":"// kode"}',
        image:  'Kamu adalah AI. Balas HANYA dengan JSON valid tanpa markdown:\n{"type":"image","format":"svg","filename":"image.svg","content":"<svg xmlns=\'http://www.w3.org/2000/svg\'></svg>"}',
        free:   'Kamu adalah AI assistant developer. Jawab dalam Bahasa Indonesia dengan jelas dan singkat.',
      };

      fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + self._key,
          'HTTP-Referer': 'https://acode.app',
          'X-Title': 'Acode AI Assistant by Rafi Studio',
        },
        body: JSON.stringify({
          model: self._model,
          messages: [
            { role: 'system', content: sysMap[self._mode] },
            { role: 'user', content: prompt },
          ],
        }),
      })
      .then(function(res) { return res.json().then(function(d) { return { ok: res.ok, data: d }; }); })
      .then(function(r) {
        if (!r.ok) throw new Error(r.data.error ? r.data.error.message : 'HTTP Error');
        var raw = r.data.choices && r.data.choices[0] && r.data.choices[0].message ? r.data.choices[0].message.content : '';

        if (self._mode === 'free') {
          self._q('ai-out').textContent = raw;
          self._q('ai-result-box').style.display = 'block';
          self._log('ai-log', '✅ Selesai!', 'ok');
        } else {
          var parsed;
          try {
            parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
          } catch(e) {
            self._q('ai-out').textContent = raw;
            self._q('ai-result-box').style.display = 'block';
            self._log('ai-log', '⚠️ Output bukan JSON — tampil raw', 'warn');
            return;
          }
          self._q('ai-out').textContent = JSON.stringify(parsed, null, 2);
          self._q('ai-result-box').style.display = 'block';

          if (outputPath) {
            if (parsed.files && Array.isArray(parsed.files)) {
              self._createFiles(parsed.files, outputPath);
            } else if (parsed.content && parsed.filename) {
              self._writeFile(outputPath + '/' + parsed.filename, parsed.content);
              self._log('ai-log', '✅ File disimpan: ' + parsed.filename, 'ok');
            }
          } else {
            var count = parsed.files ? parsed.files.length : 1;
            self._log('ai-log', '✅ Done! ' + count + ' file. Isi path untuk auto-simpan.', 'ok');
          }
        }
      })
      .catch(function(err) {
        self._log('ai-log', '❌ ' + err.message, 'err');
      })
      .finally(function() {
        goBtn.disabled = false;
        goBtn.textContent = '⚡ Generate';
      });
    }

    _createFiles(files, base) {
      var self = this;
      var ok = 0;
      var total = files.length;
      var promises = files.map(function(f) {
        return self._writeFile(base + '/' + f.path, f.content)
          .then(function() { ok++; })
          .catch(function(e) { console.warn('AI Plugin gagal buat ' + f.path, e); });
      });
      Promise.all(promises).then(function() {
        self._log('ai-log', '✅ ' + ok + '/' + total + ' file dibuat!', 'ok');
      });
    }

    _writeFile(fullPath, content) {
      return new Promise(function(resolve, reject) {
        try {
          if (window.acode) {
            var fsOperation = acode.require('fsOperation');
            if (fsOperation) {
              var parts = fullPath.replace(/\\/g, '/').split('/');
              parts.pop();
              var dir = parts.join('/');
              var doWrite = function() {
                fsOperation(fullPath).writeFile(new Blob([content], { type: 'text/plain' }))
                  .then(resolve).catch(reject);
              };
              if (dir) {
                fsOperation(dir).createDirectory().then(doWrite).catch(doWrite);
              } else { doWrite(); }
              return;
            }
          }
        } catch(e) {}
        // Fallback download
        var a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
        a.download = fullPath.split('/').pop() || 'output.txt';
        a.click();
        resolve();
      });
    }

    _log(id, msg, type) {
      var el = this._q(id);
      if (el) el.innerHTML = '<span class="log-' + (type || 'info') + '">' + msg + '</span>';
    }

    _toggle() {
      this._open = !this._open;
      this._panel.classList.toggle('open', this._open);
      this._btn.classList.toggle('active', this._open);
    }

    destroy() {
      if (this._panel) this._panel.remove();
      if (this._btn) this._btn.remove();
      var s = document.getElementById('ai-css');
      if (s) s.remove();
    }
  }

  var instance = new AIAssistant();

  if (window.acode) {
    acode.setPluginInit(PLUGIN_ID, function(baseUrl, $page, options) {
      instance.init();
    });
    acode.setPluginUnmount(PLUGIN_ID, function() {
      instance.destroy();
    });
  }

})();
