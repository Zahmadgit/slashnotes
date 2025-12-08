<script lang="ts">
  import { onMount } from 'svelte'
  import { selectedNote, setNote } from '../state/selectedNote.svelte'
  import { deleteNote, getNotes } from '../helpers/idbAPIsetterHelper'
  import { IDBKeys, setEditSaveBoolean, setSaveKey } from '../state/notesArray.svelte'
  let { ...notesArray } = $props()
  let dropDownState = $state(false)

  onMount(() => {
    console.log(notesArray)
  })

  //fix this, its making a new note right now which is intended....
  const handleNoteSelector = (note, key): void => {
    setNote(note, key)
    setSaveKey(key)
    setEditSaveBoolean(true)
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
          <button onclick={() => handleNoteSelector(note.note, note.key)}>Edit Note?</button>
          <button onclick={() => handleNoteDeleter(i)}>Delete Note?</button>

          <li>
            {note.note}
          </li>
        {/each}
      </ul>
    {:else}
      <button onclick={() => (dropDownState = !dropDownState)}> Show Notes </button>
    {/if}
    <h4>Editting:</h4>

    <li>{selectedNote.note}</li>
    <p>key: {selectedNote.key}</p>
  </ul>
</div>
