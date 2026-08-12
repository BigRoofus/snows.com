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

let correctSequence = getRandomNoteSequence(1)
let userGuess = []
let score = parseInt(sessionStorage.getItem('score'), 10) || 0
let lastCorrectSequence = []
let lastUserGuess = []
let redirectTimer = null

const playView = document.getElementById('play-view')
const winView = document.getElementById('win-view')
const loseView = document.getElementById('lose-view')

const guessEl = document.getElementById('guess')
const scoreDisplayEl = document.getElementById('score-display')
const winPointsEl = document.getElementById('win-points')
const winGuessEl = document.getElementById('win-guess')
const loseCorrectEl = document.getElementById('lose-correct')
const loseGuessEl = document.getElementById('lose-guess')
const losePointsEl = document.getElementById('lose-points')

function renderPlayView() {
	guessEl.textContent = userGuess.length ? userGuess.join(' ') : '?'
	scoreDisplayEl.textContent = String(score)
}

function updateScore(newScore) {
	score = newScore
	sessionStorage.setItem('score', String(score))
}

function addSymbolToGuess(symbol) {
	userGuess = [...userGuess, symbol]
	renderPlayView()
}

function backspace() {
	userGuess = userGuess.slice(0, -1)
	renderPlayView()
}

async function playSequence(symbolSequence) {
	const Tone = await import('https://esm.sh/tone@15.1.22')
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

function showView(view) {
	playView.hidden = view !== 'play'
	winView.hidden = view !== 'win'
	loseView.hidden = view !== 'lose'
}

function checkGuess() {
	const isCorrect = userGuess.join('') === correctSequence.join('')
	lastCorrectSequence = correctSequence
	lastUserGuess = userGuess

	if (isCorrect) {
		updateScore(score + WINNING_POINTS)
		winPointsEl.textContent = `+${WINNING_POINTS}!`
		winGuessEl.textContent = lastUserGuess.join(' ')
		showView('win')
		redirectTimer = setTimeout(resetRound, RELOAD_WINDOW_TIME)
	} else {
		updateScore(score - LOSING_POINTS)
		loseCorrectEl.textContent = lastCorrectSequence.join(' ')
		loseGuessEl.textContent = lastUserGuess.length ? lastUserGuess.join(' ') : 'You did not make a guess!'
		losePointsEl.textContent = `-${LOSING_POINTS}`
		showView('lose')
		redirectTimer = setTimeout(resetRound, RELOAD_WINDOW_TIME * RELOAD_MULTIPLIER)
	}
}

function resetRound() {
	correctSequence = getRandomNoteSequence(1, lastCorrectSequence)
	userGuess = []
	renderPlayView()
	showView('play')
}

document.getElementById('play-btn').addEventListener('click', () => playSequence(correctSequence))
document.getElementById('backspace-btn').addEventListener('click', backspace)
document.getElementById('submit-btn').addEventListener('click', checkGuess)
document.querySelectorAll('#buttons button[data-symbol]').forEach((btn) => {
	btn.addEventListener('click', () => addSymbolToGuess(btn.dataset.symbol))
})

window.addEventListener('beforeunload', () => {
	if (redirectTimer) clearTimeout(redirectTimer)
})

renderPlayView()
