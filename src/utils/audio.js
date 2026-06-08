export const playSound = (soundId) => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (soundId === 'sound_zen') {
      // Timbre/Som -> Harmonías Sinosas (Sino Budistas / Soothing) Com decaimentos afetuosos (Estilos de Attack: Soft / Warm).
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
      osc1.frequency.exponentialRampToValueAtTime(440.00, ctx.currentTime + 0.3); // Ramp up to A4

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(164.81, ctx.currentTime); // E3 (undertone)
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 1.5);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 2.1);
      osc2.stop(ctx.currentTime + 2.1);
    } else if (soundId === 'sound_retro') {
      // Timbre/Som Clássicos e Vintage (Sino do Nível/Arcade Retro - Colecionar e 8BIT!)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      // Estrutura ou Arquitetura retrográfica tonal / Sons Arpejados para Subidas: (C5) ~> (E5) ~> (G5) ~> C6 (Final)
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else {
      // Sinos Básicos e Alertativos -> Toque Alto (Padrão) / Formações Agudas ("Pling Ping") para Sinais de Timer Modernos.
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc1.frequency.setValueAtTime(987.77, ctx.currentTime + 0.1); // B5
      osc1.frequency.setValueAtTime(880, ctx.currentTime + 0.2); // A5

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1320, ctx.currentTime); // E6

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.9);
      osc2.stop(ctx.currentTime + 0.9);
    }
  } catch (error) {
    console.warn('Audio synthesis failed, probably blocked by user gesture:', error);
  }
};

// feedback sonoro
export function playClickFeedback() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (e) {
    // Engole erros residuais silenciosamente
  }
}