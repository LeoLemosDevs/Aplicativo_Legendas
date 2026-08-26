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
      'video/mp4;codecs=h264,aac',
      'video/mp4'
    ];
    return types.filter(t => MediaRecorder.isTypeSupported(t));
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
    
    try {
      // 1. Capture the audio stream
      // For custom uploaded audio files: we capture the decoded stream directly from the
      // HTML5 audio element's native playback engine. This runs out-of-process in Chrome,
      // completely bypassing the Web Audio context processing thread. This guarantees
      // 100% click-free, pop-free, and high-fidelity sound, even if canvas rendering stutters!
      if (!this.audioManager.isDemo && this.audioManager.audioElement) {
        const audioEl = this.audioManager.audioElement;
        audioEl.muted = false;
        audioEl.volume = 1.0;
        
        if (audioEl.captureStream) {
          nativeAudioStream = audioEl.captureStream();
        } else if (audioEl.mozCaptureStream) {
          nativeAudioStream = audioEl.mozCaptureStream();
        }
        
        if (nativeAudioStream) {
          audioTrack = nativeAudioStream.getAudioTracks()[0];
        }
      }
      
      // Fallback for procedural synth demo track
      if (!audioTrack) {
        dest = audioCtx.createMediaStreamDestination();
        this.audioManager.gainNode.connect(dest);
        audioTrack = dest.stream.getAudioTracks()[0];
      }
      
      // 2. Setup local muting logic for monitoring speakers
      // We disconnect the Web Audio graph from the destination speakers so no sound leaks,
      // but keep the element unmuted at volume 1.0 so its native captureStream remains active!
      this.audioManager.gainNode.disconnect(audioCtx.destination);
      
      const localSpeakerGain = audioCtx.createGain();
      this.audioManager.gainNode.connect(localSpeakerGain);
      localSpeakerGain.connect(audioCtx.destination);
      
      if (muteAudioDuringExport) {
        localSpeakerGain.gain.setValueAtTime(0.0, audioCtx.currentTime); // Muted locally
      } else {
        localSpeakerGain.gain.setValueAtTime(0.8, audioCtx.currentTime); // Heard locally
      }
      
      // Play background video elements from the start if we have one
      if (this.canvasEditor.background.type === 'video' && this.canvasEditor.background.element) {
        this.canvasEditor.background.element.currentTime = 0;
        this.canvasEditor.background.element.play().catch(e => console.log(e));
      }
      
      // 3. Setup canvas capture stream with chosen FPS
      const videoStream = this.exportCanvas.captureStream(fps);
      
      // Combine video track and audio track
      const tracks = [videoStream.getVideoTracks()[0]];
      if (audioTrack) {
        tracks.push(audioTrack);
      }
      const combinedStream = new MediaStream(tracks);
      
      // 4. Instantiate MediaRecorder with custom bitrates
      const options = {
        mimeType: mimeType,
        videoBitsPerSecond: videoBitrate,
        audioBitsPerSecond: audioBitrate
      };
      
      this.recorder = new MediaRecorder(combinedStream, options);
      
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
        if (dest) {
          try { this.audioManager.gainNode.disconnect(dest); } catch(e) {}
        }
        this.audioManager.gainNode.disconnect(localSpeakerGain);
        localSpeakerGain.disconnect(audioCtx.destination);
        this.audioManager.gainNode.connect(audioCtx.destination);
        
        // Create Blob and trigger complete callback
        const blob = new Blob(this.chunks, { type: mimeType });
        this.isExporting = false;
        if (this.onComplete) {
          this.onComplete(blob, mimeType, width, height);
        }
      };
      
      // 5. Start Export
      this.audioManager.seek(0);
      this.recorder.start();
      this.audioManager.play();
      
      let lastFrameTime = 0;
      const fpsInterval = 1000 / fps; // Custom FPS interval
      
      const renderFrame = (timestamp) => {
        if (!this.isExporting) return;
        
        // Cap the offscreen rendering to the chosen frame rate
        const elapsed = timestamp - lastFrameTime;
        if (elapsed >= fpsInterval) {
          lastFrameTime = timestamp - (elapsed % fpsInterval);
          
          const curTime = this.audioManager.currentTime;
          const duration = this.audioManager.duration;
          
          // Render current state to offscreen export canvas
          this.canvasEditor.render(this.exportCanvas, curTime);
          
          // Progress update
          const progress = Math.min(100, Math.floor((curTime / duration) * 100));
          if (this.onProgress) {
            this.onProgress(progress);
          }
          
          // End check
          if (curTime >= duration || !this.audioManager.isPlaying) {
            this.recorder.stop();
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
