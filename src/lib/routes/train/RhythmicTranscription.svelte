<script>
	import { onDestroy } from 'svelte'
	import RouterLink from '../../RouterLink.svelte'
	import HomeIcon from '../../HomeIcon.svelte'
	import Footer from '../../Footer.svelte'

	const BPM = 50
	const CAESURA_LENGTH = 0.43
	const PITCH = 'A3'
	const WINNING_POINTS = 10
	const LOSING_POINTS = 5
	const RELOAD_WINDOW_TIME = 3750
	const RELOAD_MULTIPLIER = 1.25

	const noteDurations = [
		{ symbol: '𝅗𝅥', value: 0.5 }, // Half note
		{ symbol: '𝅘𝅥', value: 0.25 }, // Quarter note
		{ symbol: '𝅘𝅥𝅮', value: 0.125 }, // Eighth note
	]

	function getRandomNoteSequence(measures, previous) {
		let sequence = []
		let isSameSequence = true

		while (isSameSequence) {
			sequence = []
			let remaining = measures

			while (remaining > 0) {
				const validNotes = noteDurations.filter((note) => note.value <= remaining)
				const chosenNote = validNotes[Math.floor(Math.random() * validNotes.length)]
				sequence.push(chosenNote.symbol)
				remaining -= chosenNote.value
			}

			if (sequence.join('') !== (previous ?? []).join('')) {
				isSameSequence = false
			}
		}

		return sequence
	}

	function convertSymbolsToDurations(symbols) {
		const defaultValue = 0.25
		return symbols.map((symbol) => {
			const note = noteDurations.find((n) => n.symbol === symbol)
			return note ? note.value : defaultValue
		})
	}

	let correctSequence = $state(getRandomNoteSequence(1))
	let userGuess = $state([])
	let score = $state(parseInt(sessionStorage.getItem('score'), 10) || 0)
	let result = $state(null) // null | 'win' | 'lose'
	let lastCorrectSequence = $state([])
	let lastUserGuess = $state([])
	let redirectTimer = null

	const guessDisplay = $derived(userGuess.length ? userGuess.join(' ') : '?')

	function updateScore(newScore) {
		score = newScore
		sessionStorage.setItem('score', String(score))
	}

	function addSymbolToGuess(symbol) {
		userGuess = [...userGuess, symbol]
	}

	function backspace() {
		userGuess = userGuess.slice(0, -1)
	}

	async function playSequence(symbolSequence) {
		const Tone = await import('tone')
		await Tone.start()
		const synth = new Tone.PolySynth(Tone.AMSynth).toDestination()
		const durations = convertSymbolsToDurations(symbolSequence)

		Tone.getTransport().bpm.value = BPM

		let time = Tone.now()
		const caesura = (60 / BPM) * CAESURA_LENGTH

		durations.forEach((duration) => {
			synth.triggerAttackRelease(PITCH, duration, time)
			time += duration + caesura
		})

		if (Tone.getTransport().state !== 'started') {
			Tone.getTransport().start()
		}
	}

	function checkGuess() {
		const isCorrect = userGuess.join('') === correctSequence.join('')
		lastCorrectSequence = correctSequence
		lastUserGuess = userGuess

		if (isCorrect) {
			updateScore(score + WINNING_POINTS)
			result = 'win'
			redirectTimer = setTimeout(resetRound, RELOAD_WINDOW_TIME)
		} else {
			updateScore(score - LOSING_POINTS)
			result = 'lose'
			redirectTimer = setTimeout(resetRound, RELOAD_WINDOW_TIME * RELOAD_MULTIPLIER)
		}
	}

	function resetRound() {
		correctSequence = getRandomNoteSequence(1, lastCorrectSequence)
		userGuess = []
		result = null
	}

	onDestroy(() => {
		if (redirectTimer) clearTimeout(redirectTimer)
	})
</script>

<div class="filter"></div>

<div class="corner-div">
	<RouterLink to="/train" className="NavFont">
		<HomeIcon size={20} />
	</RouterLink>
</div>

{#if result === 'win'}
	<div class="fireworks">
		{#each { length: 20 } as _, i}
			<div class="firework firework-{i + 1}"></div>
		{/each}
	</div>

	<div style="height:20vh;">&nbsp;</div>

	<div class="message">
		<p>👌</p>
		<p>Correct!</p>
		<p>+{WINNING_POINTS}!</p>
		<p>{lastUserGuess.join(' ')}</p>
	</div>
{:else if result === 'lose'}
	<div class="slime"></div>
	<div style="height:10vh;">&nbsp;</div>
	<div class="message">
		<p>💀</p>
		<div>No, try again!</div>
		<p>the correct sequence was:</p>
		<p>{lastCorrectSequence.join(' ')}</p>
		<p>your guess:</p>
		<p>{lastUserGuess.length ? lastUserGuess.join(' ') : 'You did not make a guess!'}</p>
		<p>-{LOSING_POINTS}</p>
	</div>
{:else}
	<div style="height:20vh;">&nbsp;</div>

	<h1>RhytGeor! <button onclick={() => playSequence(correctSequence)}>▶</button></h1>
	<p>(1 bar of 4/4)</p>

	<div id="guess">{guessDisplay}</div>

	<div id="buttons" style="margin:10px;">
		<button onclick={() => addSymbolToGuess('𝅗𝅥')}>𝅗𝅥</button>
		<button onclick={() => addSymbolToGuess('𝅘𝅥')}>𝅘𝅥</button>
		<button onclick={() => addSymbolToGuess('𝅘𝅥𝅮')}>𝅘𝅥𝅮</button>
		<button onclick={backspace}>🡐</button>
	</div>

	<button onclick={checkGuess}>Submit Guess ✔</button>

	<div class="score">
		<p>score:</p>
		<p>{score}</p>
	</div>
{/if}

<Footer />

<style>
	.fireworks {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		pointer-events: none;
	}

	.fireworks .firework {
		position: absolute;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: white;
		animation: fly-up 2s forwards, explode 1s forwards 1s;
	}

	.fireworks .firework::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		width: 2px;
		height: 100px;
		background-color: white;
		animation: rocket-trail 1s linear forwards;
	}

	.firework-1 { top: 100%; left: 10%; animation-delay: 0s; }
	.firework-2 { top: 100%; left: 25%; animation-delay: 0.2s; }
	.firework-3 { top: 100%; left: 40%; animation-delay: 0.4s; }
	.firework-4 { top: 100%; left: 55%; animation-delay: 0.6s; }
	.firework-5 { top: 100%; left: 70%; animation-delay: 0.8s; }
	.firework-6 { top: 100%; left: 85%; animation-delay: 1s; }
	.firework-7 { top: 90%; left: 15%; animation-delay: 1.2s; }
	.firework-8 { top: 90%; left: 35%; animation-delay: 1.3s; }
	.firework-9 { top: 90%; left: 55%; animation-delay: 1.4s; }
	.firework-10 { top: 90%; left: 75%; animation-delay: 1.6s; }
	.firework-11 { top: 100%; left: 5%; animation-delay: 1.1s; }
	.firework-12 { top: 100%; left: 15%; animation-delay: 1.75s; }
	.firework-13 { top: 100%; left: 60%; animation-delay: 1.9s; }
	.firework-14 { top: 100%; left: 55%; animation-delay: 1.65s; }
	.firework-15 { top: 100%; left: 75%; animation-delay: 1.8s; }
	.firework-16 { top: 100%; left: 88%; animation-delay: 2.2s; }
	.firework-17 { top: 90%; left: 15%; animation-delay: 2.3s; }
	.firework-18 { top: 90%; left: 35%; animation-delay: 2.35s; }
	.firework-19 { top: 85%; left: 55%; animation-delay: 2.45s; }
	.firework-20 { top: 70%; left: 75%; animation-delay: 2.7s; }

	@keyframes fly-up {
		0% { transform: translate(-50%, 100%); }
		100% { transform: translate(-50%, 50%); }
	}

	@keyframes explode {
		0% { opacity: 1; transform: scale(1); }
		50% { opacity: 0.7; transform: scale(3) translateY(0); }
		100% { opacity: 0; transform: scale(6) translateY(-200px); }
	}

	@keyframes rocket-trail {
		0% { opacity: 0.5; transform: translateY(0); }
		100% { opacity: 0; transform: translateY(-1000px); }
	}

	.slime {
		position: absolute;
		top: -200px;
		left: 0;
		width: 100%;
		height: 200px;
		background: linear-gradient(to bottom, #00ff00, #004d00);
		animation: slimeDrip 3s infinite, coverScreen 5s forwards;
	}

	@keyframes slimeDrip {
		0%, 100% {
			clip-path: polygon(0% 0%, 100% 0%, 100% 80%, 85% 90%, 75% 80%, 65% 85%, 50% 70%, 40% 85%, 25% 75%, 10% 85%, 0% 80%);
		}
		25% {
			clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 85% 85%, 70% 90%, 60% 80%, 45% 85%, 35% 75%, 15% 90%, 0% 75%);
		}
		50% {
			clip-path: polygon(0% 0%, 100% 0%, 100% 85%, 90% 95%, 80% 85%, 65% 95%, 55% 80%, 40% 90%, 20% 85%, 0% 90%);
		}
		75% {
			clip-path: polygon(0% 0%, 100% 0%, 100% 70%, 80% 80%, 70% 70%, 60% 85%, 50% 75%, 30% 85%, 10% 80%, 0% 75%);
		}
	}

	@keyframes coverScreen {
		0% { top: -200px; }
		100% { top: 0; height: 175vh; }
	}
</style>
