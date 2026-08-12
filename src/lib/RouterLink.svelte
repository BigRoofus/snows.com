<script>
	import { navigate } from './router.js'

	let { to, className = '', children } = $props()

	function handleClick(event) {
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
		event.preventDefault()
		navigate(to)
	}
</script>

<a href={to} class={className} onclick={handleClick}>
	{@render children?.()}
</a>
