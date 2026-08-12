<script>
	import { onMount, onDestroy } from 'svelte'

	let canvas
	let frame
	let resizeObserver

	onMount(() => {
		const ctx = canvas.getContext('2d')
		const flakeCount = 120
		let flakes = []

		function resize() {
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
		}

		function makeFlake() {
			return {
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				radius: Math.random() * 2.5 + 0.5,
				speed: Math.random() * 1 + 0.3,
				drift: Math.random() * 0.6 - 0.3,
				opacity: Math.random() * 0.5 + 0.4,
			}
		}

		function init() {
			resize()
			flakes = Array.from({ length: flakeCount }, makeFlake)
		}

		function draw() {
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.fillStyle = '#fcbddb'
			for (const flake of flakes) {
				ctx.globalAlpha = flake.opacity
				ctx.beginPath()
				ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
				ctx.fill()

				flake.y += flake.speed
				flake.x += flake.drift

				if (flake.y > canvas.height) {
					flake.y = -flake.radius
					flake.x = Math.random() * canvas.width
				}
				if (flake.x > canvas.width) flake.x = 0
				if (flake.x < 0) flake.x = canvas.width
			}
			ctx.globalAlpha = 1
			frame = requestAnimationFrame(draw)
		}

		init()
		draw()

		resizeObserver = new ResizeObserver(() => {
			const prevW = canvas.width
			const prevH = canvas.height
			resize()
			if (!prevW || !prevH) return
		})
		resizeObserver.observe(document.body)
		window.addEventListener('resize', resize)

		return () => {
			window.removeEventListener('resize', resize)
		}
	})

	onDestroy(() => {
		if (frame) cancelAnimationFrame(frame)
		if (resizeObserver) resizeObserver.disconnect()
	})
</script>

<canvas bind:this={canvas} id="snowCanvas"></canvas>

<style>
	canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 0;
	}
</style>
