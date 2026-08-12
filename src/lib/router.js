import { writable } from 'svelte/store'

export const currentPath = writable(window.location.pathname)

window.addEventListener('popstate', () => {
	currentPath.set(window.location.pathname)
})

export function navigate(path) {
	if (path !== window.location.pathname) {
		window.history.pushState({}, '', path)
		currentPath.set(path)
	}
	window.scrollTo(0, 0)
}
