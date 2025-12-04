export const selectedNote = $state({ note: null })
export const setNote = (note: string) => {
  selectedNote.note = note
}
