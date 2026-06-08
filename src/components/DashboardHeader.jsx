import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Flame, LogOut, Menu } from 'lucide-react';
import { playClickFeedback } from '../utils/audio';

export default function DashboardHeader({
  theme,
  onToggleTheme,
  streak,
  userEmail = 'eduianbf@gmail.com',
  onLogout,
  onOpenSidebar,
}) {
  // Extrai a parte antes do '@' e capitaliza a primeira letra (ex: eduianbf -> Eduianbf)
  const nameFromEmail = userEmail ? userEmail.split('@')[0] : 'Produtor';
  const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

  const handleToggle = () => {
    playClickFeedback();
    onToggleTheme();
  };

  return (
    <header className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-brand-card border border-brand-border transition-all shadow-lg hover:shadow-xl duration-300">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playClickFeedback();
            onOpenSidebar();
          }}
          className="p-3 bg-brand-bg hover:bg-brand-text/5 border border-brand-border rounded-xl text-brand-text flex items-center justify-center cursor-pointer transition-colors"
          title="Abrir Menu"
        >
          <Menu size={18} />
        </motion.button>

        {/* Animação da Nova Logo hospedada */}
        <motion.div 
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="w-12 h-12 flex items-center justify-center shrink-0"
        >
          <img 
            src="https://i.imgur.com/fYf9NPK.png" 
            alt="Foca Aqui" 
            className="w-20 h-20 object-contain rounded-xl" 
          />
        </motion.div>

        {/* Estrutura do Texto da Saudação Dividida */}
        <div>
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-brand-text leading-tight">
            Olá,
          </h1>
          <h2 className="text-base font-medium text-brand-text/60 font-mono tracking-tight leading-none mt-0.5">
            {capitalizedName}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-2 text-orange-500 select-none cursor-help"
          title="Sua consistência produtiva ativa!"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <Flame size={18} fill="currentColor" stroke="none" />
          </motion.div>
          <span className="text-xs font-mono font-bold">{streak} Dias de Streak</span>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className="p-3 bg-brand-bg hover:bg-brand-text/5 border border-brand-border rounded-xl text-brand-text flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Alternar Tema"
        >
          {theme === 'dark' ? (
            <Sun size={18} className="text-yellow-400" />
          ) : (
            <Moon size={18} className="text-indigo-900" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playClickFeedback();
            onLogout();
          }}
          className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Sair"
        >
          <LogOut size={18} />
        </motion.button>
      </div>
    </header>
  );
}