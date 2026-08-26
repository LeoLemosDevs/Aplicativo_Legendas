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
        start: 0,
        end: this.audioManager.duration
      };
      
      this.layers.push(newLayer);
      this.selectedLayerId = newLayer.id;
      this.needsRedraw = true;
    };
  }

  deleteLayer(id) {
    this.layers = this.layers.filter(l => l.id !== id);
    if (this.selectedLayerId === id) this.selectedLayerId = null;
    this.needsRedraw = true;
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
    } else if (direction === 'down' && index > 0) {
      // Swap with previous
      const temp = this.layers[index];
      this.layers[index] = this.layers[index - 1];
      this.layers[index - 1] = temp;
      this.needsRedraw = true;
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
    
    // 2. Check if clicked inside the lyrics container bounding box
    const lyc = this.lyricsContainer;
    if (x >= lyc.x && x <= lyc.x + lyc.width &&
        y >= lyc.y && y <= lyc.y + lyc.height) {
      this.selectedLayerId = 'lyrics_layer';
      this.isDragging = true;
      this.dragOffsetX = x - lyc.x;
      this.dragOffsetY = y - lyc.y;
      
      if (this.onLayerSelected) this.onLayerSelected('lyrics_layer');
      return;
    }
    
    // 3. Check if clicked inside any layer body (backwards to prioritize top elements)
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i];
      // Only select if the layer is currently visible
      if (currentTime >= layer.start && currentTime <= layer.end) {
        if (x >= layer.x && x <= layer.x + layer.width &&
            y >= layer.y && y <= layer.y + layer.height) {
          this.selectedLayerId = layer.id;
          this.isDragging = true;
          this.dragOffsetX = x - layer.x;
          this.dragOffsetY = y - layer.y;
          
          // Trigger layer selected callback if exists
          if (this.onLayerSelected) this.onLayerSelected(layer.id);
          return;
        }
      }
    }
    
    // Clicked empty canvas space
    this.selectedLayerId = null;
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
    
    // 2. Draw Foreground Image Layers
    this.layers.forEach(layer => {
      if (time >= layer.start && time <= layer.end && layer.element) {
        ctx.save();
        ctx.globalAlpha = layer.opacity;
        
        ctx.drawImage(layer.element, layer.x, layer.y, layer.width, layer.height);
        
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
      
      // Calculate line scale based on active focus distance
      let lineScale = 1.0;
      if (activeLineIndex !== -1) {
        const dist = Math.abs(i - (activeLineIndex + (shift / lineHeight)));
        // Active line is 100% scale (1.0). Surrounding lines shrink down dynamically to 0.7x scale.
        lineScale = Math.max(0.7, 1.0 - dist * 0.12);
      } else {
        lineScale = 0.85;
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
}
