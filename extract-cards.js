/**
 * Skrypt do wyciągnięcia CARDS z fiszki_bootstrap.html do JSON.
 * Uruchom: node extract-cards.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, '..', '..', 'NAUKA', 'Fiszki_EDU', 'fiszki_bootstrap.html');
const outPath = path.join(__dirname, 'src', 'data', 'tematy', 'flyer-engine-bootstrap.json');

const html = fs.readFileSync(htmlPath, 'utf8');
const match = html.match(/const CARDS = (\[[\s\S]*?\]);\s*let cards/);
if (!match) {
  console.error('Nie znaleziono CARDS w pliku HTML');
  process.exit(1);
}

// Eval the JS array (safe - our own file)
const cards = eval(match[1]);

const output = {
  title: 'bootstrap.py',
  subtitle: 'DI · Singleton · Lazy Init · Thread Safety · Konwencje Pythona',
  cards: cards.map(({ cat, catLabel, q, a }) => ({ cat, catLabel, q, a })),
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`Zapisano ${output.cards.length} fiszek do ${outPath}`);
