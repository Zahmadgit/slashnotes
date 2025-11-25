<script lang="ts">
  import { onMount } from 'svelte'
  import { get, set, keys } from '../helpers/idbAPIHelper'
  import jumpSheet from '../assets/Samurai/Run.png'
  import fallingSheet from '../assets/Samurai/Falling.png'
  import getCarat from 'textarea-caret'

  import styles from './NoteScreen.module.css'
  let inputText = $state('')
  let notesArray = $state([])

  let textareainputtext

  const handleCaretPosition = (): void => {
    const xyCoordinates = getCarat(textareainputtext, textareainputtext.selectionStart)
    console.log(xyCoordinates.top, xyCoordinates.left)
  }

  const getTask = async () => {
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

  const saveTask = async (keys, value) => {
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
    const frameIntervals = { ground: 100, falling: 150 }

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
    ></textarea>

    <canvas id="game" class={styles.canvas}></canvas>
  </div>
  <button onclick={() => saveTask(Date.now().toString(), inputText)}>Save Note</button>
  <button onclick={handleCaretPosition}>caret position</button>
  <ul>
    {#each notesArray as note (note)}
      <li>{note}</li>
    {/each}
  </ul>
</div>
