export const selectedNote = $state({ note: null, key: null })

export const setNote = (note: string, key: string) => {
  selectedNote.note = note
  selectedNote.key = key
}
