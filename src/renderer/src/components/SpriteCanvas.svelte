<script lang="ts">
  import { onMount } from 'svelte'
  import jumpSheet from '../assets/Samurai/Run.png'
  import fallingSheet from '../assets/Samurai/Falling.png'

  import styles from './SpriteCanvas.module.css'
  onMount(() => {
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

<canvas id="game" class={styles.canvas} width="400" height="400"></canvas>
