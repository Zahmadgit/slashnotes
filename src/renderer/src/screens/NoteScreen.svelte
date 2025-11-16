<script>
  import { onMount } from 'svelte'
  import { get, set, keys } from '../helpers/idbAPIHelper'
  import jumpSheet from '../assets/Samurai/Jump.png'

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

    const canvas = document.getElementById('game')
    const ctx = canvas.getContext('2d')

    const sprite = new Image()
    sprite.src = jumpSheet // your sprite sheet

    // --- SPRITE ANIMATION SETTINGS ---
    const totalFrames = 12
    const frameWidth = 1536 / totalFrames
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

<canvas id="game" width="400" height="400"></canvas>

<div>
  <h1>Make a note</h1>
  <textarea id="inputText" name="inputText" bind:value={inputText}></textarea>
  <button on:click={() => saveTask(Date.now().toString(), inputText)}>Save Note</button>

  <ul>
    {#each notesArray as note (note)}
      <li>{note}</li>
    {/each}
  </ul>
</div>
