const allTactics = [
	"The best surprises initially seem like mistakes.",
	"Take away elements in order of apparent non-importance.",
	"Focus in on just one element and ride it for all it's worth.",
	"Allow only one element of each type.",
	"Is it already finished?",
	"Stay patient. It’s not done yet.",
	"Remove everything you can.",
	"Use fewer pieces.",
	"What's the smallest change you can make?",
	"Is this part necessary?",
	"Don't be afraid of things because they're easy to do.",
	"Don't be afraid of using cliches.",
	"Allow yourself to create bad work.",
	"Work against your better judgment here.",
	"Give way to your absolute worst impulses.",
	"If you feel like you are forcing something, it's probably a contrivance.",
	"Complete what someone else abandoned.",
	"Shrink everything.",
	"Reduce it to rubble. Use the rubble.",
	"Respect abundance.",
	"Does it need holes?",
	"Emphasize repetition.",
	"Emphasize flaws.",
	"Emphasize space.",
	"Emphasize difference.",
	"Into the impossible.",
	"Abandon normality.",
	"Make the middle part first.",
	"Could it be better if you did it in a different order?",
	"Use an old idea.",
	"Use an unacceptable color.",
	"Imagine it as a moving chain.",
	"Imagine it as a series of disconnected events.",
	"Read a review of art you've never experienced, recreate it immediately.",
	"Good simple is better than good complex.",
	"Sometimes what you spent the most time on ends up being the worst part.",
	"Sometimes the best part of a painting is the frame.",
	"The pursuit of perfection is a fool's errand.",
	"Do something boring here.",
	"Accept advice.",
	"Are there sections? Consider transitions.",
	"Take some of the pieces and treat them as a group.",
	"Get dirty with it.",
	"Choose a very cunning way of not being seen.",
	"Identify your recipes and abandon them.",
	"Set unnecessary constraints, adhere to them religiously.",
	"Take a walk.",
	"When faced with a choice, do both.",
	"True strength is displayed by modesty.",
	"What would your closest friend do?",
	"Give the game away.",
	"Make a sudden, destructive move.",
	"Overtly resist change.",
	"Immediately agree to all suggested change this time.",
	"Forget the specifics, embrace ambiguity.",
	"Observe your work from afar.",
]

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

const tacticEl = document.getElementById('tactic')
tacticEl.textContent = shuffledArray[currentIndex]

applyComplementaryTextColor(tacticEl)

document.getElementById('next-tactic').addEventListener('click', () => {
	currentIndex = (currentIndex + 1) % shuffledArray.length
	localStorage.setItem('currentIndex', String(currentIndex))
	tacticEl.textContent = shuffledArray[currentIndex]
})
