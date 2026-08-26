import './style.css';
import { injectGoogleFontsStylesheet, GOOGLE_FONTS } from './fonts.js';
import { AudioManager } from './audio-manager.js';
import { LyricsSync } from './lyrics-sync.js';
import { CanvasEditor } from './canvas-editor.js';
import { VideoExporter } from './video-exporter.js';
import { DEMO_LYRICS } from './demo-data.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject Fonts
  injectGoogleFontsStylesheet();
  
  // 2. Initialize Core Managers
  const audioManager = new AudioManager();
  const lyricsSync = new LyricsSync(audioManager);
  
  const previewCanvas = document.getElementById('preview-canvas');
  const canvasEditor = new CanvasEditor(previewCanvas, audioManager, lyricsSync);
  const videoExporter = new VideoExporter(canvasEditor, audioManager);
  
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 3. UI Element References
  const welcomeModal = document.getElementById('welcome-modal');
  const btnWelcomeDemo = document.getElementById('btn-welcome-demo');
  const btnWelcomeScratch = document.getElementById('btn-welcome-scratch');
  
  const exportModal = document.getElementById('export-modal');
  const btnTriggerExport = document.getElementById('btn-trigger-export');
  const btnStartExport = document.getElementById('btn-start-export');
  const btnCloseExport = document.getElementById('btn-close-export');
  const btnCancelExport = document.getElementById('btn-cancel-export');
  const exportSetupView = document.getElementById('export-setup-view');
  const exportProgressView = document.getElementById('export-progress-view');
  const exportProgressFill = document.getElementById('export-progress-fill');
  const exportPercent = document.getElementById('export-percent');
  const exportRes = document.getElementById('export-res');
  const exportMime = document.getElementById('export-mime');
  const chkExportMute = document.getElementById('chk-export-mute');
  const btnDownloadVideo = document.getElementById('btn-download-video');
  const btnCloseExportDone = document.getElementById('btn-close-export-done');
  const exportStatus = document.getElementById('export-status');
  const exportFps = document.getElementById('export-fps');
  const exportBitrate = document.getElementById('export-bitrate');
  const exportAudioBitrate = document.getElementById('export-audio-bitrate');
  const chkExportHw = document.getElementById('chk-export-hw');
  
  const btnOpenDemo = document.getElementById('btn-open-demo');
  const projectTypeBadge = document.getElementById('project-type-badge');
  const projectTitleLabel = document.getElementById('project-title-label');
  
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  // Media Tab Elements
  const inputAudio = document.getElementById('input-audio');
  const dropAudio = document.getElementById('drop-audio');
  const audioFileInfo = document.getElementById('audio-file-info');
  const bgOptColor = document.getElementById('bg-opt-color');
  const bgOptImg = document.getElementById('bg-opt-img');
  const bgOptVideo = document.getElementById('bg-opt-video');
  const bgSubColor = document.getElementById('bg-sub-color');
  const bgSubImg = document.getElementById('bg-sub-img');
  const bgSubVideo = document.getElementById('bg-sub-video');
  const colorPickerBg = document.getElementById('color-picker-bg');
  const colorHexBg = document.getElementById('color-hex-bg');
  const inputBgImg = document.getElementById('input-bg-img');
  const dropBgImg = document.getElementById('drop-bg-img');
  const bgImgInfo = document.getElementById('bg-img-info');
  const inputBgVideo = document.getElementById('input-bg-video');
  const dropBgVideo = document.getElementById('drop-bg-video');
  const bgVideoInfo = document.getElementById('bg-video-info');
  const inputLayerImg1 = document.getElementById('input-layer-img-1');
  const dropLayerImg1 = document.getElementById('drop-layer-img-1');
  const inputLayerImg2 = document.getElementById('input-layer-img-2');
  const dropLayerImg2 = document.getElementById('drop-layer-img-2');
  const inputLayerImg3 = document.getElementById('input-layer-img-3');
  const dropLayerImg3 = document.getElementById('drop-layer-img-3');
  
  const ratio916 = document.getElementById('ratio-9-16');
  const ratio169 = document.getElementById('ratio-16-9');
  const aspectFrame = document.getElementById('aspect-frame');
  const btnZoomFit = document.getElementById('btn-zoom-fit');
  const btnZoomMid = document.getElementById('btn-zoom-mid');
  const btnZoomFull = document.getElementById('btn-zoom-full');
  
  const btnChromaGreen = document.getElementById('btn-chroma-green');
  const btnChromaBlue = document.getElementById('btn-chroma-blue');
  
  // Lyrics Tab Elements
  const lyricsInputPanel = document.getElementById('lyrics-input-panel');
  const textareaLyrics = document.getElementById('textarea-lyrics');
  const btnParseLyrics = document.getElementById('btn-parse-lyrics');
  const lyricsSyncHud = document.getElementById('lyrics-sync-hud');
  const syncCurrentWord = document.getElementById('sync-current-word');
  const syncNextWords = document.getElementById('sync-next-words');
  const btnSyncTap = document.getElementById('btn-sync-tap');
  const btnSyncLineEnd = document.getElementById('btn-sync-line-end');
  const btnSyncCancel = document.getElementById('btn-sync-cancel');
  const lyricsEditorPanel = document.getElementById('lyrics-editor-panel');
  const btnResync = document.getElementById('btn-resync');
  const tableLyricsBody = document.getElementById('table-lyrics-body');
  
  // Style Tab Elements
  const selectFontFamily = document.getElementById('select-font-family');
  const toggleBold = document.getElementById('toggle-bold');
  const toggleItalic = document.getElementById('toggle-italic');
  const rangeFontSize = document.getElementById('range-font-size');
  const labelFontSize = document.getElementById('label-font-size');
  const rangeActiveScale = document.getElementById('range-active-scale');
  const labelActiveScale = document.getElementById('label-active-scale');
  const rangeInactiveScale = document.getElementById('range-inactive-scale');
  const labelInactiveScale = document.getElementById('label-inactive-scale');
  const rangeTextY = document.getElementById('range-text-y');
  const labelTextY = document.getElementById('label-text-y');
  const colorPickerText = document.getElementById('color-picker-text');
  const colorPickerHighlight = document.getElementById('color-picker-highlight');
  const colorPickerOutline = document.getElementById('color-picker-outline');
  const rangeOutlineWidth = document.getElementById('range-outline-width');
  const labelOutlineWidth = document.getElementById('label-outline-width');
  const selectAnimType = document.getElementById('select-anim-type');
  const selectTextAlign = document.getElementById('select-text-align');
  
  // Layers Tab Elements
  const layersEmptyState = document.getElementById('layers-empty-state');
  const layersListContainer = document.getElementById('layers-list-container');
  const layersListItems = document.getElementById('layers-list-items');
  const selectedLayerSettingsBox = document.getElementById('selected-layer-settings-box');
  const layerDetailTitle = document.getElementById('layer-detail-title');
  const rangeLayerOpacity = document.getElementById('range-layer-opacity');
  const labelLayerOpacity = document.getElementById('label-layer-opacity');
  const numLayerStart = document.getElementById('num-layer-start');
  const numLayerEnd = document.getElementById('num-layer-end');
  const btnLayerOrderUp = document.getElementById('btn-layer-order-up');
  const btnLayerOrderDown = document.getElementById('btn-layer-order-down');
  const btnLayerDelete = document.getElementById('btn-layer-delete');
  
  // Timeline Elements
  const btnPlayPause = document.getElementById('btn-play-pause');
  const playIcon = document.getElementById('play-icon');
  const btnStop = document.getElementById('btn-stop');
  const timeCurrent = document.getElementById('time-current');
  const timeDuration = document.getElementById('time-duration');
  const rangeVolume = document.getElementById('range-volume');
  const waveformCanvas = document.getElementById('waveform-canvas');
  const timelineLyricsTrack = document.getElementById('timeline-lyrics-track');
  
  // 4. Populate Fonts Options
  GOOGLE_FONTS.forEach(font => {
    const opt = document.createElement('option');
    opt.value = font.name;
    opt.textContent = `${font.name} (${font.category})`;
    opt.style.fontFamily = `"${font.name}", sans-serif`;
    selectFontFamily.appendChild(opt);
  });
  selectFontFamily.value = 'Bebas Neue';

  // 5. App Setup Toggles
  function loadProjectState(demo) {
    if (demo) {
      audioManager.loadDemo();
      lyricsSync.loadDemoLyrics();
      
      // Setup default styles
      canvasEditor.setBackgroundColor('#111827');
      colorPickerBg.value = '#111827';
      colorHexBg.textContent = '#111827';
      
      projectTypeBadge.textContent = "Demonstração";
      projectTitleLabel.textContent = "Mais Perto Quero Estar";
      
      textareaLyrics.value = DEMO_LYRICS;
      
      // Update UI panels to show timing grid
      showTimingGridEditor();
    } else {
      audioManager.stop();
      lyricsSync.parseLyrics("");
      canvasEditor.layers = [];
      canvasEditor.selectedLayerId = null;
      canvasEditor.setBackgroundColor('#000000');
      colorPickerBg.value = '#000000';
      colorHexBg.textContent = '#000000';
      
      projectTypeBadge.textContent = "Novo Projeto";
      projectTitleLabel.textContent = "Sem Título";
      
      textareaLyrics.value = "";
      
      lyricsInputPanel.classList.remove('hidden');
      lyricsSyncHud.classList.add('hidden');
      lyricsEditorPanel.classList.add('hidden');
      
      // Reset upload buttons
      audioFileInfo.classList.add('hidden');
      bgImgInfo.classList.add('hidden');
      bgVideoInfo.classList.add('hidden');
      dropAudio.classList.remove('hidden');
      dropBgImg.classList.remove('hidden');
      dropBgVideo.classList.remove('hidden');
    }
    
    // Clear list of layers
    updateLayersUI();
    renderTimelineLyrics();
  }

  // 6. Navigation Tabs Event Handler
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const paneId = btn.getAttribute('data-tab');
      document.getElementById(paneId).classList.add('active');
    });
  });

  // Welcome modal triggers
  btnWelcomeDemo.addEventListener('click', () => {
    loadProjectState(true);
    welcomeModal.classList.add('hidden');
  });
  
  btnWelcomeScratch.addEventListener('click', () => {
    loadProjectState(false);
    welcomeModal.classList.add('hidden');
  });
  
  btnOpenDemo.addEventListener('click', () => {
    loadProjectState(true);
  });

  // 7. Media Panel Events
  // Audio upload trigger
  dropAudio.addEventListener('click', () => inputAudio.click());
  inputAudio.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      audioManager.loadUserAudio(file);
      audioFileInfo.classList.remove('hidden');
      audioFileInfo.querySelector('.file-name-txt').textContent = file.name;
      projectTitleLabel.textContent = file.name.replace(/\.[^/.]+$/, ""); // strip extension
      projectTypeBadge.textContent = "Áudio Local";
    }
  });

  // Background Options Tabs switching
  function switchBgSubTab(tab) {
    bgSubColor.classList.add('hidden');
    bgSubImg.classList.add('hidden');
    bgSubVideo.classList.add('hidden');
    
    bgOptColor.classList.remove('active');
    bgOptImg.classList.remove('active');
    bgOptVideo.classList.remove('active');
    
    if (tab === 'color') {
      bgSubColor.classList.remove('hidden');
      bgOptColor.classList.add('active');
      canvasEditor.setBackgroundColor(colorPickerBg.value);
    } else if (tab === 'image') {
      bgSubImg.classList.remove('hidden');
      bgOptImg.classList.add('active');
      if (inputBgImg.files.length > 0) {
        canvasEditor.setBackgroundImage(inputBgImg.files[0]);
      }
    } else if (tab === 'video') {
      bgSubVideo.classList.remove('hidden');
      bgOptVideo.classList.add('active');
      if (inputBgVideo.files.length > 0) {
        canvasEditor.setBackgroundVideo(inputBgVideo.files[0]);
      }
    }
  }

  bgOptColor.addEventListener('click', () => switchBgSubTab('color'));
  bgOptImg.addEventListener('click', () => switchBgSubTab('image'));
  bgOptVideo.addEventListener('click', () => switchBgSubTab('video'));

  colorPickerBg.addEventListener('input', (e) => {
    colorHexBg.textContent = e.target.value.toUpperCase();
    canvasEditor.setBackgroundColor(e.target.value);
  });
  
  btnChromaGreen.addEventListener('click', () => {
    colorPickerBg.value = '#00FF00';
    colorHexBg.textContent = '#00FF00';
    canvasEditor.setBackgroundColor('#00FF00');
  });

  btnChromaBlue.addEventListener('click', () => {
    colorPickerBg.value = '#0000FF';
    colorHexBg.textContent = '#0000FF';
    canvasEditor.setBackgroundColor('#0000FF');
  });

  dropBgImg.addEventListener('click', () => inputBgImg.click());
  inputBgImg.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      canvasEditor.setBackgroundImage(file);
      bgImgInfo.classList.remove('hidden');
      bgImgInfo.querySelector('.file-name-txt').textContent = file.name;
    }
  });

  dropBgVideo.addEventListener('click', () => inputBgVideo.click());
  inputBgVideo.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      canvasEditor.setBackgroundVideo(file);
      bgVideoInfo.classList.remove('hidden');
      bgVideoInfo.querySelector('.file-name-txt').textContent = file.name;
    }
  });

  // Aspect Ratio Events
  ratio916.addEventListener('click', () => {
    ratio169.classList.remove('active');
    ratio916.classList.add('active');
    aspectFrame.classList.remove('aspect-16-9');
    aspectFrame.classList.add('aspect-9-16');
    canvasEditor.setAspectRatio('9:16');
  });
  
  ratio169.addEventListener('click', () => {
    ratio916.classList.remove('active');
    ratio169.classList.add('active');
    aspectFrame.classList.remove('aspect-9-16');
    aspectFrame.classList.add('aspect-16-9');
    canvasEditor.setAspectRatio('16:9');
  });
  
  // Zoom Controls Events
  function setZoom(level, btnElem) {
    btnZoomFit.classList.remove('active');
    btnZoomMid.classList.remove('active');
    btnZoomFull.classList.remove('active');
    btnElem.classList.add('active');
    
    aspectFrame.classList.remove('zoom-fit', 'zoom-mid', 'zoom-full');
    aspectFrame.classList.add('zoom-' + level);
  }
  
  btnZoomFit.addEventListener('click', () => setZoom('fit', btnZoomFit));
  btnZoomMid.addEventListener('click', () => setZoom('mid', btnZoomMid));
  btnZoomFull.addEventListener('click', () => setZoom('full', btnZoomFull));

  // Layer upload trigger
  function handleLayerUpload(fileInput) {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      canvasEditor.addForegroundLayer(file);
      document.querySelector('[data-tab="tab-layers"]').click();
      fileInput.value = "";
    }
  }

  dropLayerImg1.addEventListener('click', () => inputLayerImg1.click());
  inputLayerImg1.addEventListener('change', (e) => handleLayerUpload(e.target));
  
  dropLayerImg2.addEventListener('click', () => inputLayerImg2.click());
  inputLayerImg2.addEventListener('change', (e) => handleLayerUpload(e.target));
  
  dropLayerImg3.addEventListener('click', () => inputLayerImg3.click());
  inputLayerImg3.addEventListener('change', (e) => handleLayerUpload(e.target));

  // 8. Lyrics Sync Panel Events
  btnParseLyrics.addEventListener('click', () => {
    const text = textareaLyrics.value;
    if (text.trim().length === 0) {
      alert("Por favor, insira a letra da música.");
      return;
    }
    
    lyricsSync.parseLyrics(text);
    startSyncingHUD();
  });

  function startSyncingHUD() {
    lyricsInputPanel.classList.add('hidden');
    lyricsSyncHud.classList.remove('hidden');
    lyricsEditorPanel.classList.add('hidden');
    
    lyricsSync.startSync();
    updateSyncHUDPrompt();
  }

  function updateSyncHUDPrompt() {
    const idx = lyricsSync.currentSyncWordIndex;
    const words = lyricsSync.words;
    
    if (idx < words.length) {
      syncCurrentWord.textContent = words[idx].text;
      
      // show remaining phrases as a preview string
      const nextArr = words.slice(idx + 1, idx + 6).map(w => w.text);
      syncNextWords.textContent = nextArr.join(' // ') + (words.length > idx + 6 ? '...' : '');
      
      // Update button text for the last word
      if (idx === words.length - 1) {
        btnSyncTap.innerHTML = '<i data-lucide="check-circle"></i> CONCLUIR E SALVAR [Espaço]';
        btnSyncTap.classList.add('btn-success');
      } else {
        btnSyncTap.innerHTML = '<i data-lucide="hand"></i> MARCAR FRASE [Espaço]';
        btnSyncTap.classList.remove('btn-success');
      }
      if (window.lucide) window.lucide.createIcons();
    } else {
      syncCurrentWord.textContent = "Sincronização Concluída!";
      syncNextWords.textContent = "";
      btnSyncTap.innerHTML = '<i data-lucide="check-circle"></i> CONCLUIR E SALVAR [Espaço]';
    }
  }

  btnSyncTap.addEventListener('click', () => {
    if (lyricsSync.isSyncing) {
      lyricsSync.recordNextWord();
      updateSyncHUDPrompt();
    }
  });

  btnSyncLineEnd.addEventListener('click', () => {
    if (lyricsSync.isSyncing) {
      lyricsSync.recordLineEnd();
    }
  });

  btnSyncCancel.addEventListener('click', () => {
    lyricsSync.cancelSync();
    lyricsInputPanel.classList.remove('hidden');
    lyricsSyncHud.classList.add('hidden');
  });

  lyricsSync.onSyncComplete = () => {
    showTimingGridEditor();
  };
  
  // Timing offset slider - compensates for reaction time during sync recording
  const rangeTimingOffset = document.getElementById('range-timing-offset');
  const labelTimingOffset = document.getElementById('label-timing-offset');
  if (rangeTimingOffset) {
    rangeTimingOffset.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      lyricsSync.timingOffset = val;
      labelTimingOffset.textContent = (val >= 0 ? '+' : '') + val.toFixed(2) + 's';
      canvasEditor.needsRedraw = true;
    });
  }


  // Prevent Spacebar from triggering focused buttons click events (removes focus automatically)
  document.addEventListener('click', (e) => {
    if (e.target && e.target.tagName === 'BUTTON') {
      e.target.blur();
    }
  });

  // SRT Export & Import Listeners
  const btnExportSrt = document.getElementById('btn-export-srt');
  const btnImportSrt = document.getElementById('btn-import-srt');
  const btnImportSrtDirect = document.getElementById('btn-import-srt-direct');
  const inputImportSrt = document.getElementById('input-import-srt');

  if (btnExportSrt) {
    btnExportSrt.addEventListener('click', () => {
      exportToSRT();
    });
  }

  if (btnImportSrt) {
    btnImportSrt.addEventListener('click', () => {
      inputImportSrt.click();
    });
  }

  if (btnImportSrtDirect) {
    btnImportSrtDirect.addEventListener('click', () => {
      inputImportSrt.click();
    });
  }

  inputImportSrt.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        importFromSRT(event.target.result);
      };
      reader.readAsText(file);
      // Clear input so same file can be imported again
      inputImportSrt.value = "";
    }
  });

  // Helper function to format timestamp into SRT (HH:MM:SS,mmm)
  function formatSRTTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
  }

  // Helper function to parse SRT time into seconds
  function parseSRTTime(str) {
    if (!str) return 0;
    const clean = str.trim().replace(',', '.');
    const parts = clean.split(':');
    if (parts.length === 3) {
      const hrs = parseFloat(parts[0]) || 0;
      const mins = parseFloat(parts[1]) || 0;
      const secs = parseFloat(parts[2]) || 0;
      return hrs * 3600 + mins * 60 + secs;
    } else if (parts.length === 2) {
      const mins = parseFloat(parts[0]) || 0;
      const secs = parseFloat(parts[1]) || 0;
      return mins * 60 + secs;
    }
    return parseFloat(clean) || 0;
  }

  // Export timing array into SubRip (.srt) file format
  function exportToSRT() {
    const words = lyricsSync.words;
    if (words.length === 0) {
      alert("Nenhuma legenda disponível para exportar.");
      return;
    }
    let srtContent = "";
    
    words.forEach((w, index) => {
      const startSec = w.start !== null ? w.start : 0;
      const endSec = (w.end !== null && w.end > startSec) ? w.end : startSec + 2.5;
      
      srtContent += `${index + 1}\r\n`;
      srtContent += `${formatSRTTime(startSec)} --> ${formatSRTTime(endSec)}\r\n`;
      srtContent += `${w.text}\r\n\r\n`;
    });
    
    // Standard text/plain charset UTF-8 for valid .srt SubRip format
    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    let safeTitle = (projectTitleLabel.textContent || 'legendas').trim().replace(/[^a-zA-Z0-9\-_ \u00C0-\u00FF]/g, '_');
    if (!safeTitle.toLowerCase().endsWith('.srt')) {
      safeTitle += '.srt';
    }
    link.download = safeTitle;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);
  }

  // Parse SRT file and populate lyricsSync
  function importFromSRT(content) {
    // Clean UTF-8 BOM if present
    const cleanContent = content.replace(/^\uFEFF/, '').trim();
    
    // Split into subtitle blocks by double newlines or blank lines
    const rawBlocks = cleanContent.split(/\r?\n\s*\r?\n/);
    const newWords = [];
    
    rawBlocks.forEach((block) => {
      const lines = block.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length === 0) return;
      
      // Find line with timestamp arrow "-->"
      const timeLineIdx = lines.findIndex(l => l.includes('-->'));
      if (timeLineIdx !== -1) {
        const timeLine = lines[timeLineIdx];
        const timeParts = timeLine.split('-->');
        if (timeParts.length === 2) {
          const startTime = parseSRTTime(timeParts[0]);
          const endTime = parseSRTTime(timeParts[1]);
          const textLines = lines.slice(timeLineIdx + 1).join(' ').trim();
          
          if (textLines.length > 0 && !isNaN(startTime) && !isNaN(endTime)) {
            newWords.push({
              text: textLines,
              start: Math.max(0, startTime),
              end: Math.max(startTime + 0.1, endTime),
              lineIndex: newWords.length
            });
          }
        }
      }
    });
    
    // Fallback regex parsing if rawBlocks split didn't find blocks
    if (newWords.length === 0) {
      const blockRegex = /(\d+)\s*\r?\n(\d{2}:\d{2}:\d{2}[,\.]\d{1,3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,\.]\d{1,3})\s*\r?\n([\s\S]*?)(?=\r?\n\s*\d+\s*\r?\n|\r?\n*$)/g;
      let match;
      while ((match = blockRegex.exec(cleanContent)) !== null) {
        const start = parseSRTTime(match[2]);
        const end = parseSRTTime(match[3]);
        const text = match[4].replace(/\r?\n/g, ' ').trim();
        if (text.length > 0 && !isNaN(start) && !isNaN(end)) {
          newWords.push({
            text,
            start,
            end,
            lineIndex: newWords.length
          });
        }
      }
    }
    
    if (newWords.length > 0) {
      lyricsSync.words = newWords;
      lyricsSync.isSyncing = false;
      
      // Update text in lyrics editor input box
      const fullText = newWords.map(w => w.text).join('\n');
      textareaLyrics.value = fullText;
      
      // If project has no audio duration or imported subtitles exceed audio duration, update duration
      const maxSubTime = Math.max(...newWords.map(w => w.end || 0));
      if (maxSubTime > audioManager.duration) {
        audioManager.duration = Math.ceil(maxSubTime + 2);
      }
      
      showTimingGridEditor();
      renderTimelineLyrics();
      canvasEditor.needsRedraw = true;
      alert(`✅ Legendas SRT importadas com sucesso!\nForam carregadas ${newWords.length} frases sincronizadas.`);
    } else {
      alert("⚠️ Não foi possível decodificar o arquivo SRT. Verifique se o formato do arquivo é válido.");
    }
  }

  function showTimingGridEditor() {
    lyricsInputPanel.classList.remove('hidden');
    lyricsSyncHud.classList.add('hidden');
    lyricsEditorPanel.classList.remove('hidden');
    
    renderTimingTable();
    renderTimelineLyrics();
  }

  btnResync.addEventListener('click', () => {
    startSyncingHUD();
  });

  function renderTimingTable() {
    tableLyricsBody.innerHTML = "";
    
    lyricsSync.words.forEach((word, index) => {
      const row = document.createElement('tr');
      
      // Word text
      const tdWord = document.createElement('td');
      tdWord.textContent = word.text;
      tdWord.style.fontWeight = 'bold';
      row.appendChild(tdWord);
      
      // Start time
      const tdStart = document.createElement('td');
      const inputStart = document.createElement('input');
      inputStart.type = 'number';
      inputStart.value = word.start !== null ? word.start.toFixed(2) : "0.00";
      inputStart.step = "0.05";
      inputStart.style.width = "65px";
      inputStart.addEventListener('change', (e) => {
        lyricsSync.updateWordTiming(index, 'start', e.target.value);
        renderTimelineLyrics();
      });
      tdStart.appendChild(inputStart);
      row.appendChild(tdStart);
      
      // End time
      const tdEnd = document.createElement('td');
      const inputEnd = document.createElement('input');
      inputEnd.type = 'number';
      inputEnd.value = word.end !== null ? word.end.toFixed(2) : "0.00";
      inputEnd.step = "0.05";
      inputEnd.style.width = "65px";
      inputEnd.addEventListener('change', (e) => {
        lyricsSync.updateWordTiming(index, 'end', e.target.value);
        renderTimelineLyrics();
      });
      tdEnd.appendChild(inputEnd);
      row.appendChild(tdEnd);
      
      // Quick adjust buttons (+/- 0.1s)
      const tdAdjust = document.createElement('td');
      tdAdjust.className = 'tbl-cell-adjust';
      
      const btnMinus = document.createElement('button');
      btnMinus.className = 'adjust-btn';
      btnMinus.textContent = '-';
      btnMinus.title = 'Atrasar 0.1s';
      btnMinus.addEventListener('click', () => {
        const currentStart = word.start || 0;
        const currentEnd = word.end || 0;
        lyricsSync.updateWordTiming(index, 'start', Math.max(0, currentStart - 0.1));
        lyricsSync.updateWordTiming(index, 'end', Math.max(0, currentEnd - 0.1));
        inputStart.value = (word.start).toFixed(2);
        inputEnd.value = (word.end).toFixed(2);
        renderTimelineLyrics();
      });
      
      const btnPlus = document.createElement('button');
      btnPlus.className = 'adjust-btn';
      btnPlus.textContent = '+';
      btnPlus.title = 'Adiantar 0.1s';
      btnPlus.addEventListener('click', () => {
        const currentStart = word.start || 0;
        const currentEnd = word.end || 0;
        lyricsSync.updateWordTiming(index, 'start', currentStart + 0.1);
        lyricsSync.updateWordTiming(index, 'end', currentEnd + 0.1);
        inputStart.value = (word.start).toFixed(2);
        inputEnd.value = (word.end).toFixed(2);
        renderTimelineLyrics();
      });
      
      tdAdjust.appendChild(btnMinus);
      tdAdjust.appendChild(btnPlus);
      row.appendChild(tdAdjust);
      
      tableLyricsBody.appendChild(row);
    });
  }

  // 9. Lyrics Styles Panel Events
  selectFontFamily.addEventListener('change', (e) => {
    canvasEditor.updateStyle('fontFamily', e.target.value);
  });
  
  selectTextAlign.addEventListener('change', (e) => {
    canvasEditor.updateStyle('align', e.target.value);
  });
  
  toggleBold.addEventListener('click', () => {
    toggleBold.classList.toggle('active');
    canvasEditor.updateStyle('bold', toggleBold.classList.contains('active'));
  });
  
  toggleItalic.addEventListener('click', () => {
    toggleItalic.classList.toggle('active');
    canvasEditor.updateStyle('italic', toggleItalic.classList.contains('active'));
  });

  rangeFontSize.addEventListener('input', (e) => {
    labelFontSize.textContent = e.target.value + 'px';
    canvasEditor.updateStyle('fontSize', parseInt(e.target.value));
  });

  if (rangeActiveScale) {
    rangeActiveScale.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      labelActiveScale.textContent = val.toFixed(2) + 'x';
      canvasEditor.updateStyle('activeScale', val);
    });
  }

  if (rangeInactiveScale) {
    rangeInactiveScale.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      labelInactiveScale.textContent = val.toFixed(2) + 'x';
      canvasEditor.updateStyle('inactiveScale', val);
    });
  }

  rangeTextY.addEventListener('input', (e) => {
    labelTextY.textContent = e.target.value + '%';
    canvasEditor.updateStyle('yPosition', parseFloat(e.target.value) / 100);
  });

  colorPickerText.addEventListener('input', (e) => {
    canvasEditor.updateStyle('color', e.target.value);
  });

  colorPickerHighlight.addEventListener('input', (e) => {
    canvasEditor.updateStyle('highlightColor', e.target.value);
  });

  colorPickerOutline.addEventListener('input', (e) => {
    canvasEditor.updateStyle('strokeColor', e.target.value);
  });

  rangeOutlineWidth.addEventListener('input', (e) => {
    labelOutlineWidth.textContent = e.target.value + 'px';
    canvasEditor.updateStyle('strokeWidth', parseInt(e.target.value));
  });

  selectAnimType.addEventListener('change', (e) => {
    canvasEditor.updateStyle('animationType', e.target.value);
  });

  // 10. Layers Panel Event Listeners
  canvasEditor.onLayerSelected = (id) => {
    updateLayersUI();
    if (id === 'lyrics_layer') {
      const styleTabBtn = Array.from(tabButtons).find(btn => btn.getAttribute('data-tab') === 'tab-style');
      if (styleTabBtn) styleTabBtn.click();
    }
  };

  function updateLayersUI() {
    const layers = canvasEditor.layers;
    const selectedId = canvasEditor.selectedLayerId;
    
    if (layers.length === 0) {
      layersEmptyState.classList.remove('hidden');
      layersListContainer.classList.add('hidden');
      return;
    }
    
    layersEmptyState.classList.add('hidden');
    layersListContainer.classList.remove('hidden');
    
    layersListItems.innerHTML = "";
    
    // Draw layer list (top layers first)
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      const div = document.createElement('div');
      div.className = `layer-item-row ${layer.id === selectedId ? 'selected' : ''}`;
      div.addEventListener('click', () => {
        canvasEditor.selectedLayerId = layer.id;
        updateLayersUI();
      });
      
      const info = document.createElement('div');
      info.className = 'layer-item-info';
      info.innerHTML = `<i data-lucide="image"></i> <span>${layer.name}</span>`;
      
      const controls = document.createElement('div');
      controls.className = 'layer-item-controls';
      controls.innerHTML = `<span class="badge" style="font-size:0.6rem; border:0; background:rgba(255,255,255,0.06); color:#fff;">Camada ${i+1}</span>`;
      
      div.appendChild(info);
      div.appendChild(controls);
      layersListItems.appendChild(div);
    }
    
    // Run Lucide update to show icons inside items
    if (window.lucide) {
      window.lucide.createIcons();
    }
    
    // Selected Layer Details Panel
    const selectedLayer = layers.find(l => l.id === selectedId);
    
    // Hide detail box if no layer is selected
    if (!selectedLayer || selectedId === 'lyrics_layer') {
      selectedLayerSettingsBox.classList.add('hidden');
    } else {
      selectedLayerSettingsBox.classList.remove('hidden');
      layerDetailTitle.textContent = selectedLayer.name;
      
      // Load current inputs values
      rangeLayerOpacity.value = selectedLayer.opacity;
      labelLayerOpacity.textContent = Math.round(selectedLayer.opacity * 100) + '%';
      numLayerStart.value = selectedLayer.start;
      numLayerEnd.value = selectedLayer.end;
    }
  }

  // Click outside canvas / on viewport background to deselect all
  const editorViewport = document.querySelector('.editor-viewport');
  if (editorViewport) {
    editorViewport.addEventListener('pointerdown', (e) => {
      if (e.target === editorViewport || e.target.id === 'main-canvas-container' || e.target.id === 'aspect-frame') {
        canvasEditor.selectedLayerId = null;
        canvasEditor.needsRedraw = true;
        updateLayersUI();
      }
    });
  }

  rangeLayerOpacity.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    labelLayerOpacity.textContent = Math.round(val * 100) + '%';
    if (canvasEditor.selectedLayerId) {
      canvasEditor.updateLayerOpacity(canvasEditor.selectedLayerId, val);
    }
  });

  numLayerStart.addEventListener('change', (e) => {
    const val = Math.max(0, parseFloat(e.target.value));
    if (canvasEditor.selectedLayerId) {
      const layer = canvasEditor.layers.find(l => l.id === canvasEditor.selectedLayerId);
      if (layer) layer.start = val;
    }
  });

  numLayerEnd.addEventListener('change', (e) => {
    const val = Math.max(0, parseFloat(e.target.value));
    if (canvasEditor.selectedLayerId) {
      const layer = canvasEditor.layers.find(l => l.id === canvasEditor.selectedLayerId);
      if (layer) layer.end = val;
    }
  });

  btnLayerOrderUp.addEventListener('click', () => {
    if (canvasEditor.selectedLayerId) {
      canvasEditor.updateLayerZIndex(canvasEditor.selectedLayerId, 'up');
      updateLayersUI();
    }
  });

  btnLayerOrderDown.addEventListener('click', () => {
    if (canvasEditor.selectedLayerId) {
      canvasEditor.updateLayerZIndex(canvasEditor.selectedLayerId, 'down');
      updateLayersUI();
    }
  });

  btnLayerDelete.addEventListener('click', () => {
    if (canvasEditor.selectedLayerId) {
      canvasEditor.deleteLayer(canvasEditor.selectedLayerId);
      updateLayersUI();
    }
  });

  // 11. Timeline, Waveform and Playback Actions
  btnPlayPause.addEventListener('click', () => {
    togglePlayback();
  });

  function togglePlayback() {
    if (audioManager.isPlaying) {
      audioManager.pause();
      playIcon.setAttribute('data-lucide', 'play');
    } else {
      audioManager.play();
      playIcon.setAttribute('data-lucide', 'pause');
    }
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  btnStop.addEventListener('click', () => {
    audioManager.stop();
    playIcon.setAttribute('data-lucide', 'play');
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  // Audio manager updates time
  audioManager.onTimeUpdateCallback = (time) => {
    // Format minutes and seconds
    const curMin = Math.floor(time / 60).toString().padStart(2, '0');
    const curSec = Math.floor(time % 60).toString().padStart(2, '0');
    const durMin = Math.floor(audioManager.duration / 60).toString().padStart(2, '0');
    const durSec = Math.floor(audioManager.duration % 60).toString().padStart(2, '0');
    
    timeCurrent.textContent = `${curMin}:${curSec}`;
    timeDuration.textContent = `${durMin}:${durSec}`;
    
    // Highlight timeline blocks active styles
    const activeData = lyricsSync.getActiveElementsAtTime(time);
    const timelineBlocks = document.querySelectorAll('.timeline-lyric-block');
    timelineBlocks.forEach(block => {
      const lIdx = parseInt(block.getAttribute('data-line'));
      if (lIdx === activeData.lineIndex) {
        block.classList.add('active');
      } else {
        block.classList.remove('active');
      }
    });
  };

  audioManager.onEndCallback = () => {
    playIcon.setAttribute('data-lucide', 'play');
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  rangeVolume.addEventListener('input', (e) => {
    audioManager.setVolume(parseFloat(e.target.value));
  });

  // Timeline waveform scrub scrubbing
  waveformCanvas.addEventListener('click', (e) => {
    const rect = waveformCanvas.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    const seekTime = clickRatio * audioManager.duration;
    audioManager.seek(seekTime);
  });

  // Renders interactive lyric bars in timeline track with drag and resize
  function renderTimelineLyrics() {
    timelineLyricsTrack.innerHTML = "";
    
    const lines = lyricsSync.getLines();
    const duration = audioManager.duration || 32;
    
    lines.forEach((line, index) => {
      // If timestamps are not synced yet
      if (line.start === null || line.start === Infinity || line.end === -Infinity) return;
      
      const start = Math.max(0, line.start);
      const end = (line.end !== null && line.end > start) ? line.end : (start + 2.0);
      
      const leftPercent = (start / duration) * 100;
      const widthPercent = Math.max(0.5, ((end - start) / duration) * 100);
      
      const block = document.createElement('div');
      block.className = 'timeline-lyric-block';
      block.style.left = `${leftPercent}%`;
      block.style.width = `${widthPercent}%`;
      block.setAttribute('data-line', index);
      
      // Left resize handle (adjusts start)
      const handleLeft = document.createElement('div');
      handleLeft.className = 'lyric-handle-left';
      handleLeft.title = 'Arrastar início da frase';
      
      // Text element
      const textSpan = document.createElement('span');
      textSpan.className = 'lyric-block-text';
      textSpan.textContent = line.words.map(w => w.text).join(' ');
      
      // Right resize handle (adjusts end)
      const handleRight = document.createElement('div');
      handleRight.className = 'lyric-handle-right';
      handleRight.title = 'Arrastar fim da frase';
      
      block.appendChild(handleLeft);
      block.appendChild(textSpan);
      block.appendChild(handleRight);
      
      // Tooltip helpers
      let tooltip = null;
      function showTooltip(text) {
        if (!tooltip) {
          tooltip = document.createElement('div');
          tooltip.className = 'timeline-drag-tooltip';
          block.appendChild(tooltip);
        }
        tooltip.textContent = text;
      }
      function removeTooltip() {
        if (tooltip) {
          tooltip.remove();
          tooltip = null;
        }
      }
      
      function formatShortTime(sec) {
        const m = Math.floor(sec / 60);
        const s = (sec % 60).toFixed(2);
        return `${String(m).padStart(2, '0')}:${s.padStart(5, '0')}`;
      }

      // Drag and resize interaction handler
      function initBlockInteraction(e, mode) {
        e.preventDefault();
        e.stopPropagation();
        
        const trackRect = timelineLyricsTrack.getBoundingClientRect();
        const trackWidth = trackRect.width;
        if (trackWidth <= 0) return;
        
        const startMouseX = e.clientX;
        const origStart = lyricsSync.words[index].start !== null ? lyricsSync.words[index].start : 0;
        const origEnd = lyricsSync.words[index].end !== null ? lyricsSync.words[index].end : (origStart + 2.0);
        const origDuration = origEnd - origStart;
        
        block.classList.add('dragging');
        if (mode === 'resize-left') handleLeft.classList.add('active');
        if (mode === 'resize-right') handleRight.classList.add('active');
        
        let hasMoved = false;
        let curStart = origStart;
        let curEnd = origEnd;

        function onPointerMove(moveEvt) {
          const deltaX = moveEvt.clientX - startMouseX;
          if (Math.abs(deltaX) > 2) hasMoved = true;
          
          const deltaSeconds = (deltaX / trackWidth) * (audioManager.duration || 32);
          
          if (mode === 'move') {
            // Shift whole block
            curStart = Math.max(0, origStart + deltaSeconds);
            curEnd = curStart + origDuration;
            if (curEnd > (audioManager.duration || 32)) {
              curEnd = audioManager.duration || 32;
              curStart = Math.max(0, curEnd - origDuration);
            }
          } else if (mode === 'resize-left') {
            // Resize start
            curStart = Math.max(0, Math.min(origEnd - 0.1, origStart + deltaSeconds));
            curEnd = origEnd;
          } else if (mode === 'resize-right') {
            // Resize end
            curEnd = Math.max(origStart + 0.1, Math.min(audioManager.duration || 32, origEnd + deltaSeconds));
            curStart = origStart;
          }
          
          // Live block styling
          const liveLeft = (curStart / (audioManager.duration || 32)) * 100;
          const liveWidth = Math.max(0.5, ((curEnd - curStart) / (audioManager.duration || 32)) * 100);
          block.style.left = `${liveLeft}%`;
          block.style.width = `${liveWidth}%`;
          
          // Update model
          lyricsSync.words[index].start = curStart;
          lyricsSync.words[index].end = curEnd;
          
          // Tooltip
          const durSec = (curEnd - curStart).toFixed(2);
          showTooltip(`${formatShortTime(curStart)} ➔ ${formatShortTime(curEnd)} (${durSec}s)`);
          
          canvasEditor.needsRedraw = true;
        }

        function onPointerUp() {
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
          
          block.classList.remove('dragging');
          handleLeft.classList.remove('active');
          handleRight.classList.remove('active');
          removeTooltip();
          
          if (!hasMoved && mode === 'move') {
            audioManager.seek(origStart);
          } else {
            renderTimingTable();
            renderTimelineLyrics();
            canvasEditor.needsRedraw = true;
          }
        }

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
      }

      // Handle Left Event
      handleLeft.addEventListener('pointerdown', (e) => {
        initBlockInteraction(e, 'resize-left');
      });

      // Handle Right Event
      handleRight.addEventListener('pointerdown', (e) => {
        initBlockInteraction(e, 'resize-right');
      });

      // Main Block Move Event
      block.addEventListener('pointerdown', (e) => {
        if (e.target === handleLeft || e.target === handleRight) return;
        initBlockInteraction(e, 'move');
      });
      
      timelineLyricsTrack.appendChild(block);
    });
  }

  // 12. Video Export Actions
  btnTriggerExport.addEventListener('click', () => {
    // Populate resolution and mimeTypes
    const supportedTypes = videoExporter.getSupportedMimeTypes();
    exportMime.innerHTML = "";
    
    // Choose appropriate friendly names
    supportedTypes.forEach(type => {
      const opt = document.createElement('option');
      opt.value = type;
      if (type.includes('codecs=vp9')) {
        opt.textContent = "WebM (Codec VP9 - Alta Qualidade)";
      } else if (type.includes('codecs=h264')) {
        opt.textContent = "WebM (Codec H.264 - Altamente Compatível)";
      } else if (type.includes('mp4')) {
        opt.textContent = "MP4 (Nativo)";
      } else {
        opt.textContent = `WebM Padrão (${type.split(';')[0]})`;
      }
      exportMime.appendChild(opt);
    });
    
    exportModal.classList.remove('hidden');
    exportSetupView.classList.remove('hidden');
    exportProgressView.classList.add('hidden');
    
    // Stop playback if playing
    if (audioManager.isPlaying) {
      audioManager.pause();
      playIcon.setAttribute('data-lucide', 'play');
      if (window.lucide) window.lucide.createIcons();
    }
  });

  // Temporary storage variables for finished export blob
  let lastExportedBlob = null;
  let lastExportedMime = "";
  let lastExportedWidth = 1080;
  let lastExportedHeight = 1920;

  btnStartExport.addEventListener('click', () => {
    const resValue = exportRes.value.split('x');
    let w = parseInt(resValue[0]);
    let h = parseInt(resValue[1]);
    
    if (aspectFrame.classList.contains('aspect-16-9')) {
      const temp = w;
      w = h;
      h = temp;
    }
    
    const mime = exportMime.value;
    const mute = chkExportMute.checked;
    
    const fps = parseInt(exportFps.value) || 30;
    const vBitrate = parseInt(exportBitrate.value) || 5000000;
    const aBitrate = parseInt(exportAudioBitrate.value) || 192000;
    
    exportSetupView.classList.add('hidden');
    exportProgressView.classList.remove('hidden');
    
    exportPercent.textContent = "0%";
    exportProgressFill.style.width = "0%";
    exportStatus.textContent = "Renderizando quadros...";
    
    // Reset buttons visibility
    btnDownloadVideo.classList.add('hidden');
    btnCancelExport.classList.remove('hidden');
    btnCloseExportDone.classList.add('hidden');
    
    lastExportedBlob = null;
    lastExportedMime = mime;
    lastExportedWidth = w;
    lastExportedHeight = h;
    
    // Start exporting with custom OBS parameters
    videoExporter.exportVideo(w, h, mime, mute, fps, vBitrate, aBitrate);
  });

  videoExporter.onProgress = (percent) => {
    exportPercent.textContent = `${percent}%`;
    exportProgressFill.style.width = `${percent}%`;
    if (percent >= 100) {
      exportStatus.textContent = "Finalizando empacotamento...";
    } else {
      exportStatus.textContent = "Renderizando e gravando vídeo...";
    }
  };

  videoExporter.onComplete = (blob, mimeType, width, height) => {
    lastExportedBlob = blob;
    lastExportedMime = mimeType;
    lastExportedWidth = width;
    lastExportedHeight = height;
    
    exportPercent.textContent = "100%";
    exportProgressFill.style.width = "100%";
    exportStatus.textContent = "Vídeo gerado com sucesso! Clique no botão verde abaixo para escolher a pasta e salvar no seu computador.";
    
    // Toggle action button visibilities (safe user gesture transition)
    btnDownloadVideo.classList.remove('hidden');
    btnCancelExport.classList.add('hidden');
    btnCloseExportDone.classList.remove('hidden');
  };

  videoExporter.onError = (err) => {
    exportModal.classList.add('hidden');
    alert("Erro na exportação: " + err.message);
  };

  btnDownloadVideo.addEventListener('click', () => {
    if (lastExportedBlob) {
      const ext = lastExportedMime.includes('mp4') ? 'mp4' : 'webm';
      videoExporter.saveFile(lastExportedBlob, lastExportedWidth, lastExportedHeight, ext, lastExportedMime)
        .then(() => {
          exportModal.classList.add('hidden');
        })
        .catch(err => {
          console.warn("Save file canceled or failed", err);
        });
    }
  });

  btnCloseExportDone.addEventListener('click', () => {
    exportModal.classList.add('hidden');
  });

  btnCancelExport.addEventListener('click', () => {
    videoExporter.cancelExport();
    exportModal.classList.add('hidden');
  });

  btnCloseExport.addEventListener('click', () => {
    exportModal.classList.add('hidden');
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // If user is editing a text input or text area, ignore shortcuts
    const active = document.activeElement;
    
    // 1. If in active sync mode, Spacebar and Enter should always record timing globally
    if (lyricsSync.isSyncing) {
      if (e.key === ' ') {
        e.preventDefault();
        lyricsSync.recordNextWord();
        updateSyncHUDPrompt();
        return;
      } else if (e.key === 'Enter') {
        e.preventDefault();
        lyricsSync.recordLineEnd();
        return;
      }
    }
    
    // 2. Otherwise, if typing in input fields, let keys behave normally
    if (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT' || active.contentEditable === 'true') {
      return;
    }
    
    // 3. Spacebar toggles playback in standard editor mode
    if (e.key === ' ') {
      e.preventDefault();
      togglePlayback();
    }
    
    // Delete key removes selected layer
    if (e.key === 'Delete' && canvasEditor.selectedLayerId) {
      canvasEditor.deleteLayer(canvasEditor.selectedLayerId);
      updateLayersUI();
    }
    
    // Arrow keys nudge selected layer coordinates
    if (canvasEditor.selectedLayerId) {
      const layer = canvasEditor.layers.find(l => l.id === canvasEditor.selectedLayerId);
      if (layer) {
        let nudge = 5;
        if (e.shiftKey) nudge = 20;
        
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          layer.y -= nudge;
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          layer.y += nudge;
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          layer.x -= nudge;
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          layer.x += nudge;
        }
      }
    }
  });

  // 13. Application Animation/Drawing Render Loop
  let lastDrawTime = -1;
  
  function animationLoop() {
    const curTime = audioManager.currentTime;
    
    // Draw background video update (if video is currently playing)
    let needsRedraw = audioManager.isPlaying;
    
    if (canvasEditor.background.type === 'video' && canvasEditor.background.element) {
      const vid = canvasEditor.background.element;
      // Sync background video speed/playing state to AudioManager
      if (audioManager.isPlaying) {
        if (vid.paused) vid.play().catch(e => {});
      } else {
        if (!vid.paused) vid.pause();
      }
      
      // If background is video, we need to redraw continuously at screen FPS
      needsRedraw = true;
    }
    
    // Only redraw on state transitions, scrubbing, video updates, or manual modifications
    if (needsRedraw || curTime !== lastDrawTime || canvasEditor.isDragging || canvasEditor.isResizing || canvasEditor.needsRedraw) {
      // Draw Preview screen
      canvasEditor.render(previewCanvas, curTime);
      
      // Draw Waveform playhead line update
      audioManager.drawWaveform(waveformCanvas, curTime);
      
      lastDrawTime = curTime;
      canvasEditor.needsRedraw = false; // Reset instant repaint flag
    }
    
    requestAnimationFrame(animationLoop);
  }
  
  // Start loop immediately
  requestAnimationFrame(animationLoop);
});
