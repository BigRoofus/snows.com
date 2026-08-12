const canvas = document.getElementById('snowCanvas')

if (canvas) {
	const ctx = canvas.getContext('2d')
	const flakeCount = 40
	let flakes = []
	let frame

	function resize() {
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
	}

	function makeFlake() {
		// depth is skewed toward small/distant flakes, with a few large/close ones
		const depth = Math.pow(Math.random(), 2.2)
		return {
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			radius: depth * 18 + 0.4,
			speed: depth * 1.8 + 0.2,
			drift: Math.random() * 0.6 - 0.3,
			opacity: depth * 0.55 + 0.35,
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

	window.addEventListener('resize', resize)
}
