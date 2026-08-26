export class CanvasEditor {
  constructor(canvas, audioManager, lyricsSync) {
    this.canvas = canvas; // The display canvas
    this.ctx = canvas.getContext('2d');
    this.audioManager = audioManager;
    this.lyricsSync = lyricsSync;
    
    // Project States
    this.background = { type: 'color', color: '#111827', file: null, url: '', element: null };
    this.layers = []; // Array of foreground images/elements
    this.selectedLayerId = null;
    
    // Virtual resolution (1080x1920)
    this.vWidth = 1080;
    this.vHeight = 1920;
    
    // Lyrics style config
    this.lyricsStyle = {
      fontFamily: 'Bebas Neue',
      fontSize: 70,
      activeScale: 1.3, // Zoom magnification on the active singing line (1.0x - 2.5x)
      inactiveScale: 0.75, // Scale for inactive surrounding lines (0.4x - 1.0x)
      bold: true,
      italic: false,
      align: 'center', // left, right, center, justify
      color: '#ffffff',
      highlightColor: '#f43f5e', // Neon pink highlight
      strokeColor: '#000000',
      strokeWidth: 8,
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowBlur: 10,
      yPosition: 0.75, // percentage down the screen (lower third)
      animationType: 'sweep' // sweep, word, bounce, scroll
    };
    
    // Default interactive container for subtitles (adjustable by mouse)
    this.lyricsContainer = { x: 100, y: 1200, width: 880, height: 500 };
    
    // Interaction states
    this.isDragging = false;
    this.isResizing = false;
    this.resizeHandle = null; // 'tl', 'tr', 'bl', 'br'
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.needsRedraw = false; // Flag to trigger instant repaints when paused
    
    this.handleSize = 24; // Handle size in virtual coordinates
    
    // Mouse event listeners on display canvas
    this.initMouseEvents();
  }

  // Set style config parameters
  updateStyle(key, value) {
    this.lyricsStyle[key] = value;
    this.needsRedraw = true;
  }

  setAspectRatio(ratio) {
    if (ratio === '16:9') {
      this.vWidth = 1920;
      this.vHeight = 1080;
      this.canvas.width = 640;
      this.canvas.height = 360;
    } else {
      this.vWidth = 1080;
      this.vHeight = 1920;
      this.canvas.width = 360;
      this.canvas.height = 640;
    }
    // Default interactive container for subtitles (adjustable by mouse)
    if (ratio === '16:9') {
      this.lyricsContainer = { x: 500, y: 700, width: 920, height: 350 };
    } else {
      this.lyricsContainer = { x: 100, y: 1200, width: 880, height: 500 };
    }
    this.needsRedraw = true;
  }

  // Background configurations
  setBackgroundColor(color) {
    this.background = { type: 'color', color, file: null, url: '', element: null };
    this.needsRedraw = true;
  }

  setBackgroundImage(file) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      this.background = { type: 'image', color: '', file, url, element: img };
      this.needsRedraw = true;
      if (this.onLayersUpdated) this.onLayersUpdated();
    };
  }

  setBackgroundVideo(file) {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.load();
    video.onloadeddata = () => {
      this.background = { type: 'video', color: '', file, url, element: video };
      // Play background video if main track is playing
      if (this.audioManager.isPlaying) {
        video.play().catch(e => console.log("Video auto play prevented", e));
      }
      this.needsRedraw = true;
      if (this.onLayersUpdated) this.onLayersUpdated();
    };
  }

  // Foreground Image Layers
  addForegroundLayer(file) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      // Scale down image to fit in the center initially
      let w = img.width;
      let h = img.height;
      const maxW = 600;
      if (w > maxW) {
        h = h * (maxW / w);
        w = maxW;
      }
      
      const layerStart = this.audioManager.trimStart !== undefined ? this.audioManager.trimStart : 0;
      const layerEnd = this.audioManager.trimEnd !== undefined ? this.audioManager.trimEnd : (this.audioManager.duration || 32);

      const newLayer = {
        id: 'layer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: 'image',
        file,
        url,
        element: img,
        x: (this.vWidth - w) / 2,
        y: (this.vHeight - h) / 3, // upper third
        width: w,
        height: h,
        opacity: 1.0,
        start: layerStart,
        end: layerEnd
      };
      
      this.layers.push(newLayer);
      this.selectedLayerId = newLayer.id;
      this.needsRedraw = true;
      if (this.onLayersUpdated) this.onLayersUpdated();
    };
  }

  // Add Visualizer / Audio Spectrum Layer
  addSpectrumLayer(customProps = {}) {
    const layerStart = this.audioManager.trimStart !== undefined ? this.audioManager.trimStart : 0;
    const layerEnd = this.audioManager.trimEnd !== undefined ? this.audioManager.trimEnd : (this.audioManager.duration || 32);
    const size = 520;

    const newLayer = {
      id: 'spectrum_' + Date.now() + '_' + Math.random().toString(36).substr(2, 7),
      name: 'Espectro ' + (this.layers.filter(l => l.type === 'spectrum').length + 1),
      type: 'spectrum',
      spectrumType: customProps.spectrumType || 'circular-bars', // 'circular-bars' | 'circular-wave' | 'linear-bars' | 'wave-line' | 'radial-dots'
      preset: customProps.preset || 'cyberpunk', // 'cyberpunk' | 'trap-red' | 'vaporwave' | 'electric-blue' | 'custom'
      color1: customProps.color1 || '#06b6d4',
      color2: customProps.color2 || '#d946ef',
      isGradient: customProps.isGradient !== undefined ? customProps.isGradient : true,
      glow: customProps.glow !== undefined ? customProps.glow : 16,
      sensitivity: customProps.sensitivity || 1.3,
      beatPunch: customProps.beatPunch !== undefined ? customProps.beatPunch : 2.2,
      barCount: customProps.barCount || 64,
      barWidth: customProps.barWidth || 5,
      radius: customProps.radius || 120,
      centerImage: null,
      centerImageUrl: '',
      x: (this.vWidth - size) / 2,
      y: (this.vHeight - size) / 2 - 40,
      width: size,
      height: size,
      opacity: 1.0,
      start: layerStart,
      end: layerEnd,
      ...customProps
    };

    this.layers.push(newLayer);
    this.selectedLayerId = newLayer.id;
    this.needsRedraw = true;
    if (this.onLayersUpdated) this.onLayersUpdated();
    return newLayer;
  }

  deleteLayer(id) {
    this.layers = this.layers.filter(l => l.id !== id);
    if (this.selectedLayerId === id) this.selectedLayerId = null;
    this.needsRedraw = true;
    if (this.onLayersUpdated) this.onLayersUpdated();
  }

  updateLayerOpacity(id, opacity) {
    const layer = this.layers.find(l => l.id === id);
    if (layer) {
      layer.opacity = parseFloat(opacity);
      this.needsRedraw = true;
    }
  }

  updateLayerZIndex(id, direction) {
    const index = this.layers.findIndex(l => l.id === id);
    if (index === -1) return;
    
    if (direction === 'up' && index < this.layers.length - 1) {
      // Swap with next
      const temp = this.layers[index];
      this.layers[index] = this.layers[index + 1];
      this.layers[index + 1] = temp;
      this.needsRedraw = true;
      if (this.onLayersUpdated) this.onLayersUpdated();
    } else if (direction === 'down' && index > 0) {
      // Swap with previous
      const temp = this.layers[index];
      this.layers[index] = this.layers[index - 1];
      this.layers[index - 1] = temp;
      this.needsRedraw = true;
      if (this.onLayersUpdated) this.onLayersUpdated();
    }
  }

  // Convert client coordinate to virtual coordinate
  getClientToVirtualCoords(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (this.vWidth / rect.width);
    const y = (clientY - rect.top) * (this.vHeight / rect.height);
    return { x, y };
  }

  // Mouse Interaction Handlers
  initMouseEvents() {
    this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mouseup', () => this.handleMouseUp());
  }

  handleMouseDown(e) {
    const { x, y } = this.getClientToVirtualCoords(e.clientX, e.clientY);
    const currentTime = this.audioManager.currentTime;
    
    // 1. Check if selected layer's resize handles are clicked
    if (this.selectedLayerId) {
      const isLyrics = this.selectedLayerId === 'lyrics_layer';
      const layer = isLyrics ? this.lyricsContainer : this.layers.find(l => l.id === this.selectedLayerId);
      if (layer && (isLyrics || (currentTime >= layer.start && currentTime <= layer.end))) {
        const hs = this.handleSize;
        const lx = layer.x;
        const ly = layer.y;
        const lw = layer.width;
        const lh = layer.height;
        
        // Handles check (circles around the layer border)
        const handles = {
          tl: { x: lx, y: ly },
          tr: { x: lx + lw, y: ly },
          bl: { x: lx, y: ly + lh },
          br: { x: lx + lw, y: ly + lh }
        };
        
        for (const [key, pos] of Object.entries(handles)) {
          const dist = Math.hypot(x - pos.x, y - pos.y);
          if (dist < hs) {
            this.isResizing = true;
            this.resizeHandle = key;
            return; // don't check other layers
          }
        }
      }
    }
    
    // 2. Check if clicked inside any foreground image layer (prioritize top elements)
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i];
      if (currentTime >= layer.start && currentTime <= layer.end) {
        if (x >= layer.x && x <= layer.x + layer.width &&
            y >= layer.y && y <= layer.y + layer.height) {
          this.selectedLayerId = layer.id;
          this.isDragging = true;
          this.dragOffsetX = x - layer.x;
          this.dragOffsetY = y - layer.y;
          this.needsRedraw = true;
          
          if (this.onLayerSelected) this.onLayerSelected(layer.id);
          return;
        }
      }
    }

    // 3. Check if clicked directly on the lyrics text area or if lyrics is already selected
    const lyc = this.lyricsContainer;
    const yCenter = lyc.y + lyc.height / 2;
    const isTextLineZone = (Math.abs(y - yCenter) < this.lyricsStyle.fontSize * 1.8) &&
                           (x >= lyc.x && x <= lyc.x + lyc.width);
    
    if ((this.selectedLayerId === 'lyrics_layer' && x >= lyc.x && x <= lyc.x + lyc.width && y >= lyc.y && y <= lyc.y + lyc.height) || isTextLineZone) {
      this.selectedLayerId = 'lyrics_layer';
      this.isDragging = true;
      this.dragOffsetX = x - lyc.x;
      this.dragOffsetY = y - lyc.y;
      this.needsRedraw = true;
      
      if (this.onLayerSelected) this.onLayerSelected('lyrics_layer');
      return;
    }
    
    // Clicked on empty canvas space: cleanly deselect everything
    this.selectedLayerId = null;
    this.needsRedraw = true;
    if (this.onLayerSelected) this.onLayerSelected(null);
  }

  handleMouseMove(e) {
    const { x, y } = this.getClientToVirtualCoords(e.clientX, e.clientY);
    const currentTime = this.audioManager.currentTime;
    
    // Update cursor style on hover
    if (!this.isDragging && !this.isResizing) {
      let cursor = 'default';
      
      // Check handles first
      if (this.selectedLayerId) {
        const isLyrics = this.selectedLayerId === 'lyrics_layer';
        const layer = isLyrics ? this.lyricsContainer : this.layers.find(l => l.id === this.selectedLayerId);
        if (layer && (isLyrics || (currentTime >= layer.start && currentTime <= layer.end))) {
          const hs = this.handleSize;
          const lx = layer.x;
          const ly = layer.y;
          const lw = layer.width;
          const lh = layer.height;
          
          if (Math.hypot(x - lx, y - ly) < hs) cursor = 'nwse-resize';
          else if (Math.hypot(x - (lx + lw), y - ly) < hs) cursor = 'nesw-resize';
          else if (Math.hypot(x - lx, y - (ly + lh)) < hs) cursor = 'nesw-resize';
          else if (Math.hypot(x - (lx + lw), y - (ly + lh)) < hs) cursor = 'nwse-resize';
        }
      }
      
      // Check lyrics body hover
      if (cursor === 'default') {
        const lyc = this.lyricsContainer;
        if (x >= lyc.x && x <= lyc.x + lyc.width &&
            y >= lyc.y && y <= lyc.y + lyc.height) {
          cursor = 'move';
        }
      }
      
      // Check layer body hover
      if (cursor === 'default') {
        for (let i = this.layers.length - 1; i >= 0; i--) {
          const layer = this.layers[i];
          if (currentTime >= layer.start && currentTime <= layer.end) {
            if (x >= layer.x && x <= layer.x + layer.width &&
                y >= layer.y && y <= layer.y + layer.height) {
              cursor = 'move';
              break;
            }
          }
        }
      }
      
      this.canvas.style.cursor = cursor;
    }
    
    // Perform Dragging
    if (this.isDragging && this.selectedLayerId) {
      const isLyrics = this.selectedLayerId === 'lyrics_layer';
      const layer = isLyrics ? this.lyricsContainer : this.layers.find(l => l.id === this.selectedLayerId);
      if (layer) {
        layer.x = x - this.dragOffsetX;
        layer.y = y - this.dragOffsetY;
      }
    }
    
    // Perform Resizing
    if (this.isResizing && this.selectedLayerId) {
      const isLyrics = this.selectedLayerId === 'lyrics_layer';
      const layer = isLyrics ? this.lyricsContainer : this.layers.find(l => l.id === this.selectedLayerId);
      if (layer) {
        const lx = layer.x;
        const ly = layer.y;
        const lw = layer.width;
        const lh = layer.height;
        
        if (this.resizeHandle === 'br') {
          layer.width = Math.max(100, x - lx);
          layer.height = Math.max(50, y - ly);
        } else if (this.resizeHandle === 'bl') {
          const deltaX = lx - x;
          layer.x = x;
          layer.width = Math.max(100, lw + deltaX);
          layer.height = Math.max(50, y - ly);
        } else if (this.resizeHandle === 'tr') {
          const deltaY = ly - y;
          layer.y = y;
          layer.width = Math.max(100, x - lx);
          layer.height = Math.max(50, lh + deltaY);
        } else if (this.resizeHandle === 'tl') {
          const deltaX = lx - x;
          const deltaY = ly - y;
          layer.x = x;
          layer.y = y;
          layer.width = Math.max(100, lw + deltaX);
          layer.height = Math.max(50, lh + deltaY);
        }
      }
    }
  }

  handleMouseUp() {
    this.isDragging = false;
    this.isResizing = false;
    this.resizeHandle = null;
  }

  // CSS Object Fit cover in Canvas helper
  drawCoverImage(ctx, img, targetW, targetH) {
    const imgW = img.videoWidth || img.naturalWidth || img.width;
    const imgH = img.videoHeight || img.naturalHeight || img.height;
    
    const imgRatio = imgW / imgH;
    const targetRatio = targetW / targetH;
    
    let sx = 0, sy = 0, sWidth = imgW, sHeight = imgH;
    
    if (imgRatio > targetRatio) {
      // Source is wider than target
      sWidth = imgH * targetRatio;
      sx = (imgW - sWidth) / 2;
    } else {
      // Source is taller than target
      sHeight = imgW / targetRatio;
      sy = (imgH - sHeight) / 2;
    }
    
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetW, targetH);
  }

  // Draw everything onto target canvas (either screen preview canvas or high-res export canvas)
  render(targetCanvas, time) {
    const ctx = targetCanvas.getContext('2d');
    const width = targetCanvas.width;
    const height = targetCanvas.height;
    
    // Scale all operations from 1080x1920 base size
    const scale = width / this.vWidth;
    
    ctx.save();
    ctx.scale(scale, scale);
    
    // 1. Draw Background
    if (this.background.type === 'color') {
      ctx.fillStyle = this.background.color;
      ctx.fillRect(0, 0, this.vWidth, this.vHeight);
    } else if ((this.background.type === 'image' || this.background.type === 'video') && this.background.element) {
      this.drawCoverImage(ctx, this.background.element, this.vWidth, this.vHeight);
    }
    
    // 2. Draw Foreground Layers (Images and Spectrum Visualizers)
    this.layers.forEach(layer => {
      if (time >= layer.start && time <= layer.end) {
        ctx.save();
        ctx.globalAlpha = layer.opacity !== undefined ? layer.opacity : 1.0;

        if (layer.type === 'spectrum') {
          this.drawSpectrum(ctx, layer, time);
        } else if (layer.element) {
          ctx.drawImage(layer.element, layer.x, layer.y, layer.width, layer.height);
        }
        
        // Draw editor borders & handles if selected on display canvas (only if it is the preview canvas, i.e., not during offline render)
        if (this.selectedLayerId === layer.id && targetCanvas === this.canvas) {
          ctx.restore(); // momentarily exit layer globalAlpha to draw handles brightly
          ctx.save();
          
          ctx.strokeStyle = '#3b82f6'; // Bright blue selection box
          ctx.lineWidth = 4;
          ctx.setLineDash([8, 8]);
          ctx.strokeRect(layer.x, layer.y, layer.width, layer.height);
          ctx.setLineDash([]); // clear dash
          
          // Draw circular handle dots
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#2563eb';
          ctx.lineWidth = 3;
          
          const hs = this.handleSize / 2;
          const corners = [
            [layer.x, layer.y],
            [layer.x + layer.width, layer.y],
            [layer.x, layer.y + layer.height],
            [layer.x + layer.width, layer.y + layer.height]
          ];
          
          corners.forEach(([cx, cy]) => {
            ctx.beginPath();
            ctx.arc(cx, cy, hs, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          });
        }
        
        ctx.restore();
      }
    });
    
    // 3. Draw Styled Karaoke Lyrics
    this.drawLyrics(ctx, time);
    
    // 4. Draw selection bounding box for lyrics container if selected (only on preview screen)
    if (this.selectedLayerId === 'lyrics_layer' && targetCanvas === this.canvas) {
      ctx.save();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 8]);
      ctx.strokeRect(this.lyricsContainer.x, this.lyricsContainer.y, this.lyricsContainer.width, this.lyricsContainer.height);
      ctx.setLineDash([]);
      
      // Handles
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3;
      
      const hs = this.handleSize / 2;
      const lx = this.lyricsContainer.x;
      const ly = this.lyricsContainer.y;
      const lw = this.lyricsContainer.width;
      const lh = this.lyricsContainer.height;
      const corners = [
        [lx, ly],
        [lx + lw, ly],
        [lx, ly + lh],
        [lx + lw, ly + lh]
      ];
      
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, hs, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      ctx.restore();
    }
    
    ctx.restore();
  }

  // Draw lyrics onto canvas with chosen style (always scrolling, constrained inside lyricsContainer)
  drawLyrics(ctx, time) {
    const activeData = this.lyricsSync.getActiveElementsAtTime(time);
    const lines = this.lyricsSync.getLines();
    if (lines.length === 0) return;
    
    // Configure Fonts
    let fontStyleStr = "";
    if (this.lyricsStyle.italic) fontStyleStr += "italic ";
    if (this.lyricsStyle.bold) fontStyleStr += "bold ";
    fontStyleStr += `${this.lyricsStyle.fontSize}px "${this.lyricsStyle.fontFamily}"`;
    
    ctx.font = fontStyleStr;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    // Set up standard outlines (disable heavy canvas shadowBlur to prevent CPU lag/audio crackling)
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Constraints of the subtitle container box
    const boxX = this.lyricsContainer.x;
    const boxY = this.lyricsContainer.y;
    const boxW = this.lyricsContainer.width;
    const boxH = this.lyricsContainer.height;
    
    const yCenter = boxY + boxH / 2;
    const lineHeight = this.lyricsStyle.fontSize * 1.4;
    
    // Clip drawing inside the container boundaries
    ctx.save();
    ctx.beginPath();
    ctx.rect(boxX, boxY, boxW, boxH);
    ctx.clip();
    
    const activeLineIndex = activeData.lineIndex;
    
    // Calculate smooth shift transition if transitioning to the next line
    let shift = 0;
    if (activeLineIndex !== -1 && activeLineIndex < lines.length - 1) {
      const curLine = lines[activeLineIndex];
      const nextLine = lines[activeLineIndex + 1];
      
      // Snappy transition: scroll up in the 0.6 seconds right before the next line starts
      const transitionStart = Math.max(curLine.start, nextLine.start - 0.6);
      const transitionEnd = nextLine.start;
      const transitionDur = transitionEnd - transitionStart;
      
      if (time >= transitionStart && time <= transitionEnd && transitionDur > 0) {
        const p = (time - transitionStart) / transitionDur;
        // Smooth ease-in-out interpolation
        const smoothP = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
        shift = smoothP * lineHeight;
      }
    }
    
    // Draw lines in view (activeLineIndex - 4 to activeLineIndex + 4)
    const startIdx = Math.max(0, activeLineIndex === -1 ? 0 : activeLineIndex - 4);
    const endIdx = Math.min(lines.length - 1, activeLineIndex === -1 ? 5 : activeLineIndex + 4);
    
    for (let i = startIdx; i <= endIdx; i++) {
      const line = lines[i];
      
      // Calculate Y position for this line
      const relativeIdx = activeLineIndex === -1 ? i : i - activeLineIndex;
      const yLine = yCenter + relativeIdx * lineHeight - shift;
      
      // Calculate base opacity based on distance to active center
      let lineOpacity = 1.0;
      if (activeLineIndex !== -1) {
        const dist = Math.abs(i - (activeLineIndex + (shift / lineHeight)));
        lineOpacity = Math.max(0.1, 1.0 - dist * 0.3); // fade out
      } else {
        // Unsynced or pre-playback
        lineOpacity = 0.35;
      }
      
      // Extra fade-out near top/bottom boundaries of the container
      let fadeOpacity = 1.0;
      const distToTop = yLine - this.lyricsStyle.fontSize - boxY;
      const distToBottom = (boxY + boxH) - yLine;
      if (distToTop < 100) fadeOpacity *= Math.max(0.1, distToTop / 100);
      if (distToBottom < 100) fadeOpacity *= Math.max(0.1, distToBottom / 100);
      
      ctx.save();
      ctx.globalAlpha = lineOpacity * fadeOpacity;
      
      // Calculate line scale based on active focus distance and user configurable activeScale
      const activeZoom = (this.lyricsStyle.activeScale !== undefined) ? this.lyricsStyle.activeScale : 1.3;
      const inactiveScale = (this.lyricsStyle.inactiveScale !== undefined) ? this.lyricsStyle.inactiveScale : 0.75;
      
      let lineScale = 1.0;
      if (activeLineIndex !== -1) {
        const dist = Math.abs(i - (activeLineIndex + (shift / lineHeight)));
        // Active line scales up to activeZoom (e.g. 1.0x to 2.5x). Surrounding lines taper smoothly to inactiveScale.
        const t = Math.min(1.0, dist * 0.85);
        lineScale = activeZoom * (1 - t) + inactiveScale * t;
      } else {
        lineScale = 1.0;
      }
      
      // Translate to scale from line center
      const centerX = boxX + boxW / 2;
      ctx.translate(centerX, yLine);
      ctx.scale(lineScale, lineScale);
      ctx.translate(-centerX, -yLine);
      
      const isActiveLine = (i === activeLineIndex);
      this.drawLine(ctx, line, yLine, time, isActiveLine, activeData);
      
      ctx.restore();
    }
    
    ctx.restore(); // restore from the clip path
  }

  // Draw a single line of text with alignment and active line highlight styles
  // LIGHTWEIGHT: No per-word ctx.save/restore/clip. Single pass drawing only.
  drawLine(ctx, line, y, time, isActiveLine, activeData = null) {
    const spaceWidth = ctx.measureText(" ").width;
    const words = line.words;
    
    const wordWidths = words.map(w => ctx.measureText(w.text).width);
    const totalWordsWidth = wordWidths.reduce((a, b) => a + b, 0);
    
    const align = this.lyricsStyle.align || 'center';
    const boxX = this.lyricsContainer.x;
    const boxW = this.lyricsContainer.width;
    
    let currentX = 0;
    let customSpaceWidth = spaceWidth;
    
    if (align === 'left') {
      currentX = boxX + 20;
    } else if (align === 'right') {
      const totalLineWidth = totalWordsWidth + (words.length - 1) * spaceWidth;
      currentX = boxX + boxW - 20 - totalLineWidth;
    } else if (align === 'justify' && words.length > 1) {
      currentX = boxX + 20;
      customSpaceWidth = (boxW - 40 - totalWordsWidth) / (words.length - 1);
    } else {
      const totalLineWidth = totalWordsWidth + (words.length - 1) * spaceWidth;
      currentX = boxX + (boxW - totalLineWidth) / 2;
    }
    
    // ONLY the currently active/sung line gets the highlight color.
    // Past lines that have already scrolled up return to base color so singer stays focused on the active text.
    const fillColor = isActiveLine
      ? this.lyricsStyle.highlightColor
      : this.lyricsStyle.color;
    
    // Set state once for entire line (no per-word save/restore)
    ctx.strokeStyle = this.lyricsStyle.strokeColor;
    ctx.lineWidth = this.lyricsStyle.strokeWidth;
    ctx.fillStyle = fillColor;
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const wWidth = wordWidths[i];
      
      // Fast offset drop shadow (no Gaussian blur, no ctx.save/restore)
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.strokeStyle = 'rgba(0,0,0,0.65)';
      ctx.lineWidth = this.lyricsStyle.strokeWidth;
      ctx.strokeText(word.text, currentX + 5, y + 5);
      ctx.fillText(word.text, currentX + 5, y + 5);
      
      // Outline stroke
      ctx.strokeStyle = this.lyricsStyle.strokeColor;
      ctx.strokeText(word.text, currentX, y);
      
      // Fill with the pre-determined line-level color
      ctx.fillStyle = fillColor;
      ctx.fillText(word.text, currentX, y);
      
      currentX += wWidth + customSpaceWidth;
    }
  }

  // ==========================================
  // AUDIO SPECTRUM / VISUALIZER ENGINE
  // ==========================================

  createSpectrumGradient(ctx, x1, y1, x2, y2, layer) {
    if (!layer.isGradient) {
      return layer.color1 || '#06b6d4';
    }
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    if (layer.preset === 'rainbow') {
      grad.addColorStop(0.0, '#10b981'); // Green
      grad.addColorStop(0.2, '#06b6d4'); // Cyan
      grad.addColorStop(0.4, '#ec4899'); // Pink
      grad.addColorStop(0.6, '#8b5cf6'); // Purple
      grad.addColorStop(0.8, '#3b82f6'); // Blue
      grad.addColorStop(1.0, '#10b981'); // Green
    } else if (layer.preset === 'fire-amber') {
      grad.addColorStop(0.0, '#ef4444'); // Red
      grad.addColorStop(0.25, '#f97316'); // Orange
      grad.addColorStop(0.5, '#eab308'); // Yellow
      grad.addColorStop(0.75, '#84cc16'); // Lime
      grad.addColorStop(1.0, '#22c55e'); // Green
    } else if (layer.preset === 'gold-soundwave') {
      grad.addColorStop(0.0, '#b45309');
      grad.addColorStop(0.2, '#f59e0b');
      grad.addColorStop(0.5, '#fef08a');
      grad.addColorStop(0.8, '#f59e0b');
      grad.addColorStop(1.0, '#b45309');
    } else {
      grad.addColorStop(0, layer.color1 || '#06b6d4');
      grad.addColorStop(1, layer.color2 || '#d946ef');
    }
    return grad;
  }

  drawSpectrum(ctx, layer, time) {
    const freqData = this.audioManager.getFrequencyData(time);
    const type = layer.spectrumType || 'mirror-bars';

    ctx.save();
    
    // Apply Glow effect
    if (layer.glow && layer.glow > 0) {
      ctx.shadowBlur = layer.glow;
      ctx.shadowColor = layer.color1 || '#06b6d4';
    }

    switch (type) {
      case 'youtube-columns': // YouTube Music Channels Columns (New User Photo)
        this.drawYouTubeColumns(ctx, layer, freqData);
        break;
      case 'mirror-bars': // Symmetrical Center Bars (Photos 2 & 5)
        this.drawMirrorBars(ctx, layer, freqData);
        break;
      case 'linear-bars': // Bottom Equalizer Bars (Photos 1 & 3)
        this.drawLinearBars(ctx, layer, freqData);
        break;
      case 'soundwave-dense': // Dense Studio Soundwave Field (Photo 4)
        this.drawSoundwaveDense(ctx, layer, freqData);
        break;
      case 'circular-bars': // Trap Nation Circular with Bass Spikes
        this.drawCircularBars(ctx, layer, freqData);
        break;
      case 'circular-wave': // Radial Neon Wave
        this.drawCircularWave(ctx, layer, freqData);
        break;
      case 'wave-line': // Fluid Line Wave
        this.drawWaveLine(ctx, layer, freqData);
        break;
      case 'radial-dots': // Orbiting Pulsing Dots
        this.drawRadialDots(ctx, layer, freqData);
        break;
      default:
        this.drawYouTubeColumns(ctx, layer, freqData);
    }

    ctx.restore();
  }

  // MODEL: YouTube Music Columns (Exact Match to User Uploaded Picture)
  drawYouTubeColumns(ctx, layer, freqData) {
    const barCount = layer.barCount || 48;
    const spacing = Math.max(3, (layer.barWidth || 5) * 0.5);
    const totalSpacing = (barCount - 1) * spacing;
    const barWidth = Math.max(3, (layer.width - totalSpacing) / barCount);
    const sensitivity = layer.sensitivity || 1.3;
    const beatPunch = layer.beatPunch !== undefined ? layer.beatPunch : 2.2;
    const maxHeight = layer.height * 0.92;
    const byBottom = layer.y + layer.height - 4;

    const grad = this.createSpectrumGradient(ctx, layer.x, layer.y, layer.x + layer.width, layer.y, layer);
    ctx.strokeStyle = grad;
    ctx.lineWidth = barWidth;
    ctx.lineCap = 'round';

    for (let i = 0; i < barCount; i++) {
      const norm = i / barCount;
      const binIdx = Math.floor(norm * 52);
      let val = (freqData[binIdx] || 0) / 255;
      
      // Punchy non-linear spikes for YouTube style high columns
      if (val > 0.25) {
        val = Math.pow(val, 1.35) * (1 + (beatPunch - 1.0) * 0.6);
      }
      
      const barH = Math.max(8, val * maxHeight * sensitivity);
      const bx = layer.x + i * (barWidth + spacing) + barWidth / 2;
      const byTop = byBottom - barH;

      ctx.beginPath();
      ctx.moveTo(bx, byBottom);
      ctx.lineTo(bx, byTop);
      ctx.stroke();
    }
  }

  // MODEL 1: Symmetrical Center Waveform Bars (Matching Photos 2 & 5)
  drawMirrorBars(ctx, layer, freqData) {
    const barCount = layer.barCount || 56;
    const spacing = Math.max(2, (layer.barWidth || 5) * 0.4);
    const totalSpacing = (barCount - 1) * spacing;
    const barWidth = Math.max(2, (layer.width - totalSpacing) / barCount);
    const sensitivity = layer.sensitivity || 1.3;
    const beatPunch = layer.beatPunch !== undefined ? layer.beatPunch : 2.2;
    const maxHeight = layer.height * 0.9;
    const centerY = layer.y + layer.height / 2;

    const grad = this.createSpectrumGradient(ctx, layer.x, centerY, layer.x + layer.width, centerY, layer);
    ctx.strokeStyle = grad;
    ctx.lineWidth = barWidth;
    ctx.lineCap = 'round';

    for (let i = 0; i < barCount; i++) {
      const norm = i / barCount;
      const binIdx = Math.floor(Math.abs(Math.sin(norm * Math.PI)) * 50);
      let val = (freqData[binIdx] || 0) / 255;
      
      if (val > 0.25) {
        val = Math.pow(val, 1.3) * (1 + (beatPunch - 1.0) * 0.5);
      }
      
      const barH = Math.max(6, val * maxHeight * sensitivity);
      const bx = layer.x + i * (barWidth + spacing) + barWidth / 2;

      ctx.beginPath();
      ctx.moveTo(bx, centerY - barH / 2);
      ctx.lineTo(bx, centerY + barH / 2);
      ctx.stroke();
    }
  }

  // MODEL 2: Modern Linear Equalizer Bars (Matching Photos 1 & 3)
  drawLinearBars(ctx, layer, freqData) {
    const barCount = layer.barCount || 52;
    const spacing = 3;
    const totalSpacing = (barCount - 1) * spacing;
    const barWidth = Math.max(2, (layer.width - totalSpacing) / barCount);
    const sensitivity = layer.sensitivity || 1.3;
    const beatPunch = layer.beatPunch !== undefined ? layer.beatPunch : 2.2;
    const maxHeight = layer.height * 0.88;

    const grad = this.createSpectrumGradient(ctx, layer.x, layer.y, layer.x + layer.width, layer.y, layer);
    ctx.strokeStyle = grad;
    ctx.lineWidth = barWidth;
    ctx.lineCap = 'round';

    for (let i = 0; i < barCount; i++) {
      const binNormalized = i / barCount;
      const binIdx = Math.floor(binNormalized * 56);
      let val = (freqData[binIdx] || 0) / 255;
      
      if (val > 0.25) {
        val = Math.pow(val, 1.3) * (1 + (beatPunch - 1.0) * 0.5);
      }
      
      const barH = Math.max(8, val * maxHeight * sensitivity);
      const bx = layer.x + i * (barWidth + spacing) + barWidth / 2;
      const byBottom = layer.y + layer.height - 4;
      const byTop = byBottom - barH;

      ctx.beginPath();
      ctx.moveTo(bx, byBottom);
      ctx.lineTo(bx, byTop);
      ctx.stroke();
    }
  }

  // MODEL 3: Dense Studio Soundwave Field (Matching Photo 4 - Gold / Amber Field)
  drawSoundwaveDense(ctx, layer, freqData) {
    const lineCount = Math.max(80, (layer.barCount || 64) * 2);
    const stepX = layer.width / (lineCount - 1);
    const sensitivity = layer.sensitivity || 1.3;
    const maxHeight = layer.height * 0.95;
    const centerY = layer.y + layer.height / 2;

    const grad = this.createSpectrumGradient(ctx, layer.x, centerY, layer.x + layer.width, centerY, layer);
    ctx.strokeStyle = grad;
    ctx.lineWidth = Math.max(1, (layer.barWidth || 5) * 0.35);
    ctx.lineCap = 'butt';

    const now = performance.now() / 1000;

    for (let i = 0; i < lineCount; i++) {
      const norm = i / lineCount;
      const binIdx = Math.floor(Math.abs(Math.sin(norm * Math.PI)) * 48);
      const val = (freqData[binIdx] || 0) / 255;
      
      const jitter = Math.sin(i * 13.5 + now * 12) * 0.15;
      const barH = Math.max(4, (val * 0.85 + jitter) * maxHeight * sensitivity);
      const bx = layer.x + i * stepX;

      ctx.beginPath();
      ctx.moveTo(bx, centerY - barH / 2);
      ctx.lineTo(bx, centerY + barH / 2);
      ctx.stroke();
    }
  }

  // MODEL 4: Trap Nation Circular Bars with Bass Spikes & Explosive Punch
  drawCircularBars(ctx, layer, freqData) {
    const cx = layer.x + layer.width / 2;
    const cy = layer.y + layer.height / 2;
    const beatPunch = layer.beatPunch !== undefined ? layer.beatPunch : 2.2;
    
    // Non-linear bass calculation for energetic kick response
    const rawBass = ((freqData[0] || 0) + (freqData[1] || 0) + (freqData[2] || 0) + (freqData[3] || 0)) / (4 * 255);
    const bass = Math.pow(rawBass, 1.3) * (0.8 + beatPunch * 0.6);
    const pumpRadius = (layer.radius || 120) * (1 + bass * 0.25);
    
    const barCount = layer.barCount || 64;
    const barWidth = layer.barWidth || 5;
    const sensitivity = layer.sensitivity || 1.3;
    const maxBarLen = (layer.width / 2 - pumpRadius - 10);

    const grad = this.createSpectrumGradient(ctx, cx - pumpRadius, cy - pumpRadius, cx + pumpRadius, cy + pumpRadius, layer);
    ctx.strokeStyle = grad;
    ctx.lineWidth = barWidth;
    ctx.lineCap = 'round';

    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
      
      const halfCount = barCount / 2;
      const binNormalized = (i < halfCount ? i : (barCount - i)) / halfCount;
      const binIdx = Math.floor(binNormalized * 50);
      let val = (freqData[binIdx] || 0) / 255;
      
      // Dynamic spike explosions on high frequency bursts / bass hits
      if (val > 0.28) {
        val = Math.pow(val, 1.4) * (1 + bass * (beatPunch * 0.95));
      }
      
      const barHeight = Math.max(6, val * maxBarLen * sensitivity);
      
      const x1 = cx + Math.cos(angle) * pumpRadius;
      const y1 = cy + Math.sin(angle) * pumpRadius;
      const x2 = cx + Math.cos(angle) * (pumpRadius + barHeight);
      const y2 = cy + Math.sin(angle) * (pumpRadius + barHeight);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw Center Circle / Logo
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, pumpRadius - 4, 0, Math.PI * 2);
    ctx.closePath();

    if (layer.centerImage && layer.centerImage.complete) {
      ctx.clip();
      const imgSize = (pumpRadius - 4) * 2;
      ctx.drawImage(layer.centerImage, cx - imgSize / 2, cy - imgSize / 2, imgSize, imgSize);
    } else {
      ctx.fillStyle = 'rgba(10, 15, 30, 0.85)';
      ctx.fill();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3 + bass * 4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, (pumpRadius - 4) * (0.6 + bass * 0.15), 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  }

  // MODEL 5: Continuous Radial Neon Wave
  drawCircularWave(ctx, layer, freqData) {
    const cx = layer.x + layer.width / 2;
    const cy = layer.y + layer.height / 2;
    
    const bass = ((freqData[0] || 0) + (freqData[1] || 0) + (freqData[2] || 0)) / (3 * 255);
    const baseRadius = (layer.radius || 120) * (1 + bass * 0.12);
    
    const pointCount = layer.barCount || 64;
    const sensitivity = layer.sensitivity || 1.3;
    const maxAmplitude = (layer.width / 2 - baseRadius - 10);

    const grad = this.createSpectrumGradient(ctx, layer.x, layer.y, layer.x + layer.width, layer.y + layer.height, layer);
    
    ctx.beginPath();
    for (let i = 0; i <= pointCount; i++) {
      const idx = i % pointCount;
      const angle = (idx / pointCount) * Math.PI * 2 - Math.PI / 2;
      
      const halfCount = pointCount / 2;
      const binNormalized = (idx < halfCount ? idx : (pointCount - idx)) / halfCount;
      const binIdx = Math.floor(binNormalized * 48);
      const val = (freqData[binIdx] || 0) / 255;
      
      const r = baseRadius + val * maxAmplitude * sensitivity;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();

    ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
    ctx.fill();
    ctx.strokeStyle = grad;
    ctx.lineWidth = layer.barWidth || 4;
    ctx.stroke();
  }

  // MODEL 6: Fluid Wave Line with Gradient Underneath
  drawWaveLine(ctx, layer, freqData) {
    const pointCount = layer.barCount || 48;
    const stepX = layer.width / (pointCount - 1);
    const sensitivity = layer.sensitivity || 1.3;
    const centerY = layer.y + layer.height * 0.6;
    const maxAmplitude = layer.height * 0.45;

    const gradStroke = this.createSpectrumGradient(ctx, layer.x, layer.y, layer.x + layer.width, layer.y, layer);
    const gradFill = ctx.createLinearGradient(layer.x, layer.y, layer.x, layer.y + layer.height);
    gradFill.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
    gradFill.addColorStop(1, 'rgba(217, 70, 239, 0.0)');

    ctx.beginPath();
    ctx.moveTo(layer.x, layer.y + layer.height);

    for (let i = 0; i < pointCount; i++) {
      const binNormalized = i < pointCount / 2 ? (i / (pointCount / 2)) : ((pointCount - i) / (pointCount / 2));
      const binIdx = Math.floor(binNormalized * 40);
      const val = (freqData[binIdx] || 0) / 255;
      
      const px = layer.x + i * stepX;
      const py = centerY - val * maxAmplitude * sensitivity;

      if (i === 0) {
        ctx.lineTo(px, py);
      } else {
        const prevX = layer.x + (i - 1) * stepX;
        const prevBinNorm = (i - 1) < pointCount / 2 ? ((i - 1) / (pointCount / 2)) : ((pointCount - (i - 1)) / (pointCount / 2));
        const prevVal = (freqData[Math.floor(prevBinNorm * 40)] || 0) / 255;
        const prevY = centerY - prevVal * maxAmplitude * sensitivity;
        
        const cpX = (prevX + px) / 2;
        ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + py) / 2);
      }
    }

    ctx.lineTo(layer.x + layer.width, layer.y + layer.height);
    ctx.closePath();

    ctx.fillStyle = gradFill;
    ctx.fill();

    ctx.strokeStyle = gradStroke;
    ctx.lineWidth = layer.barWidth || 4;
    ctx.stroke();
  }

  // MODEL 7: Radial Orbiting Pulsing Dots
  drawRadialDots(ctx, layer, freqData) {
    const cx = layer.x + layer.width / 2;
    const cy = layer.y + layer.height / 2;
    
    const bass = ((freqData[0] || 0) + (freqData[1] || 0) + (freqData[2] || 0)) / (3 * 255);
    const baseRadius = (layer.radius || 120) * (1 + bass * 0.15);
    
    const dotCount = layer.barCount || 48;
    const sensitivity = layer.sensitivity || 1.3;
    const maxRadius = (layer.width / 2 - 10);

    const grad = this.createSpectrumGradient(ctx, layer.x, layer.y, layer.x + layer.width, layer.y + layer.height, layer);
    ctx.fillStyle = grad;

    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * Math.PI * 2;
      const halfCount = dotCount / 2;
      const binNormalized = (i < halfCount ? i : (dotCount - i)) / halfCount;
      const binIdx = Math.floor(binNormalized * 45);
      const val = (freqData[binIdx] || 0) / 255;
      
      const r = baseRadius + val * (maxRadius - baseRadius) * sensitivity;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      const dotSize = Math.max(3, (layer.barWidth || 5) * (0.8 + val * 1.2));

      ctx.beginPath();
      ctx.arc(px, py, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
