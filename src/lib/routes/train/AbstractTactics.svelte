<script>
	import RouterLink from '../../RouterLink.svelte'
	import HomeIcon from '../../HomeIcon.svelte'
	import Footer from '../../Footer.svelte'
	import rawTactics from '../../../data/abstract-tactics.txt?raw'

	const allTactics = rawTactics
		.split(/\r\n|\n|\r/)
		.map((line) => line.trim())
		.filter((line) => line !== '')

	function shuffleArray(array) {
		const copy = array.slice()
		for (let i = copy.length - 1; i > 0; i--) {
			const randomIndex = Math.floor(Math.random() * (i + 1))
			;[copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]]
		}
		return copy
	}

	const savedArray = localStorage.getItem('shuffledArray')
	const savedIndex = parseInt(localStorage.getItem('currentIndex'), 10) || 0

	let shuffledArray = savedArray ? JSON.parse(savedArray) : shuffleArray(allTactics)
	let currentIndex = savedArray ? savedIndex : 0

	if (!savedArray) {
		localStorage.setItem('shuffledArray', JSON.stringify(shuffledArray))
		localStorage.setItem('currentIndex', String(currentIndex))
	}

	let tactic = $state(shuffledArray[currentIndex])

	function nextTactic() {
		currentIndex = (currentIndex + 1) % shuffledArray.length
		localStorage.setItem('currentIndex', String(currentIndex))
		tactic = shuffledArray[currentIndex]
	}
</script>

<div class="filter"></div>

<div class="corner-div">
	<RouterLink to="/train" className="NavFont">
		<HomeIcon size={20} />
	</RouterLink>
</div>

<div class="full-center">
	<div id="tactic">{tactic}</div>
	<button style="font-size: 200%; margin-top:-0.1vh;" onclick={nextTactic}>↻</button>
</div>

<Footer />

<style>
	button {
		font-size: 5rem;
		background: transparent;
		color: #fff;
		margin-top: -50px;
		cursor: pointer;
	}

	button:hover {
		background: transparent;
	}
</style>
