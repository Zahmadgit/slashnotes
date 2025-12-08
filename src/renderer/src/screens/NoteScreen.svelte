<script lang="ts">
  import { onMount } from 'svelte'
  import { getNotes, saveNote } from '../helpers/idbAPIsetterHelper'
  import getCarat from 'textarea-caret'
  import { xycoordinate, setXY } from '../state/xycoordinate.svelte'
  import { selectedNote, setNote } from '../state/selectedNote.svelte'
  import {
    notesArray,
    setNotesArray,
    IDBKeys,
    deleteKey,
    saveKey,
    setDeleteKey,
    setKeys,
    setSaveKey,
    editSaveBoolean,
    setEditSaveBoolean
  } from '../state/notesArray.svelte'
  import styles from './NoteScreen.module.css'
  import SpriteCanvas from '../components/SpriteCanvas.svelte'
  import DropDown from '../components/DropDown.svelte'

  //what the hell is wrong with $state, anyways if it needs to be writable use derived
  let inputText = $derived('')

  $effect(() => {
    inputText = selectedNote.note
  })

  let textareainputtext = null
  let textCaretXCoordinate = 0
  let textCaretYCoordinate = 0

  let playDeleteAnimationAt = []
  let prevText = ''
  let prevCaret = 0

  const handlerBeforeChange = (): void => {
    prevText = inputText
    prevCaret = textareainputtext.selectionStart
  }
  //Y = 375 is the lowest I can go currently with 400x400 canvas
  const handleCaretPosition = (): void => {
    const xyCoordinates = getCarat(textareainputtext, textareainputtext.selectionStart)
    console.log(
      'Y Coordinate:',
      xyCoordinates.top,
      'X Coordinate:',
      xyCoordinates.left,
      'Caret Position:',
      textareainputtext.selectionStart
    )

    textCaretXCoordinate = xyCoordinates.left
    textCaretYCoordinate = xyCoordinates.top
  }
  const handleWordDeletionCheck = (e: InputEvent): void => {
    // Only care about backspace-style deletions
    if (e.inputType !== 'deleteContentBackward') return

    if (!textareainputtext) return

    const newCaret = textareainputtext.selectionStart

    // If nothing actually changed (shouldn't happen), bail
    if (newCaret === prevCaret) {
      prevText = inputText
      prevCaret = newCaret
      return
    }

    // The exact substring that disappeared from prevText
    const deletedText = prevText.slice(newCaret, prevCaret) // text removed

    // If there was a selection deletion rather than simple backspace,
    // deletedText will be the selected range — treat separately if desired
    // (here we'll still allow whole-word deletion to be detected)
    const prevBefore = prevText.slice(0, prevCaret)

    // Get the contiguous non-space characters immediately left of prevCaret
    const m = prevBefore.match(/(\S+)$/) // last run of non-space chars
    if (!m) {
      // There was no "word" directly before the caret previously
      prevText = inputText
      prevCaret = newCaret
      return
    }

    const prevWord = m[1] // the word that ended at prevCaret
    const wordStart = prevCaret - prevWord.length // index where that word starts

    // Cases that should count as "whole-word deleted":
    // 1) deletedText === prevWord                  (you backspaced through the whole word)
    // 2) deletedText === prevWord + ' '            (you backspaced the word plus the following space)
    // 3) deletedText.endsWith(prevWord) && newCaret <= wordStart
    //    (covers ctrl+backspace or other chunk deletions that remove the word and maybe more)
    const deletedIsExactlyWord = deletedText === prevWord
    const deletedIsWordPlusSpace = deletedText === prevWord + ' '
    const deletedChunkIncludesWord = deletedText.endsWith(prevWord) && newCaret <= wordStart

    const wholeWordDeleted =
      deletedIsExactlyWord || deletedIsWordPlusSpace || deletedChunkIncludesWord

    if (wholeWordDeleted) {
      // caret coords should already be updated by handleCaretPosition()
      playDeleteAnimationAt = [textCaretXCoordinate, textCaretYCoordinate]

      //using these values to play the attack animation at these coordinates on the canvas
      //max y value: 329

      setXY(textCaretXCoordinate, textCaretYCoordinate)
      console.log('WORD DELETED!')
      console.log('Animation at:', playDeleteAnimationAt)
    }

    // update prev state
    prevText = inputText
    prevCaret = newCaret

    console.log({
      prevText,
      inputText,
      prevCaret,
      newCaret,
      deletedText,
      prevWord,
      wordStart,
      wholeWordDeleted
    })
  }

  const handleSave = () => {
    if (editSaveBoolean) {
      saveNote(saveKey, inputText)
      setEditSaveBoolean(false)
    } else {
      saveNote(Date.now().toString(), inputText)
    }
    inputText = ''
  }

  // Date.now().toString()
  //1765162322036
  onMount(() => {
    textareainputtext = document.getElementById('textareainputtext')

    getNotes()
  })
</script>

<div>
  <h1>make a note</h1>
  <div class={styles.canvasWrapper}>
    <textarea
      id="textareainputtext"
      name="textareainputtext"
      class={styles.canvasTextarea}
      bind:value={inputText}
      oninput={(e) => {
        ;(handleCaretPosition(), handleWordDeletionCheck(e))
      }}
      onkeydown={handlerBeforeChange}
    ></textarea>
    <SpriteCanvas />
  </div>
  <button onclick={() => handleSave()}>Save Note</button>
  <button onclick={handleCaretPosition}>caret position</button>
  <h1>{xycoordinate.xValue}</h1>

  <h1>{xycoordinate.yValue}</h1>

  <DropDown {...notesArray} />
  <!-- <ul>
    {#each notesArray as note (note)}
      <li>{note}</li>
    {/each}
  </ul> -->
</div>
