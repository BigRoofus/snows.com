// Mirrors the color stops and timing of the body's `skyCycle` background
// animation (css/app.css) so we can compute the exact background color at
// any moment. Text takes only the background's hue (rotated 180° to its
// complement) and is rendered at a fixed saturation/lightness, so it always
// reads as a bright, saturated color regardless of how dark or light the
// background currently is.
const skyStops = [
	{ p: 0, c: [11, 16, 38] },
	{ p: 4, c: [11, 16, 38] },
	{ p: 8, c: [24, 37, 72] },
	{ p: 12, c: [51, 48, 95] },
	{ p: 16, c: [107, 76, 122] },
	{ p: 20, c: [201, 123, 138] },
	{ p: 24, c: [240, 169, 110] },
	{ p: 28, c: [255, 220, 160] },
	{ p: 34, c: [191, 227, 240] },
	{ p: 40, c: [143, 203, 232] },
	{ p: 50, c: [90, 169, 219] },
	{ p: 58, c: [90, 169, 219] },
	{ p: 64, c: [143, 203, 232] },
	{ p: 72, c: [247, 201, 138] },
	{ p: 78, c: [240, 137, 90] },
	{ p: 82, c: [201, 88, 122] },
	{ p: 86, c: [107, 76, 122] },
	{ p: 90, c: [45, 42, 92] },
	{ p: 94, c: [20, 24, 58] },
	{ p: 100, c: [11, 16, 38] },
]

const SKY_CYCLE_SECONDS = 90
const SKY_ANIMATION_DELAY = 15 // matches body's `animation-delay: -15s`

function currentSkyBackgroundColor() {
	const elapsed = (performance.now() / 1000 + SKY_ANIMATION_DELAY) % SKY_CYCLE_SECONDS
	const pct = (elapsed / SKY_CYCLE_SECONDS) * 100
	for (let i = 0; i < skyStops.length - 1; i++) {
		const a = skyStops[i]
		const b = skyStops[i + 1]
		if (pct >= a.p && pct <= b.p) {
			const t = (pct - a.p) / (b.p - a.p)
			return a.c.map((v, idx) => Math.round(v + (b.c[idx] - v) * t))
		}
	}
	return skyStops[skyStops.length - 1].c
}

function rgbToHue(r, g, b) {
	r /= 255
	g /= 255
	b /= 255
	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	const delta = max - min
	if (delta === 0) return 0
	let hue
	if (max === r) hue = ((g - b) / delta) % 6
	else if (max === g) hue = (b - r) / delta + 2
	else hue = (r - g) / delta + 4
	hue *= 60
	if (hue < 0) hue += 360
	return hue
}

function hslToRgb(h, s, l) {
	const c = (1 - Math.abs(2 * l - 1)) * s
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
	const m = l - c / 2
	let rp, gp, bp
	if (h < 60) [rp, gp, bp] = [c, x, 0]
	else if (h < 120) [rp, gp, bp] = [x, c, 0]
	else if (h < 180) [rp, gp, bp] = [0, c, x]
	else if (h < 240) [rp, gp, bp] = [0, x, c]
	else if (h < 300) [rp, gp, bp] = [x, 0, c]
	else [rp, gp, bp] = [c, 0, x]
	return [Math.round((rp + m) * 255), Math.round((gp + m) * 255), Math.round((bp + m) * 255)]
}

// Continuously sets `target`'s text color to the complementary hue of the
// animated sky background, at a fixed saturation/lightness.
function applyComplementaryTextColor(target, { saturation = 1, lightness = 0.65 } = {}) {
	const el = typeof target === 'string' ? document.querySelector(target) : target
	if (!el) return

	function update() {
		const [r, g, b] = currentSkyBackgroundColor()
		const bgHue = rgbToHue(r, g, b)
		const complementHue = (bgHue + 180) % 360
		const [tr, tg, tb] = hslToRgb(complementHue, saturation, lightness)
		el.style.color = `rgb(${tr}, ${tg}, ${tb})`
		requestAnimationFrame(update)
	}
	requestAnimationFrame(update)
}
