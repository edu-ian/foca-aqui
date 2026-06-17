import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Award, Users, ShoppingBag, Mail, UserPlus, UserMinus, BarChart3, Key, Trash,
  Check, RefreshCw, Send, Plus, Flame, PlusCircle, ShieldAlert, UserCheck, UserX, Calendar, TrendingUp
} from 'lucide-react';
import { playClickFeedback } from '../utils/audio';
import AnalyticsReports from './AnalyticsReports';

export default function NavigationSidebar({
  isOpen,
  onClose,
  userEmail,
  username,
  onUpdateUsername,
  pet,
  stats,
  shopItems,
  onEquipItem,
  onConsumeItem,
  friends,
  onAddFriend,
  pendingRequests,
  onAcceptFriend,
  onDenyFriend,
  socialSessions,
  onCreateSession,
  onJoinSession,
  activeSessionId,
  onKickParticipant,
  onInviteFriend,
  sessionInvites,
  onAcceptSessionInvite,
  onDeclineSessionInvite,
  onUpdatePassword,
  onDeleteAccount,
  onSendSupport,
  theme = 'dark'
}) {
  const [activeTab, setActiveTabState] = useState('profile');

  React.useEffect(() => {
    const syncTabFromHash = () => {
      const hash = window.location.hash;
      if (hash === '#/perfil') setActiveTabState('profile');
      else if (hash === '#/dashboard-stats') setActiveTabState('stats');
      else if (hash === '#/rank') setActiveTabState('rank');
      else if (hash === '#/social') setActiveTabState('social');
      else if (hash === '#/inventario') setActiveTabState('inventory');
      else if (hash === '#/amigos') setActiveTabState('friends');
      else if (hash === '#/suporte') setActiveTabState('support');
    };

    syncTabFromHash();
    window.addEventListener('hashchange', syncTabFromHash);
    return () => window.removeEventListener('hashchange', syncTabFromHash);
  }, []);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    const hash = tab === 'profile' ? '#/perfil' :
                 tab === 'stats' ? '#/dashboard-stats' :
                 tab === 'rank' ? '#/rank' :
                 tab === 'social' ? '#/social' :
                 tab === 'inventory' ? '#/inventario' :
                 tab === 'friends' ? '#/amigos' : '#/suporte';
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  };
  
  // Cálculos Avançados de Analytics
  const bestDayOfWeek = [...stats.weeklyFocus].sort((a, b) => b.minutes - a.minutes)[0];
  const avgDailyFocus = (stats.weeklyFocus.reduce((acc, curr) => acc + curr.minutes, 0) / 7).toFixed(1);
  
  const bestMonth = [...stats.yearlyFocus].sort((a, b) => b.minutes - a.minutes)[0];

  const [newNameInput, setNewNameInput] = useState(username);
  const [newFriendInput, setNewFriendInput] = useState('');
  const [friendFeedback, setFriendFeedback] = useState(null);
  
  const [sessionTitle, setSessionTitle] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSent, setSupportSent] = useState(false);

  const handleUpdateName = (e) => {
    e.preventDefault();
    playClickFeedback();
    if (!newNameInput.trim()) return;
    onUpdateUsername(newNameInput.trim().substring(0, 20));
  };

  const handleAddFriendSubmit = (e) => {
    e.preventDefault();
    playClickFeedback();
    if (!newFriendInput.trim()) return;
    const success = onAddFriend(newFriendInput.trim());
    if (success) {
      setFriendFeedback('Amigo adicionado com sucesso!');
      setNewFriendInput('');
    } else {
      setFriendFeedback('Usuário não encontrado.');
    }
    setTimeout(() => setFriendFeedback(null), 3000);
  };

  const handleCreateSessionSubmit = (e) => {
    e.preventDefault();
    playClickFeedback();
    if (!sessionTitle.trim()) return;
    onCreateSession(sessionTitle.trim());
    setSessionTitle('');
  };

  const handleSendSupport = (e) => {
    e.preventDefault();
    playClickFeedback();
    if (!supportMessage.trim()) return;
    onSendSupport(supportMessage.trim());
    setSupportSent(true);
    setSupportMessage('');
    setTimeout(() => setSupportSent(false), 4000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-50 flex justify-start font-sans text-brand-text ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020309]/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full sm:w-[400px] lg:w-[40vw] max-w-[100vw] h-full bg-brand-card border-r border-brand-border shadow-2xl flex flex-col z-10"
          >
            <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-bg">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="font-display font-black text-sm uppercase tracking-wider">Painel Global // Foca Aqui</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-brand-text/5 hover:bg-brand-text/10 text-brand-text/60 hover:text-brand-text rounded-lg transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <div className="w-[110px] border-r border-brand-border/50 bg-brand-bg/60 flex flex-col items-center py-4 gap-2.5 shrink-0 select-none">
                {[
                  { id: 'profile', label: 'Perfil', icon: User },
                  { id: 'stats', label: 'Dashboard', icon: BarChart3 },
                  { id: 'inventory', label: 'Inventário', icon: ShoppingBag },
                  { id: 'friends', label: 'Amigos', icon: UserPlus },
                  { id: 'social', label: 'Sala de Foco', icon: Users },
                  { id: 'support', label: 'Suporte', icon: Mail },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { playClickFeedback(); setActiveTab(item.id); }}
                      className={`w-20 p-2.5 rounded-xl flex flex-col items-center text-center gap-1.5 transition-all text-[9.5px] font-bold uppercase cursor-pointer ${
                        isSel
                          ? 'bg-blue-600 text-brand-text shadow-lg scale-102 font-heavy'
                          : 'text-brand-text/40 hover:text-brand-text/70'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 p-5 overflow-y-auto bg-brand-card/40">
                <AnimatePresence mode="wait">
                  
                  {activeTab === 'profile' && (
                    <motion.div
                      key="profile-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-5"
                    >
                      <div>
                        <h4 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">SEU PERFIL</h4>
                        <h5 className="text-xl font-display font-black text-brand-text">{username}</h5>
                        <p className="text-xs text-brand-text/40 font-mono mt-0.5">{userEmail}</p>
                      </div>

                      <form onSubmit={handleUpdateName} className="p-4 rounded-xl bg-brand-text/5 border border-brand-border space-y-3">
                        <label className="text-[9px] font-mono font-black uppercase tracking-wider text-brand-text/50 block">
                          Alterar Nome de Usuário (Máx 20 caracteres)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={20}
                            value={newNameInput}
                            onChange={(e) => setNewNameInput(e.target.value)}
                            className="bg-brand-bg/80 border border-brand-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-brand-text flex-1"
                          />
                          <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-brand-text font-bold text-xs uppercase px-4 rounded-lg transition-colors cursor-pointer"
                          >
                            Salvar
                          </button>
                        </div>
                      </form>

                      <div className="flex flex-col gap-3">
                        <div className="p-3.5 rounded-xl bg-brand-text/5 border border-brand-border text-center">
                          <span className="text-[9px] font-mono uppercase text-brand-text/40 block">Nível do Mascote</span>
                          <span className="text-sm font-black text-yellow-500 font-mono">Level {pet.level}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-brand-border space-y-3">
                        <h6 className="text-[10px] font-mono font-bold text-brand-text/30 uppercase tracking-widest">Configurações de Conta</h6>
                        <button 
                          onClick={() => {
                            const p = prompt("Digite sua nova senha:");
                            if (p) onUpdatePassword(p);
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-brand-bg/40 border border-brand-border text-xs hover:bg-brand-text/5 transition-all"
                        >
                          <div className="flex items-center gap-2 text-brand-text/70"><Key size={14} /> Alterar Senha</div>
                          <Plus size={12} className="opacity-30" />
                        </button>
                        <button 
                          onClick={onDeleteAccount}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <div className="flex items-center gap-2"><Trash size={14} /> Excluir Minha Conta</div>
                        </button>
                      </div>

                      <div className="p-4 rounded-xl border border-blue-500/10 bg-blue-500/5 text-xs text-brand-text/70 flex flex-col gap-1.5">
                        <span className="font-extrabold text-blue-400 uppercase text-[10px]">Evolução e Parcerias</span>
                        <p>Nivele seu mascote completando focos. A cada subida de nível, recompensas e moedas extras são concedidas no seu Dashboard.</p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'stats' && (
                    <motion.div
                      key="stats-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-6"
                    >
                      <div>
                        <h4 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">CENTRAL DE DADOS</h4>
                        <h5 className="text-xl font-display font-black text-brand-text">Sua Performance</h5>
                      </div>

                      {/* GRID DE MÉTRICAS RÁPIDAS */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl bg-brand-bg/40 border border-brand-border flex flex-col gap-1">
                          <Calendar size={14} className="text-blue-400 mb-1" />
                          <span className="text-[10px] text-brand-text/40 uppercase font-bold">Melhor Dia (Semana)</span>
                          <span className="text-sm font-black text-brand-text">{bestDayOfWeek.day}: {bestDayOfWeek.minutes}m</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-brand-bg/40 border border-brand-border flex flex-col gap-1">
                          <TrendingUp size={14} className="text-emerald-400 mb-1" />
                          <span className="text-[10px] text-brand-text/40 uppercase font-bold">Média Diária</span>
                          <span className="text-sm font-black text-brand-text">{avgDailyFocus} min/dia</span>
                        </div>
                      </div>

                      {/* GRÁFICO DE ATIVIDADE SEMANAL (MOBILE FRIENDLY) */}
                      <div className="space-y-4">
                        <h6 className="text-[10px] font-mono font-black text-brand-text/40 uppercase tracking-widest">Atividade da Semana</h6>
                        <div className="space-y-3">
                          {stats.weeklyFocus.map((d, i) => (
                            <div key={i} className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className={`font-bold ${d.minutes > 0 ? 'text-brand-text' : 'text-brand-text/30'}`}>
                                  {d.day}
                                </span>
                                <span className={`${d.minutes > 0 ? 'text-blue-400 font-black' : 'text-brand-text/20'}`}>
                                  {d.minutes} min
                                </span>
                              </div>
                              <div className="h-2 w-full bg-brand-bg/60 rounded-full overflow-hidden border border-brand-border/30">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, (d.minutes / 120) * 100)}%` }}
                                  className={`h-full rounded-full ${d.minutes > 0 ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 'bg-transparent'}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <AnalyticsReports stats={stats} />

                      {/* COMPARAÇÃO COM AMIGOS */}
                      <div className="space-y-3">
                        <h6 className="text-[10px] font-mono font-black text-brand-text/40 uppercase">Duelo de Foco (Semana)</h6>
                        <div className="space-y-2">
                           <div className="flex items-center gap-3 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-black text-xs">VOCÊ</div>
                              <div className="flex-1">
                                 <div className="flex justify-between text-[10px] font-bold mb-1"><span>{username}</span><span>{stats.focusMinutesToday}m</span></div>
                                 <div className="h-1.5 bg-brand-bg rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-blue-400" /></div>
                              </div>
                           </div>
                           {friends.slice(0, 2).map(f => (
                             <div key={f.friendId} className="flex items-center gap-3 bg-brand-bg/40 p-3 rounded-xl border border-brand-border">
                               <div className="w-8 h-8 rounded-full bg-brand-text/10 flex items-center justify-center font-black text-[10px] text-brand-text/40 uppercase">{f.username.substring(0, 2)}</div>
                               <div className="flex-1">
                                  <div className="flex justify-between text-[10px] font-bold mb-1"><span>{f.username}</span><span>{f.focusMinutes || 0}m</span></div>
                                  <div className="h-1.5 bg-brand-bg rounded-full overflow-hidden"><div className="h-full bg-brand-text/20" style={{ width: '40%' }} /></div>
                               </div>
                             </div>
                           ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'rank' && (
                    <motion.div
                      key="rank-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">RANK ATIVO ONLINE</h4>
                        <h5 className="text-base font-display font-black text-brand-text">Líderes de Foco</h5>
                      </div>

                      <div className="space-y-2">
                        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-black text-blue-400">#1</span>
                            <div>
                              <span className="text-xs font-bold text-brand-text font-mono">{username} (Você)</span>
                              <span className="text-[9px] block text-brand-text/50">Mascote LVL {pet.level}</span>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-black text-blue-400">{stats.focusMinutesToday} Minutos</span>
                        </div>

                        {friends.map((friend, idx) => (
                          <div key={friend.uid} className="p-3 rounded-xl bg-brand-card/40 border border-brand-border flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono text-xs text-brand-text/30">#{idx + 2}</span>
                              <div>
                                <span className="text-xs font-bold text-brand-text">{friend.username}</span>
                                <span className="text-[9px] block text-brand-text/40">Mascote LVL {friend.level}</span>
                              </div>
                            </div>
                            <span className="text-xs font-mono text-brand-text/60">{friend.focusMinutes} Minutos</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl bg-brand-text/5 border border-brand-border space-y-2.5">
                        <span className="text-[9px] font-mono text-brand-text/40 uppercase block font-bold">Progresso Semanal Comparativo</span>
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span>{username}</span>
                              <span>{stats.focusMinutesToday}m / 100m</span>
                            </div>
                            <div className="w-full h-1 bg-brand-bg/80 rounded overflow-hidden">
                              <div style={{ width: `${Math.min(100, stats.focusMinutesToday)}%` }} className="bg-blue-500 h-full" />
                            </div>
                          </div>
                          {friends.slice(0, 2).map((fr) => (
                            <div key={fr.uid} className="space-y-1">
                              <div className="flex justify-between text-[10px] font-mono opacity-60">
                                <span>{fr.username}</span>
                                <span>{fr.focusMinutes}m / 100m</span>
                              </div>
                              <div className="w-full h-1 bg-brand-bg/80 rounded overflow-hidden">
                                <div style={{ width: `${Math.min(100, fr.focusMinutes)}%` }} className="bg-indigo-400/60 h-full" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'social' && (
                    <motion.div
                      key="social-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">SALAS DE FOCO</h4>
                        <h5 className="text-base font-display font-black text-brand-text">Foque em Conjunto</h5>
                      </div>

                      {/* Seção de Convites para Salas */}
                      {sessionInvites && sessionInvites.length > 0 && (
                        <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/30 space-y-3">
                          <span className="text-[10px] font-mono font-black text-blue-400 uppercase">Convites Pendentes</span>
                          {sessionInvites.map(inv => (
                            <div key={inv.id} className="bg-brand-bg/60 p-3 rounded-lg flex items-center justify-between gap-2 border border-blue-500/20">
                              <div className="min-w-0">
                                <p className="text-xs font-bold truncate">{inv.sessionTitle}</p>
                                <p className="text-[9px] text-brand-text/40">De: {inv.fromName}</p>
                              </div>
                              <div className="flex gap-1.5 shrink-0">
                                <button onClick={() => onAcceptSessionInvite(inv)} className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-md hover:bg-emerald-500/40 transition-all">
                                  <Check size={14} />
                                </button>
                                <button onClick={() => onDeclineSessionInvite(inv.id)} className="p-1.5 bg-rose-500/20 text-rose-400 rounded-md hover:bg-rose-500/40 transition-all">
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeSessionId ? (
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/25 space-y-2">
                            <span className="text-[9px] font-mono uppercase bg-red-500 text-brand-text px-2 py-0.5 rounded font-black tracking-wider">AO VIVO</span>
                            <h6 className="text-sm font-black text-brand-text">Sala: {socialSessions.find(s => s.id === activeSessionId)?.title}</h6>
                            <p className="text-[11px] text-brand-text/60 leading-relaxed">Você está conectado! O Host controla o tempo para todos.</p>
                          </div>

                          <div className="p-3.5 rounded-xl border border-brand-border bg-brand-bg/50 space-y-2">
                            <span className="text-[9px] font-mono text-brand-text/40 uppercase font-black block">PARTICIPANTES ONLINE</span>
                            <div className="space-y-2 max-h-[140px] overflow-y-auto">
                              {socialSessions.find(s => s.id === activeSessionId)?.participants.map(p => (
                                <div key={p.uid} className="flex items-center justify-between text-xs font-mono">
                                  <span className="text-brand-text font-bold">
                                    {p.username} {p.uid === socialSessions.find(s => s.id === activeSessionId)?.hostId ? '(Host)' : ''}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-blue-400 font-extrabold animate-pulse">● ATIVO</span>
                                    {socialSessions.find(s => s.id === activeSessionId)?.hostId === pet.userId && p.uid !== pet.userId && (
                                      <button 
                                        onClick={() => onKickParticipant(activeSessionId, p.uid)}
                                        className="text-rose-500 hover:text-rose-400 p-1"
                                      >
                                        <UserMinus size={12} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {socialSessions.find(s => s.id === activeSessionId)?.hostId === pet.userId && (
                            <div className="p-3.5 rounded-xl border border-brand-border bg-brand-bg/20 space-y-2">
                              <span className="text-[9px] font-mono text-brand-text/40 uppercase font-black block text-blue-400">Convidar Amigos</span>
                              <div className="flex flex-col gap-1.5 max-h-[100px] overflow-y-auto pr-1">
                                {friends.filter(f => !socialSessions.find(s => s.id === activeSessionId)?.participants.some(p => p.uid === f.friendId)).map(friend => (
                                  <div key={friend.friendId} className="flex items-center justify-between bg-brand-bg/40 p-2 rounded-lg">
                                    <span className="text-[10px] font-bold">{friend.username}</span>
                                    <button 
                                      onClick={() => onInviteFriend(activeSessionId, friend.friendId)}
                                      className="p-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/40"
                                    >
                                      <Plus size={10} />
                                    </button>
                                  </div>
                                ))}
                                {friends.length === 0 && <span className="text-[9px] italic opacity-30">Nenhum amigo para convidar.</span>}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => { playClickFeedback(); onJoinSession(''); }}
                            className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                          >
                            Sair Permanentemente da Sala
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <form onSubmit={handleCreateSessionSubmit} className="p-4 rounded-xl bg-brand-text/5 border border-brand-border space-y-3">
                            <span className="text-[9px] font-mono font-black uppercase text-blue-400 block">Iniciar Nova Sala de Foco</span>
                            <div className="flex flex-col gap-2">
                              <input
                                type="text"
                                placeholder="..."
                                value={sessionTitle}
                                onChange={(e) => setSessionTitle(e.target.value)}
                                className="bg-brand-bg/80 border border-brand-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-brand-text"
                              />
                              <button
                                type="submit"
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-brand-text font-bold text-xs uppercase py-2.5 rounded-lg text-center cursor-pointer transition-all"
                              >
                                Criar Sala de Foco
                              </button>
                            </div>
                          </form>

                          <div className="space-y-2">
                            <span className="text-[9px] font-mono font-black uppercase text-brand-text/40 block">Salas de Foco Ativas</span>
                            {socialSessions.filter(s => s.isActive).length === 0 ? (
                              <div className="text-center py-6 text-xs text-brand-text/30 font-light italic">
                                Nenhuma sala ativa no momento. Crie sua própria sala!
                              </div>
                            ) : (
                              socialSessions.filter(s => s.isActive).map((room) => (
                                <div key={room.id} className="p-3.5 rounded-xl bg-brand-card/50 border border-brand-border flex items-center justify-between gap-3">
                                  <div className="min-w-0 flex-1">
                                    <span className="text-xs font-bold block text-brand-text truncate">{room.title}</span>
                                    <span className="text-[9px] block text-brand-text/40 font-mono mt-0.5">Criado por: {room.hostName}</span>
                                  </div>
                                  <button
                                    onClick={() => onJoinSession(room.id)}
                                    className="px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-brand-text text-[10px] font-black uppercase tracking-wider rounded-lg shrink-0 cursor-pointer transition-all"
                                  >
                                    Entrar
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'inventory' && (
                    <motion.div
                      key="inventory-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">INVENTÁRIO DO MASCOTE</h4>
                        <h5 className="text-base font-display font-black text-brand-text">Gerencie Itens Adquiridos</h5>
                      </div>

                      <div className="space-y-2 max-h-[380px] overflow-y-auto divide-y divide-brand-border/50 pr-1 text-xs">
                        {shopItems.filter(item => item.purchased || (item.quantity && item.quantity > 0)).length === 0 ? (
                          <div className="text-center py-10 text-xs text-brand-text/30 font-light">
                            Você não possui itens comprados. Visite o Mercado de Recompensas no Dashboard para adquirir!
                          </div>
                        ) : (
                          shopItems.filter(item => item.purchased || (item.quantity && item.quantity > 0)).map((item) => {
                            const isConsumable = item.type === 'food' || item.id === 'potion_revive' || item.type === 'mystery_box';
                            return (
                              <div key={item.id} className="pt-2 flex items-center justify-between gap-3 p-1.5 rounded bg-brand-text/5 hover:bg-brand-text/5 transition-all">
                                <div className="min-w-0 flex-1">
                                  <span className="font-bold text-brand-text text-xs block leading-tight">{item.name}</span>
                                  <span className="text-[9px] font-mono text-brand-text/40 uppercase mt-0.5 block leading-none">
                                    {isConsumable 
                                      ? `Quantidade: ${item.quantity || 0}` 
                                      : item.type === 'skin' 
                                      ? 'Traje' 
                                      : 'Sinal Alarme'
                                    }
                                  </span>
                                </div>

                                {isConsumable ? (
                                  <button
                                    onClick={() => onConsumeItem(item.id)}
                                    disabled={!item.quantity || item.quantity <= 0}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer select-none ${
                                      item.quantity && item.quantity > 0
                                        ? 'bg-blue-500 text-brand-text hover:bg-blue-600'
                                        : 'bg-brand-text/5 text-brand-text/20 cursor-not-allowed'
                                    }`}
                                  >
                                    {item.id === 'potion_revive' ? 'Reviver Foca' : 'Consumir'}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => onEquipItem(item.id)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer select-none transition-all ${
                                      item.equipped
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-indigo-600 text-brand-text hover:bg-indigo-500'
                                    }`}
                                  >
                                    {item.equipped ? 'Ativo' : 'Ativar'}
                                  </button>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'friends' && (
                    <motion.div
                      key="friends-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest font-black">AMIGOS E PARCEIROS</h4>
                        <h5 className="text-base font-display font-black text-brand-text">Gerenciar Amigos</h5>
                      </div>

                      <form onSubmit={handleAddFriendSubmit} className="p-4 rounded-xl bg-brand-text/5 border border-brand-border space-y-3">
                        <label className="text-[9px] font-mono uppercase font-black text-brand-text/50 block">Adicionar por E-mail ou Apelido</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="ex: amiguinho@email.com"
                            value={newFriendInput}
                            onChange={(e) => setNewFriendInput(e.target.value)}
                            className="bg-brand-bg/80 border border-brand-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 text-brand-text flex-1"
                          />
                          <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-brand-text font-bold text-xs uppercase px-3 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <UserPlus size={14} />
                            Adicionar
                          </button>
                        </div>
                        {friendFeedback && (
                          <p className="text-[10px] font-bold text-yellow-500">{friendFeedback}</p>
                        )}
                      </form>

                      {/* Seção de Solicitações Pendentes */}
                      {pendingRequests && pendingRequests.length > 0 && (
                        <div className="space-y-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                          <span className="text-[9px] font-mono uppercase font-black text-amber-500 block tracking-widest">
                            Solicitações de Amizade
                          </span>
                          <div className="space-y-2">
                            {pendingRequests.map((req) => (
                              <div key={req.friendshipId} className="flex items-center justify-between bg-brand-bg/40 p-2 rounded-lg border border-brand-border/30">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-brand-text">{req.username}</span>
                                  <span className="text-[8px] text-brand-text/40 font-mono">Quer focar com você</span>
                                </div>
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => { playClickFeedback(); onAcceptFriend(req.friendshipId); }}
                                    className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-md hover:bg-emerald-500/30 transition-colors"
                                    title="Aceitar"
                                  >
                                    <UserCheck size={14} />
                                  </button>
                                  <button
                                    onClick={() => { playClickFeedback(); onDenyFriend(req.friendshipId); }}
                                    className="p-1.5 bg-rose-500/20 text-rose-400 rounded-md hover:bg-rose-500/30 transition-colors"
                                    title="Recusar"
                                  >
                                    <UserX size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <span className="text-[9px] font-mono uppercase text-brand-text/40 block font-bold">Seus Conhecidos</span>
                        {friends.length === 0 ? (
                          <p className="text-[10px] text-brand-text/30 italic py-4 text-center">Nenhum amigo aceito ainda.</p>
                        ) : (
                          friends.map((friend) => (
                          <div key={friend.friendId} className="p-3 bg-brand-card border border-brand-border/50 rounded-xl flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold block text-brand-text">{friend.username}</span>
                              <span className="text-[9px] text-brand-text/40 font-mono">Fiel desde o início</span>
                            </div>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                              friend.status === 'offline' ? 'bg-brand-text/5 text-brand-text/30' : 'bg-blue-500/10 text-blue-400'
                            }`}>
                              {friend.status?.toUpperCase() || 'OFFLINE'}
                            </span>
                          </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'support' && (
                    <motion.div
                      key="support-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest font-black">CONTATO & SUPORTE</h4>
                        <h5 className="text-base font-display font-black text-brand-text">Projeto Foca Aqui</h5>
                      </div>

                      <div className="p-4 rounded-xl border border-blue-500/10 bg-blue-500/5 text-xs space-y-2">
                        <span className="font-mono font-black text-[10px] text-blue-400 uppercase block">Trabalho de Conclusão de Curso (TCC)</span>
                        <div className="grid grid-cols-1 gap-1 leading-normal text-brand-text/80">
                          <p><b>Autor Executivo:</b> Eduardo Ian</p>
                          <p><b>E-mail Oficial:</b> <a href="mailto:Eduianbf@gmail.com" className="text-blue-400 hover:underline">Eduianbf@gmail.com</a></p>
                        </div>
                        <p className="text-brand-text/50 text-[11px] leading-relaxed italic pt-1 border-t border-brand-border">"O Foca Aqui é um projeto experimental projetado como parte da graduação em Analise e Desenvolvimento de sistemas, buscando investigar e neutralizar o vício em dopamina nas redes sociais através de metodologias gamificadas ativas."</p>
                      </div>

                      <form onSubmit={handleSendSupport} className="p-4 rounded-xl bg-brand-text/5 border border-brand-border space-y-3.5">
                        <span className="text-[9px] font-mono uppercase font-black text-brand-text/45 block">Enviar Mensagem ao Suporte</span>
                        {supportSent ? (
                          <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold text-center select-none">
                            Mensagem para Eduardo Ian enviada com sucesso! Obrigado pelo feedback.
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <textarea
                              placeholder="Fale algo legal sobre o app ou reporte uma sugestão..."
                              value={supportMessage}
                              onChange={(e) => setSupportMessage(e.target.value)}
                              rows={3}
                              className="bg-brand-bg/80 border border-brand-border rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500 text-brand-text resize-none"
                              required
                            />
                            <button
                              type="submit"
                              className="bg-blue-500 hover:bg-blue-600 text-brand-text font-bold text-xs uppercase py-2 rounded-lg text-center flex items-center justify-center gap-2 cursor-pointer transition-colors"
                            >
                              <Send size={12} />
                              Enviar Mensagem
                            </button>
                          </div>
                        )}
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="p-4 bg-brand-bg/50 border-t border-brand-border/50 text-center text-[10px] font-mono text-brand-text/30 select-none">
              FOCA AQUI 2026 // Eduianbf@gmail.com
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}