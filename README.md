# Centrum Wiedzy (Notatki, Fiszki, Mapy Myśli)

System edukacyjny zbudowany w **Astro**. Umożliwia jednoczesną naukę z własnych notatek (Markdown), map myśli oraz wbudowanego systemu fiszek (JSON).

## ✨ Funkcjonalności

- 📖 **Notatki z Markdown**: Piszesz normalne pliki `.md`, a system renderuje je w pięknej oprawie wizualnej.
- 🗺️ **Mapy Myśli**: Dodawaj w notatkach bloki ````mermaid` i automatycznie otrzymuj renderowane grafy. Możesz też podlinkować statyczne obrazki z `/public/maps/`.
- 🃏 **Fiszki interaktywne**: Testuj się z zagadnień dzięki fiszkom w formacie JSON.
- 📂 **Grupy Tematyczne**: Wszystko pogrupowane jest na kategorie (np. Pytest, FastAPI) widoczne na stronie głównej.
- 🚀 **Brak serwera (SSG)**: System kompiluje się do czystego HTML/CSS/JS, który można otworzyć prosto z dysku (`dist/index.html`) bez serwera (z uwzględnieniem ścieżek relatywnych).

## 🗂 Struktura projektu i dodawanie treści

System korzysta z **Astro Content Collections**.

### Notatki
- Pliki Markdown wgrywaj do: `src/content/notatki/`
- Na początku pliku musi znajdować się **Frontmatter**:
  ```yaml
  ---
  title: "Tytuł notatki"
  category: "Pytest"
  mindmap: "plik-mapy.png" # opcjonalnie: nazwa pliku z folderu /public/maps/
  ---
  ```

### Fiszki
- Pliki JSON wgrywaj do: `src/content/fiszki/`
- Aby wygenerować nowy plik szablonu, użyj skryptu:
  ```bash
  npm run new-topic -- <kategoria> <temat-slug>
  # np. npm run new-topic -- pytest zaawansowane
  ```
- Kategoria w pliku JSON określa do jakiego kafelka na stronie głównej trafi zestaw.

### Mapy Myśli (obrazki)
- Pliki `.png`, `.jpg` lub `.svg` wrzucaj do folderu: `public/maps/`
- Następnie wskaż je we Frontmatterze w notatkach za pomocą pola `mindmap: "nazwa-pliku.png"`.

## 🐳 Docker (produkcja lokalna, http://localhost:4321)

1. **Docker Desktop** – w *Settings → General* włącz **Start Docker Desktop when you sign in to your computer** (żeby Docker startował z systemem).
2. **Pierwszy raz** – zbuduj i uruchom kontener:
   ```bash
   docker compose up -d --build
   ```
3. **Autostart aplikacji po włączeniu laptopa** – jednorazowo w PowerShell (z katalogu projektu):
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
   .\scripts\install-windows-autostart.ps1
   ```
   Tworzy zadanie harmonogramu *CentrumWiedzy-Docker*, które po zalogowaniu odpala `scripts\docker-start.ps1` (czeka na gotowość Dockera, potem `docker compose up -d`).
4. Adres: **http://localhost:4321/**  
   Kontener ma `restart: always` – po restarcie Dockera kontener wraca.

Usunięcie autostartu: `.\scripts\uninstall-windows-autostart.ps1` albo w *Harmonogram zadań* usuń zadanie `CentrumWiedzy-Docker`.

## 🛠 Uruchomienie i budowanie

### 1. Serwer deweloperski (podczas pisania/dodawania treści)
Serwer wystartuje (domyślnie na porcie 4321) i będzie na żywo odświeżał zmiany.
```bash
npm run dev
```

### 2. Synchronizacja starych notatek z dysku
Jeśli masz stare notatki Markdown w folderze gdzies na dysku, możesz zaimportować je komendą (wymaga dostosowania ścieżki w skrypcie `scripts/sync-notes.js`):
```bash
node scripts/sync-notes.js
```

### 3. Zbudowanie wersji "produkcyjnej"
Tworzy katalog `dist`, a następnie skrypt poprawia ścieżki na relatywne (zaczynające się od `./` lub `../`).
```bash
npm run build
```
Dzięki temu możesz wejść w folder `dist`, kliknąć `index.html` i cała aplikacja (notatki, nawigacja, CSS, fiszki) będzie działać bez żadnego lokalnego serwera.