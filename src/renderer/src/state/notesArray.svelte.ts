export let notesArray = $state([])
export let IDBKeys = []
export let deleteKey: number
export let saveKey: number

export const setNotesArray = (arrayofnotes: string[]) => {
  notesArray.length = 0

  notesArray.push(...arrayofnotes)
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
