/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Timer, 
  CheckSquare, 
  Heart, 
  Coins, 
  Flame, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Rocket, 
  Volume2, 
  Palette,
  Github
} from 'lucide-react';
import { playClickFeedback } from '../utils/audio';

interface HeroPageProps {
  onEnterApp: () => void;
}

export default function HeroPage({ onEnterApp }: HeroPageProps) {
  const handleStart = () => {
    playClickFeedback();
    onEnterApp();
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    playClickFeedback();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Propriedades para configurar Variancias / Animação / Scroll-Events comuns e compartilhadas!
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // Custom sophisticated cubic bezier
        delay: custom * 0.1,
      }
    })
  };

  return (
    <div className="min-h-screen bg-[#00022f] text-[#F8F6F0] font-sans overflow-x-hidden selection:bg-[#F8F6F0] selection:text-[#00022f] relative">
      {/* Textura detalhada, Padrões customizados com pontinhos de Fundo (Backgrund Dot) para melhorar a Estética e textura limpa */}
      <div className="absolute inset-0 opacity-[0.25] pointer-events-none z-0 bg-hero-dots" />

      {/* Luzes e Espectros lumino-ambientais. Utilizados exclusivamentes como decorações do planos de base. */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-indigo-700/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Cabeçalho Principal do Componente/Area */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#00022f]/70 border-b border-[#F8F6F0]/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={handleStart}
          >
            <img src="/logo.png" alt="Foca Aqui Logo" className="h-8 w-auto object-contain" />
            <span className="font-display text-lg font-bold tracking-tight uppercase select-none">
              Foca Aqui
            </span>
          </motion.div>

          <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-[#F8F6F0]/60">
            <a href="#sobre" onClick={(e) => handleSmoothScroll(e, 'sobre')} className="hover:text-[#F8F6F0] transition-colors">Sobre</a>
            <a href="#como-funciona" onClick={(e) => handleSmoothScroll(e, 'como-funciona')} className="hover:text-[#F8F6F0] transition-colors">Pomodoro</a>
            <a href="#todo-list" onClick={(e) => handleSmoothScroll(e, 'todo-list')} className="hover:text-[#F8F6F0] transition-colors">Tarefas</a>
            <a href="#pet-virtual" onClick={(e) => handleSmoothScroll(e, 'pet-virtual')} className="hover:text-[#F8F6F0] transition-colors">Mascote</a>
            <a href="#mercado" onClick={(e) => handleSmoothScroll(e, 'mercado')} className="hover:text-[#F8F6F0] transition-colors">Mercado</a>
          </nav>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="px-5 py-2 border border-[#F8F6F0] rounded-full text-xs font-semibold uppercase tracking-widest text-[#F8F6F0] hover:bg-[#F8F6F0] hover:text-[#00022f] transition-all cursor-pointer"
          >
            Entrar no App
          </motion.button>
        </div>
      </header>

      {/* Area Principal Hero, Ponto focal primário ou Top Section da Apresentação. (Banner ou Área Mestra). */}
      <section className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center min-h-[90vh]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={0}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F8F6F0]/15 bg-[#F8F6F0]/5 mb-6"
        >
          <Sparkles size={14} className="text-yellow-200 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-yellow-100">
            Produtividade Saudável & Gamificada
          </span>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={1}
          className="font-display text-7xl md:text-[110px] lg:text-[140px] leading-[0.8] font-black tracking-tighter uppercase mb-6"
        >
          FOCA<br />
          <span className="text-[#F8F6F0]">AQUI</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={2}
          className="text-lg md:text-xl text-[#F8F6F0]/80 max-w-2xl font-light leading-relaxed mb-12"
        >
          Transforme seu foco em combustível para o seu pet virtual. O primeiro ecossistema de produtividade onde cada minuto conta para a sua jornada. Organize suas tarefas, viva momentos de atenção plena e ganhe relatórios consistentes.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={3}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, shadow: "0 0 30px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_30px_rgba(30,58,138,0.3)] hover:shadow-[0_4px_40px_rgba(99,102,241,0.4)] transition-all cursor-pointer"
          >
            Iniciar Sessão de Foco
            <ArrowRight size={18} />
          </motion.button>
          
          <button
            onClick={() => {
              playClickFeedback();
              const el = document.getElementById('sobre');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 border border-[#F8F6F0]/20 hover:border-[#F8F6F0]/40 hover:bg-[#F8F6F0]/5 text-sm font-semibold rounded-xl tracking-wide transition-all cursor-pointer"
          >
            Saiba Mais
          </button>
        </motion.div>

        {/* Telas Gráficas / Caixas Canvas ilustradas interagíveis virtuais ou dinâmicas, Retratadas pelo componente Bonitinho e Flutuantes - Mascote (Foca) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 w-48 h-48 relative cursor-pointer"
          onClick={handleStart}
          whileHover={{ rotate: 5 }}
        >
          {/* Halo Animado -  O anéis visuais das dinâmicas com energias e raios no entorno. (Aréolas)  */}
          <div className="absolute inset-0 rounded-full bg-blue-500/20 border border-blue-500/40 animate-pulse scale-110" />
          
          {/* Desenhos/Rabiscos ou Arquivos e Código nativos/vetoriais -> Formação / Pintagem  / Retrataçao da Foca(Mascote SVG) */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_30px_rgba(59,130,246,0.3)]">
            {/* Arestas, Vetores do Esqueleto e do Corpo anatômico do nosso Bicho Foca */}
            <ellipse cx="50" cy="55" rx="35" ry="25" fill="#f1f5f9" />
            
            {/*  Fios do Bigodes e Vibrissas (Sincronizados Vectorialmente / Vetores Animados! Cabelinhos do rosto ) */}
            <line x1="22" y1="58" x2="10" y2="56" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="22" y1="62" x2="11" y2="64" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="78" y1="58" x2="90" y2="56" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="78" y1="62" x2="89" y2="64" stroke="#94a3b8" strokeWidth="1.5" />

            {/* Vetores formadores da Aresta Corporal / Nadadeiras e Braços Da Mascota / (Dorso e Nados) */}
            <path d="M12 60 Q 2 65 15 72" fill="#e2e8f0" />
            <path d="M88 60 Q 98 65 85 72" fill="#e2e8f0" />
            {/* Faixas Esteticas/Colareza de Medalha  e  Acessóssios tipo "Gold/Ourado". Indicando, exaltando Status do Esforço e Condecoração de Produtividade do usuário (Altos-Foco) */}
            <path d="M35 63 Q 50 71 65 63" fill="none" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />

            {/* Faces, Feições / Rosto Principal Vetorial da Foquinha. */}
            {/* Vetoriação / Bochechas Animadas "Bulshed" e com Enrubescimento / Bochechudas(Fofas) p/ Pets  */}
            <circle cx="33" cy="58" r="4.5" fill="#fda4af" />
            <circle cx="67" cy="58" r="4.5" fill="#fda4af" />
            
            {/* Olhos de Brilho Dinâmicos com Reflexos  (Implementação Animada do Piscado ou Piscares via React Motion no SVG nativo) */}
            <circle cx="40" cy="52" r="3.5" fill="#0f172a" />
            <circle cx="39.2" cy="50.5" r="1.2" fill="#ffffff" />
            <circle cx="60" cy="52" r="3.5" fill="#0f172a" />
            <circle cx="59.2" cy="50.5" r="1.2" fill="#ffffff" />

            {/* Configurasção / Vetores  das Porções Nariz E contornos/arcos das Bocas E Linhas do sorriso da Foca. */}
            <ellipse cx="50" cy="56" rx="4.5" ry="3.2" fill="#1e293b" />
            <path d="M47 59 C 48 61 50 61 50 59 C 50 61 52 61 53 59" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          </svg>
          
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-400 text-slate-900 border-2 border-[#00022f] text-[10px] font-extrabold uppercase rounded-full shadow-lg">
            Oi, eu sou a Foca!
          </div>
        </motion.div>
      </section>

      {/* Seção Destaques(Features / Detalhes): "Referentes ou Descrições Informativas sobre" a plataforma ou História etc. */}
      <section id="sobre" className="py-24 px-6 border-t border-[#F8F6F0]/10 max-w-7xl mx-auto scroll-mt-24">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-16 items-start animate-fade-in">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-12 lg:col-span-5 flex flex-col gap-6"
          >
            <div className="text-[10px] font-mono tracking-widest text-[#F8F6F0]/50 uppercase font-bold">
              CONCEPÇÃO & PROPÓSITO
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase text-white">
              Sua atenção de volta:<br />
              A revolução contra o ruído digital
            </h2>

            <div className="p-6 rounded-2xl bg-[#0c0f47] border border-[#F8F6F0]/15 relative overflow-hidden mt-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.05] rounded-full blur-2xl pointer-events-none" />
              <div className="text-[9px] font-mono tracking-wider text-blue-400 uppercase font-black mb-2">
                PROJETO ACADÊMICO
              </div>
              <p className="text-xs text-[#F8F6F0]/70 leading-relaxed font-mono">
                Trabalho de Conclusão de Curso (TCC)<br />
                Análise e Desenvolvimento de Sistemas<br />
                UniCesumar • 2026
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-12 lg:col-span-7 flex flex-col gap-6 text-[#F8F6F0]/85 text-sm md:text-base leading-relaxed font-light mt-1.5"
          >
            <p>
              Hoje, vivemos sob o domínio de um superestímulo constante e viciante. As redes sociais e os ecossistemas digitais foram projetados cirurgicamente para sequestrar nossa atenção, transformando a concentração profunda em um recurso escasso. Para as novas gerações, a procrastinação crônica tornou-se um reflexo involuntário de mentes sobrecarregadas pelo bombardeio constante de notificações e conteúdos altamente estimulantes.
            </p>
            
            <p>
              O <strong className="text-white font-semibold">Foca Aqui</strong> nasceu justamente no epicentro desse caos tecnológico. Não como mais um aplicativo rígido de produtividade, mas como uma ferramenta empática, acessível e prática criada para ajudar você a reconquistar o controle do seu tempo. Ao aliar o tradicional método Pomodoro a um ecossistema gamificado e interativo de companheirismo, a plataforma reescreve a sua relação com o trabalho diariamente.
            </p>

            <span className="border-l-2 border-indigo-400 pl-4 py-1 text-[#F8F6F0]/90 italic font-mono text-xs md:text-sm">
              "A tecnologia sequestrou nossa atenção; cabe a nós construir pontes inteligentes para recuperá-la."
            </span>

            <p>
              Idealizado e desenvolvido com orgulho por <strong className="text-white font-semibold">Eduardo Ian</strong> e <strong className="text-white font-semibold">Lucas Venancio</strong> como parte do seu Trabalho de Conclusão de Curso (TCC) em Análise e Desenvolvimento de Sistemas (ADS) pela <strong className="text-white font-semibold">UniCesumar</strong>, o Foca Aqui representa a sinergia perfeita entre desenvolvimento estratégico e psicologia do foco. Mais do que atender às exigências acadêmicas, este projeto foi concebido com o propósito sincero de construir uma solução real e humanizada.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Seçção Destaques: Ref. número 1: (Arquitetura e  lógica descritiva ou Funcionalidades) "Do Metodos de Estudo/Foco Pomodoro" . */}
      <section id="como-funciona" className="py-24 px-6 border-t border-[#F8F6F0]/10 max-w-7xl mx-auto scroll-mt-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col gap-6"
          >
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl flex items-center justify-center">
              <Timer size={24} />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              O Intervalo Ideal.<br />
              Diga Olá ao Pomodoro.
            </h2>
            <p className="text-[#F8F6F0]/75 leading-relaxed text-base font-light">
              Divida seu dia em intervalos focados de <strong className="text-white font-medium">25 minutos</strong> separados por breves pausas de <strong className="text-white font-medium">5 minutos</strong> (e pausas mais longas de 15 minutos a cada 4 ciclos completos). Essa metodologia clássica previne burnout, restaura a atenção consciente e te faz terminar tarefas em tempo recorde!
            </p>
            <div className="flex flex-col gap-4 bg-[#F8F6F0]/5 border border-[#F8F6F0]/10 p-6 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Passo 1: Sessão de Foco (25 mins)</h4>
                  <p className="text-xs text-[#F8F6F0]/60">Sem distrações, celular longe, foco puro em uma única meta.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Passo 2: Pausa Curta (5 mins)</h4>
                  <p className="text-xs text-[#F8F6F0]/60">Alongue-se, beba água ou faça carinho na sua foca virtual!</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#0c0f47] border border-[#F8F6F0]/15 rounded-3xl p-8 relative overflow-hidden shadow-2xl group"
          >
            {/* Simuladores ilustrativos virtuais de paineis visuais limpos  e Premium estilo Bento-Box / Grade Grid Bento! */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-700" />
            <div className="flex justify-between items-center mb-10">
              <span className="text-xs font-mono tracking-widest text-indigo-300 uppercase">Interactive Widget Previa</span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
            </div>

            <div className="text-center py-8">
              <div className="text-xs font-semibold mb-3 tracking-widest text-[#F8F6F0]/40 uppercase">EM PROGRESSO</div>
              <div className="font-mono text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 animate-pulse">
                24:59
              </div>
              <div className="flex justify-center gap-2 mb-8">
                <span className="px-3 py-1 text-[10px] bg-indigo-500/20 border border-indigo-400/30 rounded-lg text-indigo-300 font-medium">Ciclo 1/4</span>
                <span className="px-3 py-1 text-[10px] bg-green-500/20 border border-green-400/30 rounded-lg text-green-300 font-medium">Foco Ativo</span>
              </div>
              
              {/* Barra Progressiva Visuais - Falsa / "Mockup" (Ilustrando a interações do progressos fictício e dos tempos nas demonstrações) */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[99%] h-full bg-gradient-to-r from-blue-400 to-indigo-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seçção Destaques: Ref. N.2: "Tarefas(Todo) / Relacionado as Integrações  Lista-S Listadas de Funções E Afazeres!" */}
      <section id="todo-list" className="py-24 px-6 border-t border-[#F8F6F0]/10 max-w-7xl mx-auto scroll-mt-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1 bg-[#0c0f47] border border-[#F8F6F0]/15 rounded-3xl p-8 relative overflow-hidden shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-lg">Tarefas de Hoje</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 border border-emerald-500/30 rounded-full font-mono uppercase">2 Concluídas</span>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { title: 'Estudar conceitos de UX/UI para Bento Grid', poms: '1/2', done: false },
                { title: 'Desenvolver componente de To-Do List', poms: '0/3', done: false, active: true },
                { title: 'Fazer o setup inicial de cores e temas', poms: '1/1', done: true },
              ].map((task, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border flex justify-between items-center transition-all ${
                    task.active 
                    ? 'bg-[#181d5f] border-blue-400/50 shadow-md' 
                    : task.done 
                    ? 'opacity-40 bg-slate-900/40 border-slate-800/40 line-through' 
                    : 'bg-[#0f124c] border-[#F8F6F0]/10 hover:border-[#F8F6F0]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      task.done ? 'bg-indigo-500 border-indigo-500 text-slate-900' : 'border-[#F8F6F0]/30'
                    }`}>
                      {task.done && <span className="text-[10px]">✓</span>}
                    </div>
                    <span className="text-xs font-medium max-w-[200px] truncate">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-[#F8F6F0]/10 px-2 py-0.5 rounded-md font-mono text-[#F8F6F0]/70">
                      {task.poms} Ciclos
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-800/50 flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Página 1 de 2</span>
              <span>Filtrado por: Pendentes</span>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="order-1 md:order-2 flex flex-col gap-6"
          >
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center">
              <CheckSquare size={24} />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              To-Do List Estruturado.<br />
              Mapeie em Estimativas.
            </h2>
            <p className="text-[#F8F6F0]/75 leading-relaxed text-base font-light">
              Nunca mais se perca em tarefas colossais. Crie atividades no To-Do, adicione descrições minuciosas expandindo-as livremente e defina uma estimativa realista de quantos ciclos Pomodoro você precisará. Assim, você ganha clareza de escopo e acompanha seu progresso em tempo real.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Seçção Destaques: Ref. N.3: Area que explica "O Funcionamento / Detalhamento  do Amiguinho O Pet & As Suas Energias" (Seção Mascote) */}
      <section id="pet-virtual" className="py-24 px-6 border-t border-[#F8F6F0]/10 max-w-7xl mx-auto scroll-mt-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col gap-6"
          >
            <div className="w-12 h-12 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl flex items-center justify-center">
              <Heart size={24} />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Foque com Companhia.<br />
              Cuide da sua Foca Virtual.
            </h2>
            <p className="text-[#F8F6F0]/75 leading-relaxed text-base font-light">
              Seu comprometimento com o foco tem impacto direto no bem-estar da sua <strong className="text-white font-medium">Foca de Estimação</strong>. Você possui uma barra diária de <strong className="text-indigo-300">Energia</strong> que é consumida à medida que adiciona ou procrastina tarefas; focar restaura sua energia, concede XP para subir de nível e deixa seu pet no estado mais feliz possível!
            </p>
            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <div className="p-2.5 bg-yellow-400/20 rounded-xl flex items-center justify-center shrink-0 self-start text-yellow-400">
                ⚡
              </div>
              <p className="text-[#F8F6F0]/70 leading-relaxed">
                <strong className="text-white">Alerta de Procrastinação:</strong> Passar muito tempo sem iniciar um timer de foco deixará a Foca com sono. Acione o Pomodoro para acordá-la com fôlego total!
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#0c0f47] border border-[#F8F6F0]/15 rounded-3xl p-8 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center py-12"
          >
            <div className="absolute top-4 left-4 bg-orange-400/20 border border-orange-400/40 px-3 py-1 rounded-full text-orange-300 text-[10px] font-bold font-mono">
              LEVEL 4
            </div>

            {/* Modulo Didático / Módulagem que Simulam  o comportamento reais  das mascotes na plataformas & das telas */}
            <div className="w-40 h-40 relative mb-6">
              {/* Exposição Gráfica : A Foca ou Avatares / Modelos dinâmicos exibidos e renderizados (Com ou sem Vestimenta E/  Skins Adicionando Em Aplicações) */}
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_20px_rgba(59,130,246,0.2)]">
                {/* Modelagem de Preview / Câmaradagem ou Overlay "Ninja" (Preview simulando os Produtos visíveis/disponiveis e vestuários nos mostruários e Mercados.) */}
                <ellipse cx="50" cy="55" rx="35" ry="25" fill="#f1f5f9" />
                
                {/* Desenhos/Peças -> Márcaras do Vestuário ou  Skin Ninja (Rosto Coberto) . */}
                <rect x="25" y="42" width="50" height="20" rx="6" fill="#0f172a" />
                {/* Rasgos Geométricos / Peças / Cortes, projetados especificamente nas Vestimentas   Visando à Exposicões ou Aberturas exclusívos P/ Os Olhos (Oculares Face). */}
                <rect x="35" y="47" width="30" height="10" rx="3" fill="#f1f5f9" />
                
                {/* Ilustrando E Exibindo diretamente as partes/elementos  "Olho Vivo", trespassando (Vazado),  frente aos buracos contidos Máscaras / Skin.  */}
                <circle cx="42" cy="52" r="2.5" fill="#0f172a" />
                <circle cx="58" cy="52" r="2.5" fill="#0f172a" />

                {/* Ilustrando E Exibindo Bigodes saltantes (Exteriorizados) além as bases vetoriaís "Mascaradas". Rompendo/Sobrepondo as peças de roupa!  */}
                <line x1="22" y1="58" x2="10" y2="56" stroke="#94a3b8" strokeWidth="1" />
                <line x1="78" y1="58" x2="90" y2="56" stroke="#94a3b8" strokeWidth="1" />
              </svg>
            </div>

            <h3 className="font-display font-bold text-xl mb-1 flex items-center gap-1.5 justify-center">
              Foca das Sombras
            </h3>
            <p className="text-xs text-[#F8F6F0]/50 mb-6 uppercase tracking-wider">Status: Ninja Silencioso</p>

            <div className="w-full max-w-xs space-y-3">
              <div className="flex justify-between text-[10px] font-mono">
                <span>Energia da Foca</span>
                <span className="text-yellow-300 font-bold">85% / 100%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-[1px] border border-[#F8F6F0]/10">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seçção Destaques: Ref. N.4: Apresentações e Informação  das moedas ou Mecanismo Dinheiro/Eco : "Das Lojas e Mercadorias (Produtos)". */}
      <section id="mercado" className="py-24 px-6 border-t border-[#F8F6F0]/10 max-w-7xl mx-auto scroll-mt-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1 bg-[#0c0f47] border border-[#F8F6F0]/15 rounded-3xl p-8 relative overflow-hidden shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8 border-b border-[#F8F6F0]/10 pb-4">
              <div className="flex items-center gap-2">
                <Coins size={18} className="text-yellow-400" />
                <span className="font-display font-extrabold text-white text-lg">60 Moedas</span>
              </div>
              <span className="text-[10px] font-mono bg-blue-500/10 text-blue-300 px-2.5 py-1 rounded-md border border-blue-500/20">MERCADINHO</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Foca Ninja', price: 80, icon: Shield, extra: 'Traje' },
                { name: 'Poção de Vida', price: 40, icon: Sparkles, extra: 'Consumível' },
              ].map((shopItem, idx) => (
                <div key={idx} className="p-4 bg-slate-950/40 border border-[#F8F6F0]/10 rounded-2xl text-left flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-300 rounded-lg">
                      <shopItem.icon size={16} />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">{shopItem.extra}</span>
                  </div>
                  <h4 className="text-xs font-semibold mb-1">{shopItem.name}</h4>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs font-mono font-bold text-yellow-300">{shopItem.price} Moedas</span>
                    <button className="text-[9px] px-2.5 py-1 bg-[#F8F6F0]/10 text-[#F8F6F0] hover:bg-[#F8F6F0]/20 rounded-md font-bold uppercase transition-all">Comprar</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="order-1 md:order-2 flex flex-col gap-6"
          >
            <div className="w-12 h-12 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl flex items-center justify-center">
              <Coins size={24} />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Economia de Foco.<br />
              Compre Customizações.
            </h2>
            <p className="text-[#F8F6F0]/75 leading-relaxed text-base font-light">
              Suas horas focadas e metas completadas produzem <strong className="text-yellow-300 font-semibold">Moedas de Produtividade</strong>. Use-as no mercado virtual integrado para adquirir trajes cosméticos modernos para a sua Foca (como Ninja, Mago, Astronauta), e comprar alimentos e suprimentos valiosos para recuperar a Energia do seu mascote.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Seçção Destaques: Ref. N.5: Visões e Textos exlpicativos  sobre (Estratégias / Sistema E  Contadores ou Ranks Ofensivos  - FIRE/STREACK). */}
      <section className="py-24 px-6 border-t border-[#F8F6F0]/10 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-orange-400/10 text-orange-400 border-2 border-orange-400/20 rounded-2xl flex items-center justify-center mb-8 animate-bounce">
            <Flame size={36} fill="currentColor" stroke="none" />
          </div>
          
          <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Mantenha o Foguinho Aceso! 🔥
          </h2>
          
          <p className="text-[#F8F6F0]/75 leading-relaxed text-lg font-light max-w-2xl mb-12">
            O consagrado sistema de consistência diária (Streak) protege sua dedicação contínua. Acesse a área de foco todos os dias e mantenha sua ofensiva ativa. Deixar um dia em branco reinicia o contador especial e entristece a sua foca. O recorde do seu streak ficará devidamente guardado nos seus Relatórios!
          </p>

          <div className="grid grid-cols-7 gap-3 mb-12 w-full max-w-lg font-mono">
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, idx) => {
              const active = idx < 5;
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold border transition-all ${
                    active 
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white border-orange-400 shadow-md scale-105' 
                    : 'bg-slate-900/40 border-[#F8F6F0]/10 text-slate-500'
                  }`}>
                    {active ? '🔥' : day}
                  </div>
                  <span className="text-[10px] text-slate-400">{active ? 'OK' : 'S/F'}</span>
                </div>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="px-10 py-5 bg-[#F8F6F0] text-[#00022f] text-sm font-bold uppercase tracking-wider rounded-2xl shadow-[0_4px_30px_rgba(248,246,240,0.25)] hover:bg-white transition-all cursor-pointer"
          >
            Vamos Começar a Focar!
          </motion.button>
        </motion.div>
      </section>

      {/* Area Baixa/Inferiores: O  Rodapé / Assinatura  da Páginas (E dos Sites ou Landings).  */}
      <footer className="border-t border-[#F8F6F0]/10 bg-[#000122] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F8F6F0] flex items-center justify-center text-[#00022f]">
              <Timer size={18} strokeWidth={2.5} />
            </div>
            <span className="font-display font-extrabold text-lg">Foca Aqui</span>
          </div>

          <p className="text-xs text-[#F8F6F0]/40 font-mono">
            &copy; 2026 Foca Aqui Inc. Feito com paixão corporativa por Engenheiros Sêniores de UX.
          </p>

          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); handleStart(); }}
            className="text-xs flex items-center gap-2 text-[#F8F6F0]/60 hover:text-white transition-all font-mono"
          >
            <Github size={14} />
            Privacidade & Termos
          </a>
        </div>
      </footer>
    </div>
  );
}
