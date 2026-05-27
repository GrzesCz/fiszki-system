import { describe, expect, it } from 'vitest';
import { getReviewableCategories, getReviewableNotes, getVisibleNotes, selectMainNote } from './note-visibility';

const note = (data: {
  title?: string;
  category?: string;
  hidden?: boolean;
  main?: boolean;
  next_review_date?: string;
}) => ({ data });

describe('note visibility', () => {
  it('filters hidden notes from student-facing lists', () => {
    const notes = [note({ hidden: true }), note({}), note({ hidden: false })];

    expect(getVisibleNotes(notes)).toEqual([notes[1], notes[2]]);
  });

  it('selects an explicit main visible note before the first visible fallback', () => {
    const notes = [note({ hidden: true, main: true }), note({}), note({ main: true })];

    expect(selectMainNote(notes)).toBe(notes[2]);
  });

  it('falls back to the first visible note when no explicit main note exists', () => {
    const notes = [note({ hidden: true }), note({}), note({})];

    expect(selectMainNote(notes)).toBe(notes[1]);
  });

  it('ignores hidden notes in review suggestions', () => {
    const notes = [
      note({ hidden: true, next_review_date: '2026-01-01' }),
      note({ next_review_date: '2026-01-02' }),
      note({ next_review_date: '2026-12-31' }),
    ];

    expect(getReviewableNotes(notes, '2026-05-26')).toEqual([notes[1]]);
  });

  it('groups review suggestions by visible category main notes', () => {
    const notes = [
      note({ category: 'Vibe Coding', title: 'Hidden old', hidden: true, next_review_date: '2026-01-01' }),
      note({ category: 'Agenci AI', title: 'Agents main', main: true, next_review_date: '2026-04-24' }),
      note({ category: 'Pytest', title: 'Pytest', next_review_date: '2026-05-20' }),
      note({ category: 'Agenci AI', title: 'Agents detail', next_review_date: '2026-04-23' }),
      note({ category: 'Future', title: 'Future', next_review_date: '2026-12-31' }),
    ];

    expect(getReviewableCategories(notes, '2026-05-26')).toEqual([
      {
        category: 'Agenci AI',
        slug: 'agenci-ai',
        notes: [notes[1]],
        earliestReviewDate: '2026-04-24',
        earliestNoteTitle: 'Agents main',
      },
      {
        category: 'Pytest',
        slug: 'pytest',
        notes: [notes[2]],
        earliestReviewDate: '2026-05-20',
        earliestNoteTitle: 'Pytest',
      },
    ]);
  });

  it('does not mark a category due when only a detail note is overdue', () => {
    const notes = [
      note({ category: 'Agenci AI', title: 'Agents main', main: true, next_review_date: '2026-06-03' }),
      note({ category: 'Agenci AI', title: 'Agents detail', next_review_date: '2026-04-24' }),
    ];

    expect(getReviewableCategories(notes, '2026-05-27')).toEqual([]);
  });
});
