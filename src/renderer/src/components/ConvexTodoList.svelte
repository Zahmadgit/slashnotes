<script lang="ts">
  import convex from '../../lib/convex'
  import { onMount } from 'svelte'

  import { api } from '../../../../convex/_generated/api'
  let tasks = []
  onMount(async () => {
    tasks = await convex.query(api.tasks.getTasks, {})
  })
</script>

<div>
  <li>Tasks</li>
  {#each tasks as task (task)}
    <ul>
      <li>
        {task.text}
      </li>
    </ul>
  {/each}
</div>
