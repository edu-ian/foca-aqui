import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Settings, Volume2, Save, ArrowRight, Users, Radio, ChevronDown, ChevronUp } from 'lucide-react';
import { playSound, playClickFeedback } from '../utils/audio';

export default function PomodoroTimer({
  onCycleComplete,
  onTimerRunningChange,
  activeSessionId,
  socialSessions,
  friends,
  currentUser,
  onToggleSessionTimer
}) {
  const [durations, setDurations] = useState({
    focus: 25,
    short: 5,
    long: 15,
  });

  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSessionCollapsed, setIsSessionCollapsed] = useState(false);
  const [selectedAlarm, setSelectedAlarm] = useState('sound_standard');

  const [inputFocus, setInputFocus] = useState(25);
  const [inputShort, setInputShort] = useState(5);
  const [inputLong, setInputLong] = useState(15);

  const intervalRef = useRef(null);

  const currentSession = socialSessions?.find(s => s.id === activeSessionId);
  const isHost = currentSession?.hostId === currentUser?.uid;

  // Efeito para sincronizar com a sessão global (Follower)
  useEffect(() => {
    if (currentSession && !isHost) {
      const serverIsRunning = currentSession.timerStatus === 'running';
      // Se o estado mudou ou o tempo divergiu muito (> 2s), sincroniza
      if (serverIsRunning !== isRunning) {
        setIsRunning(serverIsRunning);
      }
      if (Math.abs(timeLeft - currentSession.duration) > 2) {
        setTimeLeft(currentSession.duration);
      }
    }
  }, [currentSession, isHost]);
  
  // Filtra participantes que estão online/focando no momento através da presença no RTDB
  const participantsStatus = currentSession?.participants?.map(p => {
    if (p.uid === currentUser?.uid) return { ...p, isOnline: true };
    
    // Busca o status do amigo na lista de presença real-time
    const friendPresence = friends?.find(f => f.friendId === p.uid);
    return {
      ...p,
      isOnline: friendPresence?.status === 'online' || friendPresence?.status === 'focusing'
    };
  }) || [];

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(durations[mode] * 60);
    }
  }, [mode, durations]);

  useEffect(() => {
    if (isRunning) {
      onTimerRunningChange(true);
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      onTimerRunningChange(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const handleTimerEnd = () => {
    setIsRunning(false);
    playSound(selectedAlarm);
    
    // Cálculo do tempo real decorrido em minutos
    const totalSecondsPlanned = durations[mode] * 60;
    const actualSecondsSpent = totalSecondsPlanned - timeLeft;
    const minutesActuallySpent = Math.floor(actualSecondsSpent / 60);

    onCycleComplete(mode, minutesActuallySpent);
    
    if (mode === 'focus') {
      setMode('short');
      setTimeLeft(durations.short * 60);
    } else {
      setMode('focus');
      setTimeLeft(durations.focus * 60);
    }
  };

  const toggleTimer = () => {
    playClickFeedback();
    const nextState = !isRunning;
    setIsRunning(nextState);
    if (activeSessionId && isHost) {
      onToggleSessionTimer(activeSessionId, nextState, timeLeft);
    }
  };

  const resetTimer = () => {
    playClickFeedback();
    setIsRunning(false);
    const resetTime = durations[mode] * 60;
    setTimeLeft(resetTime);
    if (activeSessionId && isHost) {
      onToggleSessionTimer(activeSessionId, false, resetTime);
    }
  };

  const handleModeChange = (newMode) => {
    playClickFeedback();
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(durations[newMode] * 60);
  };

  const saveSettings = (e) => {
    e.preventDefault();
    playClickFeedback();
    const newFocus = Math.max(1, Math.min(120, inputFocus));
    const newShort = Math.max(1, Math.min(30, inputShort));
    const newLong = Math.max(1, Math.min(60, inputLong));

    setDurations({
      focus: newFocus,
      short: newShort,
      long: newLong,
    });

    setTimeLeft(
      (mode === 'focus' ? newFocus : mode === 'short' ? newShort : newLong) * 60
    );
    setIsRunning(false);
    setShowSettings(false);
  };

  const testAlarm = (soundId) => {
    setSelectedAlarm(soundId);
    playSound(soundId);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSeconds = durations[mode] * 60;
  const progressRatio = totalSeconds > 0 ? timeLeft / totalSeconds : 0;

  return (
    <div className="p-6 rounded-2xl bg-brand-card border border-brand-border transition-all flex flex-col items-center justify-center relative overflow-hidden h-full shadow-xl hover:shadow-2xl duration-300">
      <AnimatePresence>
        {isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute inset-0 bg-blue-500/5 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="w-full flex justify-between items-center mb-6">
        <h3 className="font-display font-medium text-brand-text/60 text-xs font-mono tracking-widest">
          CRONÔMETRO POMODORO
        </h3>
        
        <button
          onClick={() => {
            playClickFeedback();
            setShowSettings(!showSettings);
          }}
          className="p-2 hover:bg-brand-text/10 rounded-lg text-brand-text/60 hover:text-brand-text transition-colors cursor-pointer"
          title="Configurações do Timer"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Widget de Sessão Conjunta */}
      <AnimatePresence>
        {currentSession && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full mb-6 overflow-hidden"
          >
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400">
                  <Radio size={14} className="animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Sala de Foco Ativa</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-brand-text/40 font-mono truncate max-w-[120px] italic">
                    "{currentSession.title}"
                  </span>
                  <button 
                    onClick={() => setIsSessionCollapsed(!isSessionCollapsed)}
                    className="text-brand-text/40 hover:text-brand-text transition-colors"
                  >
                    {isSessionCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  </button>
                  {!isHost && (
                    <span className="text-[8px] bg-brand-text/5 text-brand-text/40 px-1.5 py-0.5 rounded border border-brand-border">
                      MODO SEGUIDOR
                    </span>
                  )}
                </div>
              </div>
              
              {!isSessionCollapsed && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-wrap gap-2"
                >
                  {participantsStatus.map(p => (
                    <div 
                      key={p.uid}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[9px] font-bold transition-all ${
                        p.isOnline ? 'bg-blue-500/20 border-blue-400/30 text-blue-200' : 'bg-brand-bg/40 border-brand-border text-brand-text/30'
                      }`}
                    >
                      <div className={`w-1 h-1 rounded-full ${p.isOnline ? 'bg-blue-400 animate-ping' : 'bg-brand-text/20'}`} />
                      {p.username}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!showSettings ? (
          <motion.div
            key="timer-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full flex flex-col items-center"
          >
            <div className="flex gap-1.5 p-1 bg-brand-bg border border-brand-border rounded-xl mb-8">
              {[
                { id: 'focus', label: 'Foco' },
                { id: 'short', label: 'Pausa Curta' },
                { id: 'long', label: 'Pausa Longa' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleModeChange(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all ${
                    mode === tab.id
                      ? 'bg-brand-text text-brand-bg font-bold shadow-sm scale-102'
                      : 'text-brand-text/60 hover:text-brand-text'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-56 h-56 flex items-center justify-center mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r="92"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-brand-border"
                  fill="transparent"
                />
                <motion.circle
                  cx="112"
                  cy="112"
                  r="92"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-blue-500/80 dark:text-blue-400"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 92}
                  animate={{ strokeDashoffset: 2 * Math.PI * 92 * (1 - progressRatio) }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </svg>

              <div className="absolute flex flex-col items-center">
                <span className="font-mono text-5xl font-black tracking-tight text-brand-text">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-brand-text/40 uppercase mt-1">
                  {mode === 'focus' ? 'FOCANDO' : 'PAUSADO'}
                </span>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetTimer}
                className="p-4 bg-brand-bg hover:bg-brand-text/10 border border-brand-border rounded-xl text-brand-text flex items-center justify-center cursor-pointer transition-colors"
                title="Resetar tempo"
              >
                <RotateCcw size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, shadow: "0 10px 25px rgba(59,130,246,0.5)" }}
                whileTap={{ scale: 0.96 }}
                onClick={toggleTimer}
                className="px-8 py-4 bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:shadow-[0_10px_25px_rgba(59,130,246,0.35)] transition-all select-none"
              >
                {isRunning ? (
                  <>
                    <Pause size={18} fill="currentColor" />
                    <span>PAUSAR</span>
                  </>
                ) : (
                  <>
                    <Play size={18} fill="currentColor" />
                    <span>INICIAR</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playClickFeedback();
                  handleTimerEnd();
                }}
                className="p-4 bg-brand-bg hover:bg-brand-text/10 border border-brand-border rounded-xl text-brand-text flex items-center justify-center cursor-pointer transition-colors"
                title="Pular ciclo"
              >
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="timer-settings"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onSubmit={saveSettings}
            className="w-full flex flex-col gap-4 text-xs"
          >
            <h4 className="font-display font-bold text-sm text-brand-text mb-2">Ajustar Tempos (Minutos)</h4>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-brand-text/60 text-[10px] uppercase font-mono">Foco</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={inputFocus}
                  onChange={(e) => setInputFocus(parseInt(e.target.value) || 25)}
                  className="w-full p-2.5 bg-brand-bg text-brand-text border border-brand-border rounded-lg text-center"
                />
              </div>
              <div className="space-y-1">
                <label className="text-brand-text/60 text-[10px] uppercase font-mono">Pausa Curta</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={inputShort}
                  onChange={(e) => setInputShort(parseInt(e.target.value) || 5)}
                  className="w-full p-2.5 bg-brand-bg text-brand-text border border-brand-border rounded-lg text-center"
                />
              </div>
              <div className="space-y-1">
                <label className="text-brand-text/60 text-[10px] uppercase font-mono">Pausa Longa</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={inputLong}
                  onChange={(e) => setInputLong(parseInt(e.target.value) || 15)}
                  className="w-full p-2.5 bg-brand-bg text-brand-text border border-brand-border rounded-lg text-center"
                />
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <label className="text-brand-text/60 text-[10px] uppercase font-mono flex items-center gap-1.5">
                <Volume2 size={12} />
                Toque do Alarme
              </label>
              <div className="grid grid-cols-3 gap-1 px-1 py-1 bg-brand-bg rounded-lg border border-brand-border">
                {[
                  { id: 'sound_standard', label: 'Padrão' },
                  { id: 'sound_retro', label: 'Retrô' },
                  { id: 'sound_zen', label: 'Zen' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => testAlarm(s.id)}
                    className={`p-2 rounded-md font-medium text-[10px] truncate cursor-pointer transition-all ${
                      selectedAlarm === s.id
                        ? 'bg-brand-text text-brand-bg font-bold'
                        : 'text-brand-text/75 hover:bg-brand-text/5'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-4 justify-end">
              <button
                type="button"
                onClick={() => {
                  playClickFeedback();
                  setShowSettings(false);
                }}
                className="px-4 py-2 border border-brand-border bg-brand-bg hover:bg-brand-text/5 text-brand-text rounded-lg font-medium cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer"
              >
                <Save size={14} />
                Salvar
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}