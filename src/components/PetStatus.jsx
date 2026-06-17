import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Activity, Star, Shield, Rocket, Sparkles, Volume2, Bell, Palette, PackageOpen, Zap, Trash2 } from 'lucide-react';
import { playClickFeedback } from '../utils/audio';

export default function PetStatus({ pet, shopItems = [], onEquipItem, onConsumeItem, onPetClick }) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState([]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  const getStatusText = () => {
    if (pet.status === 'dead') return 'Oh não! Sua foca faleceu por falta de energia (72h sem uso). Use uma Poção de Reviver!';
    if (pet.status === 'focusing') return 'Focada e concentrada!';
    if (pet.status === 'sleeping') return 'Cochilando...';
    if (pet.status === 'happy') return 'Super feliz e animada!';
    if (pet.energy < 30) return 'Meio cansada, precisa de foco';
    return 'Desejando produzir!';
  };

  const handlePetClick = (e) => {
    if (pet.status === 'dead') return;
    playClickFeedback();
    if (onPetClick) onPetClick(e);
    
    setClickCount((c) => c + 1);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newHeart = { id: Date.now(), x, y };

    setFloatingHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);
  };

  const renderItemIcon = (iconName) => {
    const props = { size: 12 };
    switch (iconName) {
      case 'Shield': return <Shield {...props} className="text-blue-500" />;
      case 'Rocket': return <Rocket {...props} className="text-orange-400" />;
      case 'Sparkles': return <Sparkles {...props} className="text-yellow-400" />;
      case 'Volume2': return <Volume2 {...props} className="text-cyan-400" />;
      case 'Bell': return <Bell {...props} className="text-emerald-400" />;
      case 'Palette': return <Palette {...props} className="text-pink-400" />;
      default: return <Sparkles {...props} />;
    }
  };

  const getSkinLabel = () => {
    if (pet.status === 'dead') return 'Foca Abatida';
    if (pet.skin === 'skin_ninja') return 'Ninja das Sombras';
    if (pet.skin === 'skin_astronauta') return 'Fonauta Cósmica';
    if (pet.skin === 'skin_mago') return 'Foca Arcana';
    return 'Foca Comum';
  };

  const xpPercentage = Math.round((pet.experience / pet.maxExperience) * 100);

  const equippedSkinsAndSounds = shopItems.filter(item => item.purchased && (item.type === 'skin' || item.type === 'sound'));

  const getBodyColor = () => {
    if (pet.status === 'dead') return '#475569';
    return '#e2e8f0';
  };

  const getBodyDarkColor = () => {
    if (pet.status === 'dead') return '#1e293b';
    return '#94a3b8';
  };

  return (
    <div className="p-6 rounded-2xl bg-brand-card border border-brand-border flex flex-col h-full shadow-xl hover:shadow-2xl duration-300 select-none relative overflow-hidden">
      {pet.status === 'focusing' && (
        <span className="absolute top-4 right-4 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-duration-1000"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
      )}

      <div className="w-full justify-between items-center mb-3 flex shrink-0">
        <h3 className="font-display font-medium text-brand-text/60 text-xs font-mono tracking-widest">
          SANTUÁRIO DO MASCOTE
        </h3>
        
        <div className="px-2.5 py-1 bg-yellow-400/15 border border-yellow-400/20 text-yellow-500 text-[9px] font-mono font-black uppercase rounded-full flex items-center gap-1">
          <Star size={10} fill="currentColor" />
          LVL {pet.level}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-4 relative min-h-[160px]">
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {floatingHearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, scale: 0.5, x: h.x, y: h.y }}
              animate={{ opacity: 0, scale: 1.5, y: h.y - 100, rotate: [-10, 10, -5] }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute text-red-500 text-sm"
            >
              ❤️
            </motion.div>
          ))}
        </div>

        <div className={`absolute w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none transition-all duration-700 ${
          pet.status === 'dead'
            ? 'bg-red-900/40 scale-85'
            : pet.status === 'focusing' 
            ? 'bg-blue-500 scale-125' 
            : pet.status === 'happy' 
            ? 'bg-green-500 scale-130' 
            : pet.energy < 30 
            ? 'bg-amber-700/50 scale-90' 
            : 'bg-indigo-500'
        }`} />

        <motion.div
          onClick={handlePetClick}
          whileHover={pet.status !== 'dead' ? { scale: 1.05 } : {}}
          whileTap={pet.status !== 'dead' ? { scale: 0.95, rotate: [0, -3, 3, 0] } : {}}
          animate={
          pet.isJumping 
            ? { y: [0, -40, 0], scale: [1, 1.15, 1], rotate: [0, 12, -12, 0] }
            : pet.status === 'dead'
            ? { y: [0, 1, 0], rotate: [0.5, -0.5, 0.5] }
            : pet.status === 'focusing'
            ? { y: [0, -3, 0], scale: [1, 1.02, 1] }
            : pet.status === 'happy'
            ? { y: [0, -12, 0], rotate: [0, 8, -8, 0] }
            : pet.status === 'sleeping'
            ? { scale: [0.98, 1, 0.98], y: [0, 1, 0] }
            : { y: [0, -4, 0] }
          }
          transition={{
          repeat: pet.isJumping ? 0 : Infinity,
          duration: pet.isJumping ? 0.6 : (pet.status === 'dead' ? 4 : pet.status === 'sleeping' ? 3.2 : pet.status === 'happy' ? 0.7 : 2.5),
          ease: pet.isJumping ? "easeOut" : "easeInOut"
          }}
          className="w-36 h-36 relative cursor-pointer"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl select-none">
            <ellipse cx="50" cy="76" rx="30" ry="4" fill="currentColor" className="text-brand-text/10" />
            <path d="M14 62 Q 2 67 15 74" fill={getBodyDarkColor()} />
            <path d="M86 62 Q 98 67 85 74" fill={getBodyDarkColor()} />
            <ellipse cx="50" cy="56" rx="36" ry="24" fill={getBodyColor()} />
            
            {pet.status !== 'dead' && (
              <>
                <circle cx="30" cy="58" r="4" fill="#fda4af" className="opacity-80" />
                <circle cx="70" cy="58" r="4" fill="#fda4af" className="opacity-80" />
              </>
            )}

            {pet.status !== 'dead' && (
              <>
                {pet.skin === 'skin_ninja' && (
                  <>
                    <ellipse cx="50" cy="54" rx="37" ry="22" fill="#0f172a" />
                    <rect x="25" y="42" width="50" height="20" rx="8" fill="#e2e8f0" />
                    <rect x="22" y="38" width="56" height="4" fill="#ef4444" />
                    <path d="M18 38 L12 44 M18 42 L11 48" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                )}

                {pet.skin === 'skin_astronauta' && (
                  <>
                    <ellipse cx="50" cy="71" rx="22" ry="5" fill="#94a3b8" />
                    <ellipse cx="50" cy="70" rx="20" ry="4" fill="#cbd5e1" />
                    <rect x="46" y="69" width="8" height="4" fill="#ef4444" />
                    <circle cx="50" cy="50" r="28" fill="rgba(147, 197, 253, 0.15)" stroke="#93c5fd" strokeWidth="2.5" />
                    <ellipse cx="62" cy="38" rx="8" ry="4" fill="rgba(255, 255, 255, 0.4)" />
                  </>
                )}

                {pet.skin === 'skin_mago' && (
                  <>
                    <path d="M22 36 L50 4 L78 36 Z" fill="#312e81" stroke="#fbbf24" strokeWidth="1" />
                    <ellipse cx="50" cy="36" rx="32" ry="4" fill="#1e1b4b" />
                    <polygon points="50,12 51,15 54,15 52,17 53,20 50,18 47,20 48,17 46,15 49,15" fill="#facc15" />
                    <polygon points="40,24 41,26 43,26 41,27 42,29 40,28 38,29 39,27 37,26 39,26" fill="#facc15" />
                  </>
                )}

                {pet.skin === 'skin_oculos' && (
                  <>
                    <path d="M18 45 Q23 48 29 51 M82 45 Q77 48 71 51" fill="none" stroke="#64748b" strokeWidth="3.5" />
                    <path d="M30 50 C26 50, 24 57, 30 60 C38 60, 42 56, 42 51 C38 49, 32 49, 30 50 Z" fill="#ef4444" stroke="#475569" strokeWidth="2.5" />
                    <path d="M70 50 C74 50, 76 57, 70 60 C62 60, 58 56, 58 51 C62 49, 68 49, 70 50 Z" fill="#ef4444" stroke="#475569" strokeWidth="2.5" />
                    <path d="M42 51 Q50 49 58 51" fill="none" stroke="#475569" strokeWidth="3" />
                    <ellipse cx="32" cy="53" rx="3" ry="1.5" fill="#fcd34d" transform="rotate(-15 32 53)" />
                    <ellipse cx="68" cy="53" rx="3" ry="1.5" fill="#fcd34d" transform="rotate(15 68 53)" />
                  </>
                )}

                {pet.skin === 'skin_dev' && (
                  <>
                    <path d="M29 51 h42 m-42 0 v7 a7 7 0 0 0 14 0 v-7 m14 0 v7 a7 7 0 0 0 14 0 v-7" fill="none" stroke="#1f2937" strokeWidth="2.5" />
                    <line x1="43" y1="51" x2="57" y2="51" stroke="#1f2937" strokeWidth="2.5" />
                    <path d="M30 68 L70 68 L75 80 L25 80 Z" fill="#cbd5e1" />
                    <rect x="33" y="69" width="34" height="2" fill="#94a3b8" />
                    <rect x="42" y="76" width="16" height="2" fill="#64748b" />
                  </>
                )}
              </>
            )}

            <line x1="22" y1="58" x2="10" y2="56" stroke="#94a3b8" strokeWidth="1" />
            <line x1="22" y1="62" x2="11" y2="64" stroke="#94a3b8" strokeWidth="1" />
            <line x1="78" y1="58" x2="90" y2="56" stroke="#94a3b8" strokeWidth="1" />
            <line x1="78" y1="62" x2="89" y2="64" stroke="#94a3b8" strokeWidth="1" />

            {pet.status === 'dead' ? (
              <>
                <path d="M34 47 L41 54 M41 47 L34 54" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M59 47 L66 54 M66 47 L59 54" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : isBlinking ? (
              <>
                <line x1="34" y1="51" x2="43" y2="51" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="58" y1="51" x2="67" y2="51" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : pet.status === 'focusing' ? (
              <>
                <path d="M34 52 Q 40 48 42 53" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M66 52 Q 60 48 58 53" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : pet.status === 'sleeping' || pet.energy < 20 ? (
              <>
                <path d="M34 53 Q 40 56 44 53" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M66 53 Q 60 56 56 53" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : pet.status === 'happy' ? (
              <>
                <path d="M34 53 Q 39 46 44 53" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M56 53 Q 61 46 66 53" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="39" cy="51" r="3.5" fill="#0f172a" />
                <circle cx="38" cy="49" r="1.2" fill="#ffffff" />
                <circle cx="61" cy="51" r="3.5" fill="#0f172a" />
                <circle cx="60" cy="49" r="1.2" fill="#ffffff" />
              </>
            )}

            <ellipse cx="50" cy="56" rx="4" ry="2.8" fill="#1e293b" />
            
            {pet.status === 'dead' ? (
              <path d="M47 61 Q 50 58 53 61" fill="none" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
            ) : pet.status === 'happy' ? (
              <path d="M46 58 Q 50 66 54 58 Z" fill="#f43f5e" stroke="#1e293b" strokeWidth="1.5" />
            ) : (
              <path d="M47 58 C 48 59.5 50 59.5 50 58 C 50 59.5 52 59.5 53 58" fill="none" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>

          {pet.status === 'sleeping' && (
            <div className="absolute top-4 right-1 flex flex-col font-mono font-bold text-xs select-none">
              <motion.span animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-blue-500">Z</motion.span>
              <motion.span animate={{ y: [2, -8, 2], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.6 }} className="text-indigo-400 text-[10px]">z</motion.span>
              <motion.span animate={{ y: [4, -6, 4], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1.2 }} className="text-blue-300 text-[8px]">z</motion.span>
            </div>
          )}

          {pet.status === 'dead' && (
            <div className="absolute top-2 right-1 flex flex-col font-mono text-[10px] select-none">
              <motion.span animate={{ y: [0, -8, 0], opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 3 }} className="text-slate-400">💀</motion.span>
            </div>
          )}
        </motion.div>

        <div className="text-center mt-2 max-w-xs">
          <h4 className="text-xs font-bold text-brand-text mb-0.5">{getSkinLabel()}</h4>
          <p className="text-[10px] text-brand-text/50 font-mono italic uppercase tracking-wider">{getStatusText()}</p>
        </div>
      </div>

      <div className="space-y-4 shrink-0">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-brand-text/50 flex items-center gap-1">XP Do Mascote</span>
            <span className="text-[#3b82f6] font-bold">{pet.experience} / {pet.maxExperience} XP</span>
          </div>
          <div className="w-full h-1.5 bg-brand-bg rounded-md p-px border border-brand-border overflow-hidden">
            <div 
              style={{ width: `${xpPercentage}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md transition-all duration-300" 
            />
          </div>
        </div>

        <div className="p-3 bg-brand-bg/40 border border-[#F8F6F0]/10 rounded-xl">
          <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
            <span className="text-brand-text/50 flex items-center gap-1.5">
              <Activity size={10} className="text-amber-500 animate-pulse" />
              Barra de Energia
            </span>
            <span className={`${pet.energy < 30 ? 'text-red-500 font-extrabold animate-pulse' : 'text-amber-500'} font-bold`}>
              {pet.energy}% / 100%
            </span>
          </div>
          
          <div className="w-full h-3 bg-brand-bg rounded-lg p-[1px] border border-brand-border overflow-hidden">
            <div
              style={{ 
                width: `${pet.energy}%`,
                backgroundImage: pet.energy < 30 
                  ? 'linear-gradient(90deg, #ef4444, #f97316)' 
                  : 'linear-gradient(90deg, #f59e0b, #eab308, #10b981)'
              }}
              className="h-full rounded-lg transition-all duration-500"
            />
          </div>
          <p className="text-[9px] text-[#F8F6F0]/40 font-mono mt-1 text-center shrink-0">
            {pet.status === 'dead'
              ? 'Mascote Abatido! Utilize uma Poção de Reviver no Inventário.'
              : pet.energy >= 80 
              ? 'Energia Excelente! Mascote ativo e feliz.' 
              : pet.energy < 30 
              ? 'Energia Crítica! Utilize peixes ou cafés para alimentar.' 
              : 'Nível estável. Decai 2.1 por hora de vida.'}
          </p>
        </div>

        {onConsumeItem && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {pet.status === 'dead' ? (
              <button
                type="button"
                onClick={() => onConsumeItem('potion_revive')}
                className="col-span-2 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md text-center flex items-center justify-center gap-2"
              >
                🧴 Usar Poção de Reviver
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onConsumeItem('food_peixe')}
                  className="py-1.5 rounded-lg bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 border border-[#3b82f6]/20 text-blue-400 text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1"
                >
                  🐟 Peixe (+25)
                </button>
                <button
                  type="button"
                  onClick={() => onConsumeItem('food_cafe')}
                  className="py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1"
                >
                  ☕ Café (+15)
                </button>
              </>
            )}
          </div>
        )}

        {equippedSkinsAndSounds.length > 0 && (
          <div className="space-y-2 mt-2 shrink-0 border-t border-brand-border/40 pt-3">
            <div className="flex justify-between items-center text-[9px] font-mono font-bold text-brand-text/50 uppercase select-none">
              <span>Skins & Sons Equipados</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {equippedSkinsAndSounds.map(item => (
                <span 
                  key={item.id} 
                  onClick={() => onEquipItem && onEquipItem(item.id)}
                  className={`px-2 py-0.5 rounded text-[8px] font-mono cursor-pointer transition-all ${
                    item.equipped 
                      ? 'bg-indigo-600 text-white border border-indigo-400/40' 
                      : 'bg-brand-bg/50 text-brand-text/50 border border-brand-border/40 hover:text-brand-text'
                  }`}
                >
                  {item.name} {item.equipped ? '★' : ''}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}