const fs = require('fs');
const matter = require('gray-matter');

const content = `---
title: 'Notatki: Pytest'
category: Pytest
next_review_date: '2026-03-22'
mindmaps:
  - file: map1.jpg
    rotation: 90
    zoom: 100
  - file: map2.jpg
    rotation: 270
    zoom: 100
---
# Test body`;

const { data, content: body } = matter(content);
const maps = data.mindmaps;
maps[1].rotation = 0; // rotate map 2
const newContent = matter.stringify(body, data);
console.log(newContent);
