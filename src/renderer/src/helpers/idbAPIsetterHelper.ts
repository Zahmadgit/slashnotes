import { keys, get, del, set } from './idbAPIHelper'

import { selectedNote, setNote } from '../state/selectedNote.svelte'
import {
  notesArray,
  setNotesArray,
  IDBKeys,
  deleteKey,
  saveKey,
  setDeleteKey,
  setKeys,
  setSaveKey
} from '../state/notesArray.svelte'

export const returnEditNoteKey = async (): Promise<void> => {}

export const getNotes = async (): Promise<void> => {
  try {
    let noteAndKeyArr = []
    setKeys(await keys())
    console.log(IDBKeys)
    IDBKeys.map(async (keyItem) => {
      const responseValue = await get(keyItem)
      noteAndKeyArr.push({ note: responseValue, key: keyItem })
      console.log(noteAndKeyArr)
      setNotesArray(noteAndKeyArr)
    })
  } catch (e) {
    console.log('Error getting tasks: ', e)
  }
}

export const saveNote = async (keys, value): Promise<void> => {
  try {
    await set(keys, value)
    await getNotes()
  } catch (e) {
    console.log('Error saving task: ', e)
  }
}

export const deleteNote = async (key: string): Promise<void> => {
  try {
    del(key)
    console.log(IDBKeys)
  } catch (e) {
    console.log('Error getting tasks: ', e)
  }
}
