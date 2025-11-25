<script lang="ts">
  import { onMount } from 'svelte'
  import { get, set, keys } from '../helpers/idbAPIHelper'
  import jumpSheet from '../assets/Samurai/Run.png'
  import fallingSheet from '../assets/Samurai/Falling.png'
  import getCarat from 'textarea-caret'

  import styles from './NoteScreen.module.css'
  let inputText = $state('')
  let notesArray = $state([])

  let textareainputtext = null
  let textCaretXCoordinate = 0
  let textCaretYCoordinate = 0

  let playDeleteAnimationAt = []

  let caretIndex = 0
  let prevText = ''
  let prevCaret = 0

  const handlerBeforeChange = (): void => {
    prevText = inputText
    prevCaret = textareainputtext.selectionStart
  }

  const handleCaretPosition = (): void => {
    const xyCoordinates = getCarat(textareainputtext, textareainputtext.selectionStart)
    console.log(xyCoordinates.top, xyCoordinates.left, textareainputtext.selectionStart)

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

  const getTask = async (): Promise<void> => {
    try {
      const responseKeys = await keys()
      const waitingPromise = await Promise.all(
        responseKeys.map(async (keyItem) => {
          const responseValue = await get(keyItem)
          return responseValue
        })
      )
      notesArray = waitingPromise
    } catch (e) {
      console.log('Error getting tasks: ', e)
    }
  }

  const saveTask = async (keys, value): Promise<void> => {
    try {
      await set(keys, value)
      await getTask()
    } catch (e) {
      console.log('Error saving task: ', e)
    }
  }

  onMount(() => {
    textareainputtext = document.getElementById('textareainputtext')

    getTask()

    const canvas: HTMLCanvasElement = document.getElementById('game')

    const ctx = canvas.getContext('2d')

    let state: 'ground' | 'falling' = 'falling'

    const groundSprite = new Image()
    groundSprite.src = jumpSheet // your groundSprite sheet

    const fallingSprite = new Image()
    fallingSprite.src = fallingSheet

    // --- groundSprite ANIMATION SETTINGS ---
    const totalFrames = {
      ground: 8,
      falling: 3
    }

    const frameHeight = 128

    let frameIndex = 0
    let frameTimer = 0

    // --- groundSprite PHYSICS ---
    let x = 0
    let y = -100
    let velocityY = 0
    const gravity = 0.01
    const frameIntervals = { ground: 100, falling: 100 }

    function update(delta) {
      velocityY += gravity
      y += velocityY

      state = y + frameHeight >= canvas.height ? 'ground' : 'falling'

      frameTimer += delta
      if (frameTimer >= frameIntervals[state]) {
        frameIndex = (frameIndex + 1) % totalFrames[state]
        frameTimer = 0
      }

      // clamp to ground
      if (y + frameHeight > canvas.height) {
        y = canvas.height - frameHeight
        velocityY = 0
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const sprite = state === 'ground' ? groundSprite : fallingSprite
      const frameWidth = state === 'falling' ? 384 / totalFrames.falling : 1024 / totalFrames.ground

      ctx.drawImage(
        sprite,
        frameIndex * frameWidth,
        0,
        frameWidth,
        frameHeight,
        x,
        y,
        // textCaretXCoordinate,
        // textCaretYCoordinate,
        frameWidth,
        frameHeight
      )
    }

    // Only start animation once image is loaded
    groundSprite.onload = () => {
      let lastTime = 0

      function gameLoop(timestamp) {
        const delta = timestamp - lastTime
        lastTime = timestamp

        update(delta)
        draw()

        requestAnimationFrame(gameLoop)
      }

      requestAnimationFrame(gameLoop)
    }
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

    <canvas id="game" class={styles.canvas} width="400" height="400"></canvas>
  </div>
  <button onclick={() => saveTask(Date.now().toString(), inputText)}>Save Note</button>
  <button onclick={handleCaretPosition}>caret position</button>
  <ul>
    {#each notesArray as note (note)}
      <li>{note}</li>
    {/each}
  </ul>
</div>
