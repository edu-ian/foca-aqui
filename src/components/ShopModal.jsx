import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Coins, Check, Gift, ShoppingCart, Sparkles, AlertCircle } from 'lucide-react';
import { playClickFeedback } from '../utils/audio';

export default function ShopModal({
  isOpen,
  onClose,
  coins,
  items,
  onBuyItem,
  onEquipItem,
  onOpenMysteryBox,
}) {
  const [activeTab, setActiveTab] = useState('custom');

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    playClickFeedback();
    onClose();
  };

  const isPotionLimitReached = (item) => {
    if (item.id === 'potion_revive') {
      return (item.weeklyPurchasedCount || 0) >= 2;
    }
    return false;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#02030d]/85 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative w-full max-w-2xl bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-brand-text font-sans"
          >
            <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-500">
                  <Coins size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg uppercase tracking-tight">Mercado Foca Aqui</h3>
                  <p className="text-[10px] text-brand-text/50 font-mono uppercase tracking-wider">Troque moedas acumuladas focado por melhorias</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-brand-bg px-4 py-2 rounded-xl border border-brand-border flex items-center gap-2">
                  <Coins size={14} className="text-yellow-400" />
                  <span className="font-mono font-bold text-xs text-yellow-500">{coins} Moedas</span>
                </div>
                
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-brand-text/5 rounded-lg text-brand-text/60 hover:text-brand-text transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex border-b border-brand-border bg-brand-bg/50 p-1 shrink-0">
              <button
                onClick={() => { playClickFeedback(); setActiveTab('custom'); }}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'custom'
                    ? 'border-b-2 border-blue-500 text-brand-text font-heavy'
                    : 'text-brand-text/40 hover:text-brand-text/60'
                }`}
              >
                 Cosméticos
              </button>
              <button
                onClick={() => { playClickFeedback(); setActiveTab('food'); }}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'food'
                    ? 'border-b-2 border-blue-500 text-brand-text font-heavy'
                    : 'text-brand-text/40 hover:text-brand-text/60'
                }`}
              >
                Comidas, Bebidas & Poções
              </button>
            </div>

            <div className="flex-1 p-5 overflow-y-auto bg-brand-bg/30 space-y-4">
              
              {activeTab === 'custom' ? (
                <div>
                  <h4 className="text-[10px] font-mono uppercase text-brand-text/40 tracking-widest font-black mb-3">
                    Estilo e Alarmes Exclusivos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.filter(item => item.type === 'skin' || item.type === 'sound').map((item) => (
                      <div 
                        key={item.id} 
                        className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                          item.equipped 
                            ? 'border-blue-500/50 bg-blue-500/5' 
                            : 'border-brand-border bg-brand-bg/60 hover:border-brand-text/20'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[9px] uppercase tracking-wider font-bold bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded">
                            {item.type === 'skin' ? 'Skin' : 'Som Alarme'}
                          </span>
                          {item.purchased && (
                            <span className="text-[9px] text-emerald-400 font-mono font-bold">Adquirido ✓</span>
                          )}
                        </div>

                        <div className="mb-4">
                          <h5 className="font-display font-extrabold text-sm mb-1 text-brand-text">{item.name}</h5>
                          <p className="text-xs text-brand-text/60 leading-relaxed">{item.description}</p>
                        </div>

                        <div className="pt-3 border-t border-brand-border flex items-center justify-between gap-2 mt-auto">
                          {!item.purchased ? (
                            <>
                              <span className="text-xs font-mono font-bold text-yellow-500 flex items-center gap-1">
                                {item.price} Moedas
                              </span>
                              <button
                                disabled={coins < item.price}
                                onClick={() => onBuyItem(item.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase cursor-pointer transition-all ${
                                  coins >= item.price
                                    ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-103 shadow-sm'
                                    : 'bg-white/5 text-[#F8F6F0]/20 cursor-not-allowed border border-brand-border'
                                  }`}
                              >
                                Comprar
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => onEquipItem(item.id)}
                              className={`w-full py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                item.equipped
                                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black'
                                  : 'bg-[#F8F6F0] text-emerald-950 hover:bg-[#F8F6F0]/80 hover:scale-101'
                              }`}
                            >
                              {item.equipped ? (
                                <>
                                  <Check size={14} strokeWidth={3} />
                                  <span>HABILITADO</span>
                                </>
                              ) : (
                                <span>EQUIPAR / ATIVAR</span>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-[10px] font-mono uppercase text-brand-text/40 tracking-widest font-black mb-3">
                    Consumíveis de Energia & Fortificantes
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.filter(item => item.type === 'food' || item.type === 'potion' || item.type === 'mystery_box').map((item) => {
                      const limitReached = isPotionLimitReached(item);
                      return (
                        <div 
                          key={item.id} 
                          className="p-4 rounded-xl border border-brand-border bg-brand-bg/60 hover:border-brand-text/25 flex flex-col justify-between transition-all"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] uppercase tracking-wider font-extrabold bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded">
                              {item.type === 'food' ? 'Consumível' : item.type === 'potion' ? 'Raro' : 'Mistério'}
                            </span>
                            
                            <span className="text-xs font-mono font-black text-indigo-400">
                              No estoque: {item.quantity || 0}
                            </span>
                          </div>

                          <div className="mb-4">
                            <h5 className="font-display font-black text-sm mb-1 text-brand-text flex items-center gap-1.5">
                              {item.name}
                            </h5>
                            <p className="text-xs text-brand-text/60 leading-relaxed">{item.description}</p>
                            
                            {item.id === 'potion_revive' && (
                              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono font-bold text-rose-400">
                                <AlertCircle size={12} />
                                <span>Comprados esta semana: {item.weeklyPurchasedCount || 0}/2</span>
                              </div>
                            )}
                          </div>

                          <div className="pt-3 border-t border-brand-border flex items-center justify-between gap-2 mt-auto">
                            <span className="text-xs font-mono font-bold text-yellow-500 flex items-center gap-1">
                              {item.price} Moedas
                            </span>
                            
                            <button
                              disabled={coins < item.price || limitReached}
                              onClick={() => onBuyItem(item.id)}
                              className={`px-4 py-2 rounded-xl text-xs font-black uppercase cursor-pointer transition-all flex items-center gap-1 ${
                                coins >= item.price && !limitReached
                                  ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-103 shadow-md'
                                  : 'bg-white/5 text-[#F8F6F0]/20 cursor-not-allowed border border-[#F8F6F0]/10'
                              }`}
                            >
                              <ShoppingCart size={12} />
                              {limitReached ? 'Esgotado' : 'Comprar'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-brand-bg border-t border-brand-border text-center flex flex-col items-center gap-1">
              <span className="text-[10px] font-mono text-brand-text/40">
                Ganhe mais moedas permanecendo em sessões de foco. 1 minuto focado pelo cronômetro = 1 moeda.
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}