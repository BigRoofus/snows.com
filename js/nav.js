document.addEventListener('DOMContentLoaded', () => {
	const toggle = document.querySelector('.nav-toggle')
	const dropdown = document.querySelector('.nav-dropdown')
	if (!toggle || !dropdown) return

	toggle.addEventListener('click', (e) => {
		e.stopPropagation()
		const isOpen = dropdown.classList.toggle('open')
		toggle.setAttribute('aria-expanded', String(isOpen))
	})

	document.addEventListener('click', (e) => {
		if (!dropdown.contains(e.target) && e.target !== toggle) {
			dropdown.classList.remove('open')
			toggle.setAttribute('aria-expanded', 'false')
		}
	})
})
