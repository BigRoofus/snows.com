<script>
	import RouterLink from '../RouterLink.svelte'
	import SnowCanvas from '../SnowCanvas.svelte'
</script>

<SnowCanvas />

<RouterLink to="/about" className="logo-link">
	<img class="centered-logo" src="/logo_solid_pink_shadow.svg" alt="It Snows In Australia Logo" />
</RouterLink>

<style>
	:global(.logo-link) {
		position: relative;
		z-index: 1;
	}
</style>
