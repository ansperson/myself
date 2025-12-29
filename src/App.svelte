<script lang="ts">
  import Ps1 from './components/Ps1.svelte';
  import Input from './components/Input.svelte';
  import History from './components/History.svelte';
  import WebKDE from './components/WebKDE.svelte';
  import { theme } from './stores/theme';
  import { booting, runlevel } from './stores/runlevel';
</script>

<svelte:head>
  {#if import.meta.env.VITE_TRACKING_ENABLED === 'true'}
    <script
      async
      defer
      data-website-id={import.meta.env.VITE_TRACKING_SITE_ID}
      src={import.meta.env.VITE_TRACKING_URL}
    ></script>
  {/if}
</svelte:head>

{#if $runlevel === 5}
  <div class="fixed inset-0 overflow-hidden">
    <WebKDE />
    <button
      class="absolute top-4 right-4 z-10 rounded-md bg-black/70 px-3 py-1 text-xs text-white backdrop-blur"
      type="button"
      on:click={() => {
        runlevel.set(3);
        booting.set(false);
      }}
    >
      Return to terminal
    </button>
  </div>
{:else}
  <main
    class="h-full border-2 rounded-md p-4 overflow-auto text-xs sm:text-sm md:text-base"
    style={`background-color: ${$theme.background}; color: ${$theme.foreground}; border-color: ${$theme.green};`}
    data-testid="alive"
  >
    <History />

  {#if !$booting}
    <div class="flex flex-col md:flex-row">
      <Ps1 />

      <Input />
    </div>
  {/if}
  </main>
{/if}
