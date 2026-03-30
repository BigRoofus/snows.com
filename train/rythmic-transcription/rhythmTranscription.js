const BPM = 50;
const caesuraLength = 0.43;
const pitch = "A3";
const winningPoints = 10;
const losingPoints = 5;
let reloadWindowTime = 3750;
const reloadMultiplier = 1.25;

let correctSequence = [];
let userGuess = [];
let score = 0;

const noteDurations = [
    //{ symbol: "𝅝", value: 1 },       // Whole note
    { symbol: "𝅗𝅥", value: 0.5 },     // Half note
    { symbol: "𝅘𝅥", value: 0.25 },    // Quarter note
    { symbol: "𝅘𝅥𝅮", value: 0.125 }   // Eighth note
    //{ symbol: "𝅘𝅥𝅯", value: 0.0625 }   // Sixteenth note
];

window.onload = function () {
    correctSequence = correctSequence.length === 0 ? getRandomNoteSequence(1) : correctSequence;
    score = parseInt(sessionStorage.getItem("score")) || 0;
    document.getElementById('score').textContent = score;
    // for debugging
    // document.getElementById("correct-sequence").textContent = `correct seq: ${correctSequence.join("")}`;
};

function updateScore(newScore) {
    score = newScore;
    sessionStorage.setItem("score", score);
    document.getElementById('score').textContent = score;
}

function convertSymbolsToDurations(symbols) {
    const defaultValue = 0.25; // Default to quarter note if not found
    return symbols.map(symbol => {
        const note = noteDurations.find(note => note.symbol === symbol);
        return note ? note.value : defaultValue;
    });
}

function addSymbolToGuess(symbol) {
    userGuess.push(symbol);
    document.getElementById('guess').textContent = userGuess.join(" ");
}

function backspace() {
    userGuess.pop();
    document.getElementById('guess').textContent = userGuess.join("") === ""
        ? "?"
        : userGuess.join(" ");
}

function getRandomNoteSequence(measures) {
    let remaining = measures;
    const sequence = [];

    let isSameSequence = true;
    while (isSameSequence) {
        sequence.length = 0; // Reset the sequence array
        remaining = measures;

        // Build the sequence
        while (remaining > 0) {
            const validNotes = noteDurations.filter(note => note.value <= remaining);
            const randomIndex = Math.floor(Math.random() * validNotes.length);
            const chosenNote = validNotes[randomIndex];
            sequence.push(chosenNote.symbol);
            remaining -= chosenNote.value;  
        }
        
        // Check if the newly generated sequence is the same as the previous one
        if (sequence.join("") !== correctSequence) {
            isSameSequence = false;  // The sequence is different, break the loop
        }
    }

    return sequence;
}

function playSequence(symbolSequence) {
    const synth = new Tone.PolySynth(Tone.AMSynth).toDestination();
    const durations = convertSymbolsToDurations(symbolSequence);

    Tone.Transport.bpm.value = BPM;

    // Start from the current time
    let time = Tone.now();

    const caesura = (60 / BPM) * caesuraLength;  // (60 / BPM) * 0.25 = 16th note

    durations.forEach(duration => {
        synth.triggerAttackRelease(pitch, duration, time);
        time += duration + caesura;  // Pause after each note for more clarity
    });

    if (Tone.Transport.state !== "started") {
        Tone.Transport.start();
    }
}

function checkGuess() {
    const isCorrect = userGuess.join("") === correctSequence.join("");
    score += isCorrect ? winningPoints : -losingPoints;
    updateScore(score);

    sessionStorage.setItem("correctSequence", correctSequence);
    sessionStorage.setItem("userGuess", userGuess);
    sessionStorage.setItem("reloadWindowTime", reloadWindowTime);

    // WIN
    if (isCorrect) {
        correctSequence = getRandomNoteSequence(1);
        sessionStorage.setItem("winningPoints", winningPoints);
        window.location.href = "win.html";

    // LOSE
    } else {
        sessionStorage.setItem("losingPoints", losingPoints);
        sessionStorage.setItem("reloadMultiplier", reloadMultiplier);
        window.location.href = "lose.html";
    }
}

