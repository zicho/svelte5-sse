<script lang="ts">
  import { onMount } from "svelte";

  let eventSource = $state<EventSource | null>(null);

  onMount(() => {
    eventSource = new EventSource("/sse/test");

    eventSource.onmessage = function (event) {
      // Handle incoming messages
      console.log(event.data);
    };

    eventSource.onerror = function () {
      console.log("SSE error, attempting to reconnect...");
      eventSource?.close();
    };

    eventSource.onopen = function () {
      console.log("SSE connection established");
    };

    return () => {
      // This will be called when the component is destroyed
      eventSource?.close();
    };
  });

  const onclick = async () => {
    await fetch("/api/message", {
      method: "POST",
      body: JSON.stringify({ test: "test" }),
    });
  };
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<button {onclick}>Click me to send message</button>
