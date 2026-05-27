export type NoteVisibilityData = {
  title?: string;
  category?: string;
  hidden?: boolean;
  main?: boolean;
  next_review_date?: string;
};

export type NoteVisibilityEntry = {
  data: NoteVisibilityData;
};

export function isVisibleNote<T extends NoteVisibilityEntry>(note: T): boolean {
  return note.data.hidden !== true;
}

export function getVisibleNotes<T extends NoteVisibilityEntry>(notes: T[]): T[] {
  return notes.filter(isVisibleNote);
}

export function selectMainNote<T extends NoteVisibilityEntry>(notes: T[]): T | undefined {
  const visibleNotes = getVisibleNotes(notes);

  return visibleNotes.find((note) => note.data.main === true) ?? visibleNotes[0];
}

export function getReviewableNotes<T extends NoteVisibilityEntry>(notes: T[], today: string): T[] {
  return getVisibleNotes(notes).filter((note) => {
    const nextReviewDate = note.data.next_review_date;

    return nextReviewDate != null && nextReviewDate !== '' && nextReviewDate <= today;
  });
}

export type ReviewableCategory<T extends NoteVisibilityEntry> = {
  category: string;
  slug: string;
  notes: T[];
  earliestReviewDate: string;
  earliestNoteTitle?: string;
};

export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

export function getReviewableCategories<T extends NoteVisibilityEntry>(
  notes: T[],
  today: string,
): ReviewableCategory<T>[] {
  const notesByCategory = new Map<string, T[]>();

  for (const note of getVisibleNotes(notes)) {
    const category = note.data.category?.trim();
    if (!category) continue;

    const categoryNotes = notesByCategory.get(category) ?? [];
    categoryNotes.push(note);
    notesByCategory.set(category, categoryNotes);
  }

  const reviewableCategories: ReviewableCategory<T>[] = [];

  for (const [category, categoryNotes] of notesByCategory) {
    const mainNote = selectMainNote(categoryNotes);
    const nextReviewDate = mainNote?.data.next_review_date;

    if (!mainNote || !nextReviewDate || nextReviewDate > today) continue;

    reviewableCategories.push({
      category,
      slug: categoryToSlug(category),
      notes: [mainNote],
      earliestReviewDate: nextReviewDate,
      earliestNoteTitle: mainNote.data.title,
    });
  }

  return reviewableCategories.sort((a, b) => {
    if (a.earliestReviewDate !== b.earliestReviewDate) {
      return a.earliestReviewDate.localeCompare(b.earliestReviewDate);
    }

    return a.category.localeCompare(b.category);
  });
}
