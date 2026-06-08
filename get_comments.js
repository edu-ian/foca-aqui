import fs from 'fs';
import path from 'path';

function getComments(dir) {
  let comments = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      comments = comments.concat(getComments(fullPath));
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('//') || line.startsWith('{/*')) {
          comments.push(`${fullPath}:${i + 1}: ${line}`);
        }
      }
    }
  }
  return comments;
}

const all = getComments('./src');
fs.writeFileSync('all_comments.txt', all.join('\n'));
