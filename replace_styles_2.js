import fs from 'fs';

let content = fs.readFileSync('src/components/NavigationSidebar.tsx', 'utf-8');

// Colors
const replacements = [
  { search: /bg-\[#050614\]/g, replace: 'bg-brand-bg/80' },
  { search: /bg-\[#090b24\]\/40/g, replace: 'bg-brand-card/40' },
  { search: /bg-\[#03040c\]/g, replace: 'bg-brand-bg/50' },
  { search: /bg-\[#080b26\]\/50/g, replace: 'bg-brand-card/50' },
  { search: /divide-\[#F8F6F0\]\/5/g, replace: 'divide-brand-border/50' },
  { search: /bg-\[#0a0d2a\]/g, replace: 'bg-brand-card' },
  { search: /bg-\[#020309\]\/80/g, replace: 'bg-[#020309]/80' },
];

for (const { search, replace } of replacements) {
  content = content.replace(search, replace);
}

fs.writeFileSync('src/components/NavigationSidebar.tsx', content);

