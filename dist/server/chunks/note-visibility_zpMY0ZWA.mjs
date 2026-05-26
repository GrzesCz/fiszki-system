function isVisibleNote(note) {
  return note.data.hidden !== true;
}
function getVisibleNotes(notes) {
  return notes.filter(isVisibleNote);
}
function selectMainNote(notes) {
  const visibleNotes = getVisibleNotes(notes);
  return visibleNotes.find((note) => note.data.main === true) ?? visibleNotes[0];
}
function getReviewableNotes(notes, today) {
  return getVisibleNotes(notes).filter((note) => {
    const nextReviewDate = note.data.next_review_date;
    return nextReviewDate != null && nextReviewDate !== "" && nextReviewDate <= today;
  });
}
function categoryToSlug(category) {
  return category.toLowerCase().replace(/\s+/g, "-");
}
function getReviewableCategories(notes, today) {
  const groups = /* @__PURE__ */ new Map();
  for (const note of getReviewableNotes(notes, today)) {
    const category = note.data.category?.trim();
    const nextReviewDate = note.data.next_review_date;
    if (!category || !nextReviewDate) continue;
    const existing = groups.get(category);
    if (!existing) {
      groups.set(category, {
        category,
        slug: categoryToSlug(category),
        notes: [note],
        earliestReviewDate: nextReviewDate,
        earliestNoteTitle: note.data.title
      });
      continue;
    }
    existing.notes.push(note);
    if (nextReviewDate < existing.earliestReviewDate) {
      existing.earliestReviewDate = nextReviewDate;
      existing.earliestNoteTitle = note.data.title;
    }
  }
  return Array.from(groups.values()).sort((a, b) => {
    if (a.earliestReviewDate !== b.earliestReviewDate) {
      return a.earliestReviewDate.localeCompare(b.earliestReviewDate);
    }
    return a.category.localeCompare(b.category);
  });
}

export { getVisibleNotes as a, getReviewableCategories as g, selectMainNote as s };
