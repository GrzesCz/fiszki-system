const fs = require('fs');
const path = require('path');
const dir = 'src/content/notatki';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('category: "Ogólne"')) {
    let newCategory = file.replace(/^\d+[_|-]/, '').replace(/\.md$/, '');
    newCategory = newCategory.charAt(0).toUpperCase() + newCategory.slice(1);
    
    // Ręczne poprawki dla lepszego wyglądu
    if (newCategory === 'AGENTS') newCategory = 'AGENTS';
    if (newCategory === 'Struktura-projektow-notatki') newCategory = 'Struktura Projektów';
    if (newCategory === 'Docs-explain-concept') newCategory = 'Docs Explain Concept';
    if (newCategory === 'Docs-quiz-me') newCategory = 'Docs Quiz Me';
    if (newCategory === 'Async_await') newCategory = 'Async Await';
    if (newCategory === 'Sqlalchemy_2') newCategory = 'SQLAlchemy 2';
    if (newCategory === 'Pydantic_v2') newCategory = 'Pydantic v2';
    if (newCategory === 'Pydantic_settings') newCategory = 'Pydantic Settings';
    
    content = content.replace('category: "Ogólne"', 'category: "' + newCategory + '"');
    fs.writeFileSync(filePath, content);
    console.log('Zaktualizowano ' + file + ' -> ' + newCategory);
  }
});