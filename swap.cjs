const fs = require('fs');

const path = './src/components/HeroPage.tsx';
let source = fs.readFileSync(path, 'utf8');

const section1StartMarker = "{/* Feature Section 1: Como funciona o Pomodoro */}";
const section2StartMarker = "{/* Feature Section 2: To-Do List integrada */}";
const sobreStartMarker = "{/* Feature Section: Sobre */}";
const footerStartMarker = "{/* Feature Section 5: Sistema de Streak */}";

const idx1 = source.indexOf(section1StartMarker);
const idx2 = source.indexOf(section2StartMarker);
const idxSobre = source.indexOf(sobreStartMarker);
const idxFooterStart = source.indexOf(footerStartMarker, idxSobre);

if (idx1 !== -1 && idx2 !== -1 && idxSobre !== -1 && idxFooterStart !== -1) {
  const funcSection = source.substring(idx1, idx2);
  const sobreSection = source.substring(idxSobre, idxFooterStart);

  let newSource = source.substring(0, idx1);
  newSource += sobreSection;
  newSource += "\n      ";
  newSource += source.substring(idx2, idxSobre);
  newSource += "\n      ";
  newSource += funcSection;
  newSource += "\n      ";
  newSource += source.substring(idxFooterStart);

  fs.writeFileSync(path, newSource);
  console.log('Swapped successfully!');
} else {
  console.log('Failed to find sections', {idx1, idx2, idxSobre, idxFooterStart});
}
