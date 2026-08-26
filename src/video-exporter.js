export class VideoExporter {
  constructor(canvasEditor, audioManager) {
    this.canvasEditor = canvasEditor;
    this.audioManager = audioManager;
    
    this.isExporting = false;
    this.chunks = [];
    this.recorder = null;
    this.exportCanvas = document.createElement('canvas');
    this.renderLoopId = null;
    
    // Callbacks
    this.onProgress = null;
    this.onComplete = null;
    this.onError = null;
  }

  // Get list of supported mime types in current browser
  getSupportedMimeTypes() {
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/webm',
      'video/mp4;codecs=avc1,mp4a',
      'video/mp4;codecs=h264,aac',
      'video/mp4'
    ];
    return types.filter(t => {
      try {
        return MediaRecorder.isTypeSupported(t);
      } catch (e) {
        return false;
      }
    });
  }

  async exportVideo(
    width = 1080, 
    height = 1920, 
    mimeType = 'video/webm', 
    muteAudioDuringExport = true,
    fps = 30,
    videoBitrate = 5000000,
    audioBitrate = 192000
  ) {
    if (this.isExporting) return;
    this.isExporting = true;
    this.chunks = [];
    
    // Initialize audio context
    this.audioManager.initAudioContext();
    const audioCtx = this.audioManager.audioCtx;
    
    // Set offscreen canvas dimensions
    this.exportCanvas.width = width;
    this.exportCanvas.height = height;
    
    let audioTrack = null;
    let nativeAudioStream = null;
    let dest = null;
    let localSpeakerGain = null;
    
    try {
      // 1. Capture the audio stream
      if (!this.audioManager.isDemo && this.audioManager.audioElement) {
        const audioEl = this.audioManager.audioElement;
        audioEl.muted = false;
        audioEl.volume = 1.0;
        
        if (audioEl.captureStream) {
          try { nativeAudioStream = audioEl.captureStream(); } catch(e) {}
        } else if (audioEl.mozCaptureStream) {
          try { nativeAudioStream = audioEl.mozCaptureStream(); } catch(e) {}
        }
        
        if (nativeAudioStream && nativeAudioStream.getAudioTracks().length > 0) {
          audioTrack = nativeAudioStream.getAudioTracks()[0];
        }
      }
      
      // Fallback for procedural synth demo track or when captureStream is not ready
      if (!audioTrack && this.audioManager.gainNode) {
        try {
          dest = audioCtx.createMediaStreamDestination();
          this.audioManager.gainNode.connect(dest);
          audioTrack = dest.stream.getAudioTracks()[0];
        } catch(e) {
          console.warn("Could not create Web Audio destination track", e);
        }
      }
      
      // 2. Setup local muting logic for monitoring speakers
      if (this.audioManager.gainNode) {
        try {
          this.audioManager.gainNode.disconnect(audioCtx.destination);
          localSpeakerGain = audioCtx.createGain();
          this.audioManager.gainNode.connect(localSpeakerGain);
          localSpeakerGain.connect(audioCtx.destination);
          
          if (muteAudioDuringExport) {
            localSpeakerGain.gain.setValueAtTime(0.0, audioCtx.currentTime);
          } else {
            localSpeakerGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
          }
        } catch(e) {}
      }
      
      const exportStart = this.audioManager.trimStart || 0;
      const exportEnd = this.audioManager.trimEnd || this.audioManager.duration || 32;
      const exportTotal = Math.max(0.1, exportEnd - exportStart);

      // Play background video elements from the start if we have one
      if (this.canvasEditor.background.type === 'video' && this.canvasEditor.background.element) {
        this.canvasEditor.background.element.currentTime = exportStart;
        this.canvasEditor.background.element.play().catch(e => {});
      }
      
      // 3. Setup canvas capture stream with chosen FPS
      const videoStream = this.exportCanvas.captureStream(fps);
      
      // Combine video track and audio track
      const tracks = [videoStream.getVideoTracks()[0]];
      if (audioTrack) {
        tracks.push(audioTrack);
      }
      const combinedStream = new MediaStream(tracks);
      
      // 4. Instantiate MediaRecorder with fallback tolerance
      let recorder = null;
      const recordOptions = [
        { mimeType: mimeType, videoBitsPerSecond: videoBitrate, audioBitsPerSecond: audioBitrate },
        { mimeType: mimeType, videoBitsPerSecond: videoBitrate },
        { mimeType: mimeType },
        {}
      ];
      
      for (const opt of recordOptions) {
        try {
          recorder = new MediaRecorder(combinedStream, opt);
          break;
        } catch (e) {}
      }
      
      if (!recorder) {
        recorder = new MediaRecorder(combinedStream);
      }
      this.recorder = recorder;
      
      this.recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.chunks.push(e.data);
        }
      };
      
      this.recorder.onstop = () => {
        // Stop the render loop
        if (this.renderLoopId) {
          cancelAnimationFrame(this.renderLoopId);
          this.renderLoopId = null;
        }
        
        // Stop playback
        this.audioManager.stop();
        
        // Pause background videos
        if (this.canvasEditor.background.type === 'video' && this.canvasEditor.background.element) {
          this.canvasEditor.background.element.pause();
        }
        
        // Restore direct audio connections
        if (dest && this.audioManager.gainNode) {
          try { this.audioManager.gainNode.disconnect(dest); } catch(e) {}
        }
        if (localSpeakerGain && this.audioManager.gainNode) {
          try {
            this.audioManager.gainNode.disconnect(localSpeakerGain);
            localSpeakerGain.disconnect(audioCtx.destination);
            this.audioManager.gainNode.connect(audioCtx.destination);
          } catch(e) {}
        }
        
        // Create Blob and trigger complete callback
        const actualMimeType = this.recorder.mimeType || mimeType || 'video/webm';
        const blob = new Blob(this.chunks, { type: actualMimeType });
        this.isExporting = false;
        if (this.onComplete) {
          this.onComplete(blob, actualMimeType, width, height);
        }
      };
      
      // 5. Start Export
      this.audioManager.seek(exportStart);
      try {
        this.recorder.start(250);
      } catch (e) {
        this.recorder.start();
      }
      this.audioManager.play();
      
      let lastFrameTime = 0;
      const fpsInterval = 1000 / fps;
      const exportStartWall = performance.now();
      
      const renderFrame = (timestamp) => {
        if (!this.isExporting) return;
        
        const elapsed = timestamp - lastFrameTime;
        if (elapsed >= fpsInterval) {
          lastFrameTime = timestamp - (elapsed % fpsInterval);
          
          const curAudioTime = this.audioManager.currentTime;
          const wallElapsedSec = (performance.now() - exportStartWall) / 1000;
          
          // High-precision time sync between audio and video
          const curTime = Math.min(exportEnd, Math.max(curAudioTime, exportStart + wallElapsedSec));
          
          // Render current state to offscreen export canvas
          try {
            this.canvasEditor.render(this.exportCanvas, curTime);
          } catch (renderErr) {
            console.error("Frame render error:", renderErr);
          }
          
          // Progress update based on trimmed duration
          const progress = Math.min(100, Math.max(0, Math.floor(((curTime - exportStart) / exportTotal) * 100)));
          if (this.onProgress) {
            this.onProgress(progress);
          }
          
          // End check: audio reached end or wall time completed duration
          const hasEnded = (curAudioTime >= exportEnd && wallElapsedSec > 0.5) ||
                           (wallElapsedSec >= exportTotal + 0.4) ||
                           (!this.audioManager.isPlaying && wallElapsedSec > 1.2);
                           
          if (hasEnded) {
            if (this.recorder && this.recorder.state === 'recording') {
              this.recorder.stop();
            }
            return;
          }
        }
        
        this.renderLoopId = requestAnimationFrame(renderFrame);
      };
      
      // Start loop
      this.renderLoopId = requestAnimationFrame(renderFrame);
      
    } catch (err) {
      console.error("Export failed", err);
      this.isExporting = false;
      if (this.renderLoopId) {
        cancelAnimationFrame(this.renderLoopId);
        this.renderLoopId = null;
      }
      if (this.onError) this.onError(err);
    }
  }

  cancelExport() {
    if (!this.isExporting) return;
    this.isExporting = false;
    
    if (this.recorder && this.recorder.state !== 'inactive') {
      this.recorder.stop();
    }
    
    if (this.renderLoopId) {
      cancelAnimationFrame(this.renderLoopId);
      this.renderLoopId = null;
    }
    
    this.audioManager.stop();
  }

  async saveFile(blob, width, height, ext, mimeType) {
    const defaultName = `karaoke_short_${width}x${height}_${Date.now()}.${ext}`;
    const baseMimeType = mimeType.split(';')[0];
    
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: defaultName,
          types: [{
            description: ext.toUpperCase() + ' Video File',
            accept: {
              [baseMimeType]: [`.${ext}`]
            }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (e) {
        if (e.name === 'AbortError') {
          throw e; // User closed dialog, stop
        }
        console.warn("showSaveFilePicker failed, falling back to download link", e);
      }
    }
    
    // Fallback standard download URL
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = defaultName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  }
}
