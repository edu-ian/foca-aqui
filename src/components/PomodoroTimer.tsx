/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Settings, Volume2, Save, ArrowRight } from 'lucide-react';
import { playSound, playClickFeedback } from '../utils/audio';

type TimerMode = 'focus' | 'short' | 'long';

interface PomodoroTimerProps {
  onCycleComplete: (mode: TimerMode, minutes: number) => void;
  onTimerRunningChange: (isRunning: boolean) => void;
}

export default function PomodoroTimer({
  onCycleComplete,
  onTimerRunningChange,
}: PomodoroTimerProps) {
  // Conjunto / Tabela de Variáveis base p/ durabilidades temporais (Configurada pelos minutos!).
  const [durations, setDurations] = useState({
    focus: 25,
    short: 5,
    long: 15,
  });

  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAlarm, setSelectedAlarm] = useState('sound_standard');

  // Estado/inputs utilizados/conectados no Formularios Configuracionais (Setando ou Configurando propriedades)!
  const [inputFocus, setInputFocus] = useState(25);
  const [inputShort, setInputShort] = useState(5);
  const [inputLong, setInputLong] = useState(15);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mecanismos ativadores (Cronometro reajustes etc): -> Reajusta valor se houve tempo alterado (Modificação sem Start Inicial Executando).
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(durations[mode] * 60);
    }
  }, [mode, durations]);

  // Lógica Essêncial do Tick Principal ou do Andar/Girar (Coração Mecânico / Clock principal) de segundos.
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
    
    // Sinalizar Atributos/Comunicações P/ Ancestrais (Parent Components) informativamente. 
    const minutesFocused = durations[mode];
    onCycleComplete(mode, minutesFocused);
    
    // Função que efetua autônomas alterações! Alterna estados do Temporizados s/ necessidade humana direta.
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
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    playClickFeedback();
    setIsRunning(false);
    setTimeLeft(durations[mode] * 60);
  };

  const handleModeChange = (newMode: TimerMode) => {
    playClickFeedback();
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(durations[newMode] * 60);
  };

  const saveSettings = (e: React.FormEvent) => {
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

  const testAlarm = (soundId: string) => {
    setSelectedAlarm(soundId);
    playSound(soundId);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular o valor métrico adequado / Indicador Circular Geométricos no "Arco/Grau" - Composição percentual vs Barra Completa.
  const totalSeconds = durations[mode] * 60;
  const progressRatio = totalSeconds > 0 ? timeLeft / totalSeconds : 0;

  return (
    <div className="p-6 rounded-2xl bg-brand-card border border-brand-border transition-all flex flex-col items-center justify-center relative overflow-hidden h-full shadow-xl hover:shadow-2xl duration-300">
      {/* Animações Das Circunferencia Ou Fitas Tracejaveis Visual com Cores Effeito Neons , No Entorno Dos Cronometors Em Momento Ou Estado  "Desejavel Da Focus Active E  Estudando." */}
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

      <AnimatePresence mode="wait">
        {!showSettings ? (
          <motion.div
            key="timer-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full flex flex-col items-center"
          >
            {/* Area De Selector / (Abas e Botões Em Linhas "Tabs") De Escolhas De  Configuacoes (Modalidade 1 (O pomodoro) || Modalidade 2 (As Pausas Etc.)  ). */}
            <div className="flex gap-1.5 p-1 bg-brand-bg border border-brand-border rounded-xl mb-8">
              {[
                { id: 'focus', label: 'Foco' },
                { id: 'short', label: 'Pausa Curta' },
                { id: 'long', label: 'Pausa Longa' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleModeChange(tab.id as TimerMode)}
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

            {/* Recipiente Geométricos De Containers Do Formatos Circular / Coronal C/ "Radiados Glowing Luzes" Brilhosos Eletromagnèticos, Para O Circulador Central (Aonde Cronometro Fica Envelopado!). */}
            <div className="relative w-56 h-56 flex items-center justify-center mb-8">
              {/* Trilha Seca E Circulo Vectorizada Sem Preenchimentos! Linha Fundo Guia  Circulo-base Padrões / Anel Para Reprentações Circular  (Rings!) dos Fundos E Cronometro vazio. */}
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

              {/* Composições E Quadros  De Fonte / Fontes Visuais & Typograficas Centrals Responsavel Exclusio E Especificos "Textos E Numeros Temporizados" !. */}
              <div className="absolute flex flex-col items-center">
                <span className="font-mono text-5xl font-black tracking-tight text-brand-text">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-brand-text/40 uppercase mt-1">
                  {mode === 'focus' ? 'FOCANDO' : 'PAUSADO'}
                </span>
              </div>
            </div>

            {/* Barramentos, Botoes Da Centralidades Dos "Controllers / Módulos Acionadores Primário" & Contoladores Das Ações Padrões & De Fluxo Do Timer : (E.X. Pausar, Iniciar, Reset) */}
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

            {/* Área Seletiva  Da Interfaces E Configuraçoes Acústica (Definicões E Botõezinhos De Parametrizações E Ativadores Dos Modos Musics ou Sininhos). */}
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
