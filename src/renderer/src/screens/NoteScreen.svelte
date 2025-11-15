<script>
  import { onMount } from 'svelte'
  import { get, set, del, clear, keys, getAllKeys } from '../helpers/idbAPIHelper'

  let inputText = ''

  let notesArray = []

  const getTask = async () => {
    try {
      //if I wanna get the Values for all the keys I need to get all keys first
      const responseKeys = await keys()
      console.log(responseKeys)
      //plan on using this ref to get the key for the put operation
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

  onMount(() => {
    getTask()
  })
</script>

<div>
  <h1>Make a note</h1>
  <textarea id="inputText" name="inputText" bind:value={inputText}></textarea>
  <button onclick={() => saveTask(Date.now().toString(), inputText)}>Save Note</button>
  <ul>
    {#each notesArray as note}
      <li>{note}</li>
    {/each}
  </ul>
</div>
