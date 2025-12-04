<script lang="ts">
  import { onMount } from 'svelte'
  import { selectedNote, setNote } from '../state/selectedNote.svelte'
  import { deleteNote, getNotes } from '../helpers/idbAPIsetterHelper'
  import { IDBKeys } from '../state/notesArray.svelte'
  let { ...notesArray } = $props()
  let dropDownState = $state(false)

  onMount(() => {
    console.log(notesArray)
  })

  //fix this, its making a new note right now which is intended....
  const handleNoteSelector = (note): void => {
    setNote(note)
  }

  const handleNoteDeleter = (key): void => {
    deleteNote(IDBKeys[key])
    getNotes()
  }
</script>

<div>
  <ul>
    {#if dropDownState}
      <button onclick={() => (dropDownState = !dropDownState)}> Hide Notes </button>
      <ul>
        {#each notesArray as note, i (note)}
          <button onclick={() => handleNoteSelector(note)}>Edit Note?</button>
          <button onclick={() => handleNoteDeleter(i)}>Delete Note?</button>

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
