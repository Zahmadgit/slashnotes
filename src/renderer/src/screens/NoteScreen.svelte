<script>
  import Matter from 'matter-js'
  import { onMount } from 'svelte'
  import { get, set, del, clear, keys, getAllKeys } from '../helpers/idbAPIHelper'

  let inputText = ''

  let notesArray = []

  const getTask = async () => {
    try {
      //if I wanna get the Values for all the keys I need to get all keys first
      const responseKeys = await keys()
      console.log(responseKeys)
      //alright lets use Promise.all now...
      //Promise.all returns a promise with an array of resolved values
      const waitingPromise = await Promise.all(
        responseKeys.map(async (keyItem) => {
          const responseValue = await get(keyItem)
          console.log(responseValue)
          //dont forget to return the actualy values or else im getting back undefined promises
          return responseValue
        })
      )
      notesArray = waitingPromise
    } catch (e) {
      console.log('getting some shit did not work :sadface: ', e)
      return 'getfucked'
    }
  }

  const saveTask = async (keys, value) => {
    try {
      await set(keys, value)
      //refreshing the list after saving a note
      await getTask()
    } catch (e) {
      console.log('bruh we didnt set the task: ', e)
    }
  }

  // module aliases
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite

  // create an engine
  var engine = Engine.create()

  // create a renderer
  var render = Render.create({
    element: document.body,
    engine: engine
  })

  // create two boxes and a ground
  var boxA = Bodies.rectangle(400, 200, 80, 80)
  var boxB = Bodies.rectangle(450, 50, 80, 80)
  var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true })

  // add all of the bodies to the world
  Composite.add(engine.world, [boxA, boxB, ground])

  // run the renderer
  Render.run(render)

  // create runner
  var runner = Runner.create()

  // run the engine
  Runner.run(runner, engine)

  onMount(() => {
    getTask()
  })
</script>

<div>
  <h1>Make a note</h1>
  <textarea id="inputText" name="inputText" bind:value={inputText}></textarea>
  <button onclick={() => saveTask(Date.now().toString(), inputText)}>Save Note</button>
  <ul>
    {#each notesArray as note (note)}
      <div>
        <li>{note}</li>
      </div>
    {/each}
  </ul>
</div>
