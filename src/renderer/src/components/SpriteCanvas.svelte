<script lang="ts">
  import { onMount } from 'svelte'
  import jumpSheet from '../assets/Samurai/Run.png'
  import fallingSheet from '../assets/Samurai/Falling.png'
  import attackSheet from '../assets/Samurai/attackingV2.png'
  import { xycoordinate } from '../state/xycoordinate.svelte'
  import styles from './SpriteCanvas.module.css'

  const groundSprite = new Image()
  groundSprite.src = jumpSheet

  const fallingSprite = new Image()
  fallingSprite.src = fallingSheet

  const attackingSprite = new Image()
  attackingSprite.src = attackSheet

  let canvas: HTMLCanvasElement
  let ctx
  let animationState: 'ground' | 'falling' | 'attacking' = 'falling'

  //determine which sprite to draw
  const sprites = {
    ground: groundSprite,
    falling: fallingSprite,
    attacking: attackingSprite
  }

  //the frames in each sprite framesheet are different, define them here
  const totalFrames = {
    ground: 8,
    falling: 3,
    attacking: 4
  }

  //determine which width size to use, useful incase I start using different dimentions, right now its 128*128
  const frameWidths = {
    ground: 1024 / totalFrames.ground,
    falling: 384 / totalFrames.falling,
    attacking: 512 / totalFrames.attacking
  }

  //height of the sprite framesheets, attacking needs to be more pixel perfect
  const frameHeight = {
    ground: 128,
    falling: 128,
    attacking: 74
  }

  let frameIndex = 0
  let frameTimer = 0

  let attackTimer = 0
  //this is in milliseconds, frames * 100
  const attackDuration = 400

  // --- gravity physics to simulate falling ---
  let x = 0
  let y = -100
  let velocityY = 0
  const gravity = 0.02
  const frameIntervals = 100

  //function to make sprite fall
  const update = (delta) => {
    velocityY += gravity
    y += velocityY

    if (animationState !== 'attacking') {
      if (xycoordinate.xValue > 0 || xycoordinate.yValue > 0) {
        animationState = 'attacking'
        attackTimer = attackDuration
      }
    }

    if (animationState === 'attacking') {
      attackTimer -= delta
      if (attackTimer <= 0) {
        animationState = y + frameHeight[animationState] >= canvas.height ? 'ground' : 'falling'
        y = xycoordinate.yValue
        x = xycoordinate.xValue
        xycoordinate.xValue = 0
        xycoordinate.yValue = 0
      }
    } else {
      animationState = y + frameHeight[animationState] >= canvas.height ? 'ground' : 'falling'
    }

    frameTimer += delta
    if (frameTimer >= frameIntervals) {
      frameIndex = (frameIndex + 1) % totalFrames[animationState]
      frameTimer = 0
    }

    // clamp to ground
    if (y + frameHeight[animationState] > canvas.height) {
      y = canvas.height - frameHeight[animationState]
      velocityY = 0
    }
  }

  const draw = () => {
    //clearRect is a function used to erase the canvas before each redraw, it's a canvas api
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const sprite = sprites[animationState]
    const frameWidth = frameWidths[animationState]

    /*

    max x and y are required to keep drawling inside the canvas box
    max x: 332
    max y: 329
    */

    if (x > 332) {
      x = 332
    }
    if (y > 329) {
      y = 329
    }
    if (animationState === 'attacking') {
      ctx.drawImage(
        sprite,
        frameIndex * frameWidth,
        0,
        frameWidth,
        frameHeight[animationState],
        xycoordinate.xValue,
        xycoordinate.yValue,
        frameWidth,
        frameHeight[animationState]
      )
      console.log('Animation played at x:', xycoordinate.xValue)
      console.log('Animation played at y:', xycoordinate.yValue)
    } else {
      ctx.drawImage(
        sprite,
        frameIndex * frameWidth,
        0,
        frameWidth,
        frameHeight[animationState],
        x,
        y,
        frameWidth,
        frameHeight[animationState]
      )
    }
  }

  let lastTime = 0
  const gameLoop = (timestamp) => {
    const delta = timestamp - lastTime
    lastTime = timestamp

    update(delta)
    draw()

    requestAnimationFrame(gameLoop)
  }

  // Only start animation once image is loaded

  onMount(() => {
    canvas = document.getElementById('game')

    ctx = canvas.getContext('2d')

    /*
    dont need an effect, or to put the coordinates inside the effect to make animations reactive
    once I start the gameloop, its continous 
    */
    requestAnimationFrame(gameLoop)
  })
</script>

<canvas id="game" class={styles.canvas} width="400" height="400"></canvas>
