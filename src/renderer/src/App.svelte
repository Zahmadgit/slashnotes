<script lang="ts">
  import NoteScreen from './screens/NoteScreen.svelte'

  let count = $state(0)

  const handleTheme = async () => {
    const isDarkMode = await window.darkMode.toggle()
  }
</script>

<div>
  <div>
    <h1>Count: {count}</h1>
    <button onclick={() => count++}>Click me to increment the count</button>
    <button onclick={() => count--}>Click me to decrement the count</button>

    {#if count === 0}
      <h2>count is 0</h2>
    {/if}
  </div>
  <button onclick={() => handleTheme()}>Toggle Theme</button>

  <NoteScreen />
</div>
