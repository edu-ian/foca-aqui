const fs = require('fs');

const files = [
  'src/App.tsx',
  'src/components/HeroPage.tsx',
  'src/components/TodoList.tsx',
  'src/components/NavigationSidebar.tsx'
];

const EN_PT = [
  ['// Run timer logic every second', '// Executa a lógica do cronômetro a cada segundo'],
  ['// Handle task updates', '// Lida com as atualizações de tarefas'],
  ['// Load Local Storage Sync', '// Carrega a sincronização armazenada localmente (Local Storage)'],
  ['// Sync to local storage whenever core state changes', '// Sincroniza com o armazenamento local sempre que o estado principal for alterado'],
  ['// Handle Focus Mode Toggles', '// Alterna o modo de Foco Ativo e Pausa'],
  ['// Hamburger global sidebar panel', '// Painel da barra lateral global (Menu Hambúrguer)'],
  ['// Dashboard Layout', '// Layout do Painel de Controle (Dashboard)'],
  ['// Delicate Custom Background Dot Texture \\& Ambient Texture', '// Textura de pontos de fundo sutil e luzes ambiente personalizadas'],
  ['// Decorative ambient background lights', '// Luzes de fundo decorativas para compor o ambiente visual'],
  ['// Desktop Navigation', '// Navegação principal voltada para Desktop'],
  ['// Feature Section:', '// Seção de Destaque:'],
  ['// Footer', '// Rodapé da página (Footer)'],
  ['// CTA Footer Section', '// Rodapé de Chamada para Ação (Call to Action)'],
  ['// Prevent drag dropping outside', '// Evita comportamento padrão de arrastar e soltar fora da área'],
  ['// State setup', '// Definição de estados globais'],
  ['// Audio Engine', '// Motor de Áudio para interações e alarmes'],
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [en, pt] of EN_PT) {
      // replace case insensitively if we have to, but let's stick to exact
      content = content.split(en).join(pt);
      content = content.replace(/\/\* (.*?) \*\//g, (match, p1) => {
        const eng = p1.trim();
        if (eng === 'Side info bars') return '/* Barras de informações laterais */';
        if (eng === 'Hamburger global sidebar panel' || eng === 'HAMBURGER GLOBAL SIDEBAR PANEL') return '/* Painel global do menu hambúrguer */';
        if (eng === 'Toast alerts') return '/* Alertas flutuantes (Toasts) */';
        if (eng === 'Background Dots Texture') return '/* Textura de fundo pontilhada */';
        if (eng === 'Hero Section with delicate ambient glow') return '/* Seção principal com brilho ambiente delicado */';
        return match;
      });
    }
    fs.writeFileSync(file, content);
  }
}
