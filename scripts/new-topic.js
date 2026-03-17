import { writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Pobierz argumenty z linii poleceń
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Użycie: npm run new-topic -- <kategoria> <temat-slug>');
  console.error('Przykład: npm run new-topic -- pytest zaawansowane-techniki');
  process.exit(1);
}

const category = args[0];
const subtopic = args[1];

// Pełny slug pliku to kategoria-temat-slug, by uniknąć konfliktów w URL
const fileName = `${category}-${subtopic}.json`;
const filePath = join(__dirname, '..', 'src', 'content', 'fiszki', fileName);

if (existsSync(filePath)) {
  console.error(`Błąd: Plik ${fileName} już istnieje!`);
  process.exit(1);
}

// Przygotuj ładny tytuł z kategorii (Capitalize)
const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');

const template = {
  "title": `${formattedCategory} - Nowy Temat`,
  "subtitle": "Krótki opis tego zestawu fiszek",
  "category": formattedCategory,
  "cards": [
    {
      "cat": "pojecie",
      "catLabel": "💡 Pojęcie",
      "q": "Przykładowe pytanie?",
      "a": "Przykładowa odpowiedź."
    },
    {
      "cat": "praktyka",
      "catLabel": "🛠️ Praktyka",
      "q": "Inne pytanie?",
      "a": "Inna odpowiedź."
    }
  ]
};

writeFileSync(filePath, JSON.stringify(template, null, 2), 'utf-8');
console.log(`✅ Utworzono nowy plik fiszek: src/content/fiszki/${fileName}`);
console.log(`Możesz go teraz edytować w edytorze kodu.`);