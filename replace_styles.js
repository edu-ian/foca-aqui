import fs from 'fs';

let content = fs.readFileSync('src/components/NavigationSidebar.tsx', 'utf-8');

// Colors
const replacements = [
  { search: /bg-\[#07091e\]/g, replace: 'bg-brand-card' },
  { search: /bg-\[#040614\]/g, replace: 'bg-brand-bg' },
  { search: /bg-\[#030510\]\/60/g, replace: 'bg-brand-bg/60' },
  { search: /bg-\[#F8F6F0\]\/5/g, replace: 'bg-brand-text/5' },
  { search: /bg-\[#F8F6F0\]\/10/g, replace: 'bg-brand-text/10' },
  { search: /bg-\[#F8F6F0\]\/20/g, replace: 'bg-brand-text/20' },
  { search: /text-\[#F8F6F0\]\/60/g, replace: 'text-brand-text/60' },
  { search: /text-\[#F8F6F0\]\/70/g, replace: 'text-brand-text/70' },
  { search: /text-\[#F8F6F0\]\/40/g, replace: 'text-brand-text/40' },
  { search: /text-\[#F8F6F0\]\/50/g, replace: 'text-brand-text/50' },
  { search: /text-\[#F8F6F0\]\/90/g, replace: 'text-brand-text/90' },
  { search: /text-\[#F8F6F0\]/g, replace: 'text-brand-text' },
  { search: /border-\[#F8F6F0\]\/10/g, replace: 'border-brand-border' },
  { search: /border-\[#F8F6F0\]\/5/g, replace: 'border-brand-border/50' },
  { search: /bg-white\/5/g, replace: 'bg-brand-text/5' },
  { search: /bg-white\/2/g, replace: 'bg-brand-text/5' },
  { search: /bg-black\/40/g, replace: 'bg-brand-bg/40' },
  { search: /border-white\/5/g, replace: 'border-brand-border' },
  { search: /text-white/g, replace: 'text-brand-text' },
  { search: /SANTUÁRIO DO COMPANHEIRO/g, replace: 'SANTUÁRIO DO MASCOTE' },
  { search: /santuário do companheiro/g, replace: 'santuário do mascote' }
];

for (const { search, replace } of replacements) {
  content = content.replace(search, replace);
}

// Reorder tabs
content = content.replace(
  `{[
                  { id: 'profile', label: 'Perfil', icon: User },
                  { id: 'rank', label: 'Online Rank', icon: Award },
                  { id: 'social', label: 'Sessão Conj.', icon: Users },
                  { id: 'inventory', label: 'Inventário', icon: ShoppingBag },
                  { id: 'friends', label: 'Amigos', icon: UserPlus },
                  { id: 'support', label: 'Suporte', icon: Mail },
                ].map((item) => {`,
  `{[
                  { id: 'profile', label: 'Perfil', icon: User },
                  { id: 'inventory', label: 'Inventário', icon: ShoppingBag },
                  { id: 'friends', label: 'Amigos', icon: UserPlus },
                  { id: 'social', label: 'Sessão Conj.', icon: Users },
                  { id: 'support', label: 'Suporte', icon: Mail },
                ].map((item) => {`
);

fs.writeFileSync('src/components/NavigationSidebar.tsx', content);
