/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Award, Users, ShoppingBag, Mail, UserPlus, 
  Check, RefreshCw, Send, Plus, Flame, PlusCircle, ShieldAlert 
} from 'lucide-react';
import { PetState, ShopItem, UserStats, Friend, SocialSession } from '../types';
import { playClickFeedback } from '../utils/audio';
import AnalyticsReports from './AnalyticsReports';

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  username: string;
  onUpdateUsername: (newName: string) => void;
  pet: PetState;
  stats: UserStats;
  shopItems: ShopItem[];
  onEquipItem: (id: string) => void;
  onConsumeItem: (id: string) => void;
  friends: Friend[];
  onAddFriend: (emailOrNick: string) => boolean;
  socialSessions: SocialSession[];
  onCreateSession: (title: string) => void;
  onJoinSession: (sessionId: string) => void;
  activeSessionId: string | null;
  theme?: 'light' | 'dark';
}

type TabType = 'profile' | 'rank' | 'social' | 'inventory' | 'support' | 'friends';

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
  socialSessions,
  onCreateSession,
  onJoinSession,
  activeSessionId,
  theme = 'dark'
}: NavigationSidebarProps) {
  const [activeTab, setActiveTabState] = useState<TabType>('profile');

  // Análise profunda/superficial nas propriedades HASH ativas de "Telas/Links" da aplicação e do Menu.
  React.useEffect(() => {
    const syncTabFromHash = () => {
      const hash = window.location.hash;
      if (hash === '#/perfil') setActiveTabState('profile');
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

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    // Harmonizando as informações visuais sincronizadas entre Hash-Links de barra ou "Ancoras"!
    const hash = tab === 'profile' ? '#/perfil' :
                 tab === 'rank' ? '#/rank' :
                 tab === 'social' ? '#/social' :
                 tab === 'inventory' ? '#/inventario' :
                 tab === 'friends' ? '#/amigos' : '#/suporte';
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  };
  
  // Entidades gerenciadoras das modulações ou "Estados/Estágios" operacionais (Estados locais form/input).
  const [newNameInput, setNewNameInput] = useState(username);
  const [newFriendInput, setNewFriendInput] = useState('');
  const [friendFeedback, setFriendFeedback] = useState<string | null>(null);
  
  const [sessionTitle, setSessionTitle] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSent, setSupportSent] = useState(false);

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    playClickFeedback();
    if (!newNameInput.trim()) return;
    onUpdateUsername(newNameInput.trim().substring(0, 20));
  };

  const handleAddFriendSubmit = (e: React.FormEvent) => {
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

  const handleCreateSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickFeedback();
    if (!sessionTitle.trim()) return;
    onCreateSession(sessionTitle.trim());
    setSessionTitle('');
  };

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    playClickFeedback();
    if (!supportMessage.trim()) return;
    setSupportSent(true);
    setSupportMessage('');
    setTimeout(() => setSupportSent(false), 4000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-50 flex justify-start font-sans text-brand-text ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}>
          {/* Componente em Tela-Fundos Esticados ou "Mantas Escurecidas / Cortinas (Backdrops)": p/ Destacar frontais(Modal). */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020309]/80 backdrop-blur-md"
          />

          {/* Engavetamentos  (Barras ou Menú Latérais de arrastos Drawers). Construção do Corpos Conteiners  Fixados   "Alíneamentos Esquerdos." (Painel de menu)*/}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full sm:w-[400px] lg:w-[40vw] max-w-[100vw] h-full bg-brand-card border-r border-brand-border shadow-2xl flex flex-col z-10"
          >
            {/* Arte Visual de Branding / Marcas Registradas & Identificacao  (Nos Cabeçalhos Dos Paineis / Menus laterais).  */}
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

            {/* Layouts Resumidos  das Telas Menus:  Porcao Lateral Esquerda (Botoes de trilhas | Vs Direito  Visualizações Conteúdo do modulo (Vistas) */}
            <div className="flex-1 flex overflow-hidden">
              {/* Gatilhos Ou Alavancas interativas Acionáveis / (Ativadores). Contidas No Flanco Esquerdas Dos Menus !.  */}
              <div className="w-[110px] border-r border-brand-border/50 bg-brand-bg/60 flex flex-col items-center py-4 gap-2.5 shrink-0 select-none">
                {[
                  { id: 'profile', label: 'Perfil', icon: User },
                  { id: 'inventory', label: 'Inventário', icon: ShoppingBag },
                  { id: 'friends', label: 'Amigos', icon: UserPlus },
                  { id: 'social', label: 'Sessão Conj.', icon: Users },
                  { id: 'support', label: 'Suporte', icon: Mail },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { playClickFeedback(); setActiveTab(item.id as TabType); }}
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

              {/* Lado ou Painel Direito (Detalhemento Primário Das Atividades ou Dados Das Seções Acessadas Na Guia). */}
              <div className="flex-1 p-5 overflow-y-auto bg-brand-card/40">
                <AnimatePresence mode="wait">
                  
                  {/* Painel Guia/Rotulação Nr. 1: (VISÃO OU DISPLAY DE INFORMAÇÕES PESSOAIS) - ÁREA O PERFIL USUÁRIO! */}
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

                      {/* Subconjuntos / Formulários Responsáveis e Editores Dos Campos  Denominados : "Nome de Usuáruios" (Mudança De Alcumha)! */}
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

                      {/* Quadros e Cartões de Valores, Representações Métricas : Estatísticos ou Variáveis  Sintéticas  Relativas. À  Conta Global! */}
                      <div className="flex flex-col gap-3">
                        <div className="p-3.5 rounded-xl bg-brand-text/5 border border-brand-border text-center">
                          <span className="text-[9px] font-mono uppercase text-brand-text/40 block">Nível do Mascote</span>
                          <span className="text-sm font-black text-yellow-500 font-mono">Level {pet.level}</span>
                        </div>
                      </div>

                      {/* Grafico das Pessoas   Estáticas Pessionais e Pessoal, Gráfico Movidos e Explicitadamente Renderizados  Neste Quadro/Área da aplicação. */}
                      <div className="w-full mt-4">
                        <AnalyticsReports stats={stats} />
                      </div>

                      {/* Caixas e Sessões Explicativas e Texto: Sobre as Naturesas e Características ou Nomes (Amiguinhos Mascotes / Pets Descrições) */}
                      <div className="p-4 rounded-xl border border-blue-500/10 bg-blue-500/5 text-xs text-brand-text/70 flex flex-col gap-1.5">
                        <span className="font-extrabold text-blue-400 uppercase text-[10px]">Evolução e Parcerias</span>
                        <p>Nivele seu mascote completando focos. A cada subida de nível, recompensas e moedas extras são concedidas no seu Dashboard.</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Painel Guia/Rotulação Nr. 2:  Visualização Expositiva De Rankings, Conquistas de Quadros E Classificações E OS GRAFICOS !.  */}
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

                      {/* Componente Gráfico Das Placas e Posicionamentos - Painéis Competitivo Das Posiões ("Leaderboards").  */}
                      <div className="space-y-2">
                        {/* Informacao Fictícia representativa P/ -> (VOCÊ | Jogador Atual Em foco). */}
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

                        {/* Composições e Classificação : Posicionamentos Globais (Itens ou Modelos Dos Outros Amiguinhos Ranqueados). */}
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

                      {/* Visualização : Customizada / Desenhada E Processos Das  Progressões Gráficas!  (Barra de Evoluções Dos Progressos Rank/Pontos) */}
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

                  {/* Painel Guia/Rotulação Nr. 3:  Acesso as Seções De União - SESSÕES DE TRABALHOS (FOCO E POMODORO) COMPARTILHADAS E CONJUNTAS. */}
                  {activeTab === 'social' && (
                    <motion.div
                      key="social-tab"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">SESSÕES DE GRUPO</h4>
                        <h5 className="text-base font-display font-black text-brand-text">Foque Junto com Amigos</h5>
                      </div>

                      {activeSessionId ? (
                        /* CURRENTLY IN AN ACTIVE SESSÃO DE CONJUNTO */
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/25 space-y-2">
                            <span className="text-[9px] font-mono uppercase bg-red-500 text-brand-text px-2 py-0.5 rounded font-black tracking-wider">AO VIVO</span>
                            <h6 className="text-sm font-black text-brand-text">Sala: {socialSessions.find(s => s.id === activeSessionId)?.title}</h6>
                            <p className="text-[11px] text-brand-text/60 leading-relaxed">Você está conectado na sala! Estude simultaneamente em silêncio. Um ping soa quando o ciclo termina.</p>
                          </div>

                          {/* Conversação  Livre & Listas dos Usuarios Contidos E Relacionamento com Status da Atual Sessão Em atividade (O Cão, Status dos Colaboradores!). */}
                          <div className="p-3.5 rounded-xl border border-brand-border bg-brand-bg/50 space-y-2">
                            <span className="text-[9px] font-mono text-brand-text/40 uppercase font-black block">PARTICIPANTES ONLINE</span>
                            <div className="space-y-2 max-h-[140px] overflow-y-auto">
                              <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-brand-text font-bold">{username} (Você)</span>
                                <span className="text-blue-400 font-extrabold animate-pulse">● FOCANDO</span>
                              </div>
                              <div className="flex items-center justify-between text-xs font-mono opacity-80">
                                <span>LucasGamer</span>
                                <span className="text-amber-500">● PAUSADO</span>
                              </div>
                              <div className="flex items-center justify-between text-xs font-mono opacity-80">
                                <span>Mariana_Estudos</span>
                                <span className="text-blue-400 font-extrabold animate-pulse">● FOCANDO</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => { playClickFeedback(); onJoinSession(''); }}
                            className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                          >
                            Abandonar Sessão Conjunta
                          </button>
                        </div>
                      ) : (
                        /* CREATE OR JOIN ROOM */
                        <div className="space-y-4">
                          <form onSubmit={handleCreateSessionSubmit} className="p-4 rounded-xl bg-brand-text/5 border border-brand-border space-y-3">
                            <span className="text-[9px] font-mono font-black uppercase text-blue-400 block">Iniciar Nova Sala Co-working</span>
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
                                Criar Sala Conjunta
                              </button>
                            </div>
                          </form>

                          <div className="space-y-2">
                            <span className="text-[9px] font-mono font-black uppercase text-brand-text/40 block">Salas de Estudo Ativas</span>
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

                  {/* Painel Guia/Rotulação Nr. 4: Sessão Especial para Armazéns E Exibição O  INVENTARIO/MOCHILA DA MASCOTE (Roupa etc!) */}
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

                      {/* Laço Ciclícos, Condições Ou Renderizadores Sequnciais Repetítivos Iterativos "Loops de Mostruarios" Sobre Lista/Array dos Itens (Exibição!) */}
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

                  {/* Painel Guia/Rotulação Nr. 5:  Comandos De Add (Adiciona) Ou Views(Visualizaçõe! LISTAS / Relatório CONTATOS OU DE AMIGOS. (Pessoas) */}
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

                      {/* Acionadores/Botoē e Módulos Formuláveis / Campos (Criadores). p/ Requisições Referentes e Pedidos e "Convites DE AMIGOS" */}
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

                      {/* Grade Repetitiva E Detalhamentos, Mostrando os Parametros Atuais (E statisticas Físicas) / Estatísticas Relacionais Sobre Colegas Nas Listagens.  */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono uppercase text-brand-text/40 block font-bold">Seus Conhecidos</span>
                        {friends.map((friend) => (
                          <div key={friend.uid} className="p-3 bg-brand-card border border-brand-border/50 rounded-xl flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold block text-brand-text">{friend.username}</span>
                              <span className="text-[9px] text-brand-text/40 font-mono">Fiel desde o início</span>
                            </div>

                            <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md">
                              ONLINE
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Painel Guia/Rotulação Nr. 6: Setores Administrativos Informáticos/ Instituicionais Da Faculdade Ou Documentacao (Detalhes Referenciais do Acadêmico TCC e Contatos) */}
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

                      {/* Esboço Projetado:  Desenho com Especificações / Curriculo Dos Envolvidos, dos Alunos Produtores e Idealizadores do projeto.  (Area  P/ Os Autores ). */}
                      <div className="p-4 rounded-xl border border-blue-500/10 bg-blue-500/5 text-xs space-y-2">
                        <span className="font-mono font-black text-[10px] text-blue-400 uppercase block">Trabalho de Conclusão de Curso (TCC)</span>
                        <div className="grid grid-cols-1 gap-1 leading-normal text-brand-text/80">
                          <p><b>Autor Executivo:</b> Eduardo Ian</p>
                          <p><b>E-mail Oficial:</b> <a href="mailto:Eduianbf@gmail.com" className="text-blue-400 hover:underline">Eduianbf@gmail.com</a></p>
                        </div>
                        <p className="text-brand-text/50 text-[11px] leading-relaxed italic pt-1 border-t border-brand-border">"O Foca Aqui é um projeto experimental projetado como parte da graduação em Analise e Desenvolvimento de sistemas, buscando investigar e neutralizar o vício em dopamina nas redes sociais através de metodologias gamificadas ativas."</p>
                      </div>

                      {/* Telas Simuladores e Ilustrativas Da Area Visual do Mensageiro / Sistema de Mockup Ficticios Envio Fale-Conosco / (Tickets/Support)! */}
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

            {/* Banners ou Rodapés Informático  (Legais Ou Direitos) , Placas Do Rodapé Dos Paineles. Referente à Marcas, Registro e  Etiqueta/Sselos De  Origens! */}
            <div className="p-4 bg-brand-bg/50 border-t border-brand-border/50 text-center text-[10px] font-mono text-brand-text/30 select-none">
              FOCA AQUI © 2026 // TCC EDUARDO IAN // Eduianbf@gmail.com
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
