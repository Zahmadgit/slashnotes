<script lang="ts">
  import styles from './ThemeSetter.module.css'
  import darkmodeurl from '../../../../resources/darkmode.png'
  import lightmodeurl from '../../../../resources/lightmode.png'
  import { onMount } from 'svelte'
  let shouldUseDark = $state(false)

  onMount(async () => {
    const result = await window.darkMode.system()

    shouldUseDark = result
  })

  const handleTheme = async (): Promise<void> => {
    const result = await window.darkMode.toggle()
    shouldUseDark = result
  }
</script>

<div>
  <button
    class={styles.themeButton}
    onclick={() => {
      handleTheme()
    }}
    aria-label="switch theme button"
  >
    <img src={shouldUseDark ? darkmodeurl : lightmodeurl} alt="theme" />
  </button>
</div>
