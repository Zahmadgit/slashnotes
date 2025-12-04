<script lang="ts">
  import { onMount } from 'svelte'
  import { selectedNote, setNote } from '../state/selectedNote.svelte'

  let { ...notesArray } = $props()
  let dropDownState = $state(false)

  onMount(() => {
    console.log(notesArray)
  })

  const handleNoteSelector = (note): void => {
    setNote(note)
  }
</script>

<div>
  <ul>
    {#if dropDownState}
      <button onclick={() => (dropDownState = !dropDownState)}> Hide Notes </button>
      <ul>
        {#each notesArray as note (note)}
          <button onclick={() => handleNoteSelector(note)}>Edit Note?</button>
          <li>
            {note}
          </li>
        {/each}
      </ul>
    {:else}
      <button onclick={() => (dropDownState = !dropDownState)}> Show Notes </button>
    {/if}

    {selectedNote.note}
  </ul>
</div>
