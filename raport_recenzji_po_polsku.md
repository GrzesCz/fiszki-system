# Raport z recenzji

## Usterka

- [P2] Nie ukrywaj głównej notatki „Vibe Coding” — `src/content/notatki/notatki_techniczne_Udemy_vibe_coding.md:6`

Ustawienie `hidden: true` sprawia, że ta notatka staje się niewidoczna dla logiki strony kategorii w `src/pages/kategoria/[kategoria].astro`, która jako główny wpis wybiera pierwszą notatkę nieukrytą. Jeśli to jest główna notatka „Vibe Coding”, kategoria zamiast treści pokaże komunikat o pustym stanie, a użytkownicy nie zobaczą oczekiwanego materiału.
