<script>
	import { currentPath } from './lib/router.js'
	import Home from './lib/routes/Home.svelte'
	import About from './lib/routes/About.svelte'
	import TrainIndex from './lib/routes/train/TrainIndex.svelte'
	import AbstractTactics from './lib/routes/train/AbstractTactics.svelte'
	import RhythmicTranscription from './lib/routes/train/RhythmicTranscription.svelte'
	import TheoryTabs from './lib/routes/train/TheoryTabs.svelte'

	const routes = {
		'/': Home,
		'/about': About,
		'/train': TrainIndex,
		'/train/abstract-tactics': AbstractTactics,
		'/train/rhythmic-transcription': RhythmicTranscription,
		'/train/theory-tabs': TheoryTabs,
	}

	let path = $derived($currentPath.replace(/\/+$/, '') || '/')
	let ActiveRoute = $derived(routes[path] ?? null)
</script>

{#if ActiveRoute}
	<ActiveRoute />
{:else}
	<div style="text-align: center;">
		<h1>404</h1>
		<p>Page not found.</p>
		<a href="/">Go home</a>
	</div>
{/if}
