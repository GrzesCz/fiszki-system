import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join('C:', 'Users', 'gczop', 'Desktop', 'NAUKA', 'Edukacja');
const destNotatkiDir = path.join(__dirname, '..', 'src', 'content', 'notatki');
const destFiszkiDir = path.join(__dirname, '..', 'src', 'content', 'fiszki');

// Utwórz katalogi docelowe
if (!fs.existsSync(destNotatkiDir)) fs.mkdirSync(destNotatkiDir, { recursive: true });
if (!fs.existsSync(destFiszkiDir)) fs.mkdirSync(destFiszkiDir, { recursive: true });

function formatCategoryName(dirName) {
  // Usuń cyfry z przodu, np. "14_pytest" -> "pytest"
  let name = dirName.replace(/^\d+_/, '');
  // Zamień podłogi/myślniki na spacje i zrób Title Case
  name = name.replace(/[-_]/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return name;
}

function extractTitle(content, fileName) {
  // Spróbuj znaleźć pierwszy nagłówek H1
  const match = content.match(/^#\s+(.+)$/m);
  if (match) {
    return match[1].trim();
  }
  // W ostateczności użyj nazwy pliku
  let name = fileName.replace(/\.md$/, '');
  return name.replace(/[-_]/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function processDirectory(dir, category = null) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Ignoruj ukryte pliki/foldery (zaczynające się od kropeczki) i node_modules itp
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    if (entry.isDirectory()) {
      // Przypisz nową kategorię, jeśli jesteśmy na głównym poziomie, lub użyj obecnej dla podkatalogów
      const nextCategory = category || formatCategoryName(entry.name);
      processDirectory(fullPath, nextCategory);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // Pomijamy specyficzne pliki (np. AGENTS.md itp jeśli trzeba, ale tu bierzemy wszystkie)
      
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // Sprawdź czy już ma frontmatter
      if (!content.startsWith('---')) {
        const title = extractTitle(content, entry.name);
        // Stwórz frontmatter
        const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
category: "${category || 'Ogólne'}"
---
`;
        content = frontmatter + content;
      }

      // Przygotuj nazwę pliku w destDir
      // Żeby uniknąć konfliktów nazw z różnych katalogów, dodajemy prefiks z nazwy katalogu jeśli nie jest z korzenia
      let destFileName = entry.name;
      if (category) {
         // Generuj slug przyjazny dla URL
         const slugCategory = category.toLowerCase().replace(/\s+/g, '-');
         destFileName = `${slugCategory}-${entry.name}`;
      }
      
      const destPath = path.join(destNotatkiDir, destFileName);
      fs.writeFileSync(destPath, content, 'utf-8');
      console.log(`Skopiowano notatkę: ${destFileName}`);
    }
  }
}

console.log('Rozpoczęto synchronizację notatek...');
if (fs.existsSync(sourceDir)) {
  processDirectory(sourceDir);
  console.log('Synchronizacja zakończona sukcesem!');
} else {
  console.error(`Nie znaleziono katalogu źródłowego: ${sourceDir}`);
}

// Przenieś dotychczasowe fiszki do src/content/fiszki
const stareFiszkiDir = path.join(__dirname, '..', 'src', 'data', 'tematy');
if (fs.existsSync(stareFiszkiDir)) {
  console.log('Przenoszenie dotychczasowych fiszek do kolekcji...');
  const fiszkiFiles = fs.readdirSync(stareFiszkiDir).filter(f => f.endsWith('.json'));
  for (const file of fiszkiFiles) {
    const src = path.join(stareFiszkiDir, file);
    const dest = path.join(destFiszkiDir, file);
    
    // Wzbogać json o category jeśli brakuje na podstawie pliku konwencji (project)
    const data = JSON.parse(fs.readFileSync(src, 'utf-8'));
    const parts = file.replace('.json', '').split('-');
    const projectSlug = parts.length > 1 ? parts.slice(0, -1).join('-') : parts[0];
    
    // Naiwne mapowanie do category
    let category = 'Ogólne';
    if (projectSlug === 'pytest') category = 'Pytest';
    if (projectSlug === 'flyer-engine') category = 'Flyer Engine';
    
    if(!data.category) data.category = category;
    
    fs.writeFileSync(dest, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Przeniesiono fiszkę: ${file}`);
  }
}
