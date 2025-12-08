export let notesArray = $state([])
export let IDBKeys = []
export let deleteKey: number
export let saveKey: number
export let editSaveBoolean = false

export const setEditSaveBoolean = (bool: boolean) => {
  editSaveBoolean = bool
}

export const setNotesArray = (notes: { note: string; key: string }[]) => {
  notesArray.length = 0

  notesArray.push(...notes)
}

export const setKeys = (arrayofkeys: IDBValidKey[]) => {
  IDBKeys.length = 0

  IDBKeys.push(...arrayofkeys)
}

export const setDeleteKey = (key) => {
  deleteKey = key
}

export const setSaveKey = (key) => {
  saveKey = key
}
