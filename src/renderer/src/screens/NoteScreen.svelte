<script lang="ts">
  import { onMount } from 'svelte'
  import { get, set, keys } from '../helpers/idbAPIHelper'
  import jumpSheet from '../assets/Samurai/Run.png'
  import styles from './NoteScreen.module.css'
  let inputText = ''
  let notesArray = []

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
    getTask()

    const canvas: HTMLCanvasElement = document.getElementById('game')
    const ctx = canvas.getContext('2d')

    const sprite = new Image()
    sprite.src = jumpSheet // your sprite sheet

    // --- SPRITE ANIMATION SETTINGS ---
    const totalFrames = 8
    const frameWidth = 1024 / totalFrames
    const frameHeight = 128

    let frameIndex = 0
    let frameTimer = 0
    let frameInterval = 100

    // --- SPRITE PHYSICS ---
    let x = 100
    let y = 0
    let velocityY = 0
    const gravity = 0.1

    function update(delta) {
      velocityY += gravity
      y += velocityY

      // Stop at ground
      if (y + frameHeight > canvas.height) {
        y = canvas.height - frameHeight
        velocityY = 0
      }

      // Animate frames
      frameTimer += delta
      if (frameTimer >= frameInterval) {
        frameIndex = (frameIndex + 1) % totalFrames
        frameTimer = 0
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.drawImage(
        sprite,
        frameIndex * frameWidth, // source X
        0, // source Y
        frameWidth,
        frameHeight,
        x,
        y,
        frameWidth,
        frameHeight
      )
    }

    // Only start animation once image is loaded
    sprite.onload = () => {
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
    <textarea id="inputText" name="inputText" class={styles.canvasTextarea} bind:value={inputText}
    ></textarea>
    <canvas id="game" class={styles.canvas}></canvas>
  </div>
  <button on:click={() => saveTask(Date.now().toString(), inputText)}>Save Note</button>

  <ul>
    {#each notesArray as note (note)}
      <li>{note}</li>
    {/each}
  </ul>
</div>
