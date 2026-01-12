// Simple sound effect system using Web Audio API

class SoundSystem {
  private audioContext: AudioContext | null = null;

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Play a simple beep sound
  playBeep(frequency: number = 440, duration: number = 0.1, volume: number = 0.3) {
    const ctx = this.initAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  // Success sound
  success() {
    this.playBeep(523.25, 0.1, 0.3); // C5
    setTimeout(() => this.playBeep(659.25, 0.1, 0.3), 100); // E5
    setTimeout(() => this.playBeep(783.99, 0.15, 0.3), 200); // G5
  }

  // Click sound
  click() {
    this.playBeep(800, 0.05, 0.2);
  }

  // Error sound
  error() {
    this.playBeep(200, 0.2, 0.3);
  }

  // Notification sound
  notify() {
    this.playBeep(600, 0.1, 0.25);
    setTimeout(() => this.playBeep(800, 0.1, 0.25), 100);
  }

  // Warning sound
  warning() {
    this.playBeep(400, 0.15, 0.3);
  }
}

export const soundSystem = new SoundSystem();
