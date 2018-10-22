const synth = window.speechSynthesis;

// DOM elements

const txtForm = document.querySelector('form');
const txtInput = document.getElementById('txt-input');
const pitchVal = document.getElementById('pitch-val');
const rateVal = document.getElementById('rate-val');
const rate = document.getElementById('rate');
const pitch = document.getElementById('pitch');
const selectVoice = document.getElementById('voice-select');

let voices = [];

const getVoices = () => {
	voices = synth.getVoices();

	voices.forEach(voice => {
		// Create option element
		const option = document.createElement('option');
		// Fill option with voice type and accent
		option.textContent = voice.name + '(' + voice.lang + ')';
		// Set option attributes
		option.setAttribute('data-lang', voice.lang);
		option.setAttribute('data-name', voice.name);
		selectVoice.appendChild(option);
	});
};

getVoices();

if (synth.onvoiceschanged !== undefined) {
	synth.onvoiceschanged = getVoices;
}


// Call the voice from da sky
const speak = () => {
	// Check if speaking
	if (synth.speaking) {
		console.error('Already speaking');
		return
	}
	if (txtInput.value !== '') {
		// Get speak text
		const speakText = new SpeechSynthesisUtterance(txtInput.value);
		// Speak end to console
		speakText.onend = e => {
			console.log('Done speaking');
		}
		// Speak error to console
		speakText.onerror = e => {
			console.error('Something went wrong');
		}
		// Selected voice
		const selectedVoice = selectVoice.selectedOptions[0].getAttribute('data-name');

		// Loop through all voices
		voices.forEach(voice => {
			if (voice.name === selectedVoice) {
				speakText.voice = voice;
			}
		});

		// Set pitch and rate
		speakText.rate = rate.value;
		speakText.pitch = pitch.value;
		// Speak
		synth.speak(speakText);
	}
};

// Event listeners

txtForm.addEventListener('submit', e => {
	e.preventDefault();
	speak();
	txtInput.blur();
});

// Submit on Enter
txtForm.addEventListener('keypress', e => {
	let key = e.which || e.keyCode;
	if (key === 13) {
		e.preventDefault();
		speak();
		txtInput.blur();
	}
});

rate.addEventListener('change', e => rateVal.textContent = rate.value);
pitch.addEventListener('change', e => pitchVal.textContent = pitch.value);

selectVoice.addEventListener('change', e => speak());

