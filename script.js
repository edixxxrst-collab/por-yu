const overlay = document.getElementById('overlay');
const mailButton = document.getElementById('mailButton');
const closeLetter = document.getElementById('closeLetter');
const heartButton = document.getElementById('heartButton');
const replayButton = document.getElementById('replayButton');
const toast = document.getElementById('toast');
const scene = document.getElementById('scene');
const plantScene = document.getElementById('plantScene');
const letterTextElements = document.querySelectorAll('.letter-title, #letterText, .signature, .letter-footer span');
let toastTimer;

function animateLetterText() {
  letterTextElements.forEach(element => {
    const text = element.textContent || '';
    const fragment = document.createDocumentFragment();
    let characterIndex = 0;
    const words = text.match(/\S+|\s+/gu) || [];

    words.forEach(word => {
      if (/^\s+$/u.test(word)) {
        fragment.appendChild(document.createTextNode(word));
        return;
      }

      const wordSpan = document.createElement('span');
      wordSpan.className = 'note-word';
      Array.from(word).forEach(character => {
        const span = document.createElement('span');
        span.className = 'note-letter-char';
        span.setAttribute('aria-hidden', 'true');
        span.style.animationDelay = `${characterIndex * 15}ms`;
        span.textContent = character;
        wordSpan.appendChild(span);
        characterIndex++;
      });
      fragment.appendChild(wordSpan);
    });

    element.setAttribute('aria-label', text);
    element.replaceChildren(fragment);
  });
}

function replayFlower() {
  plantScene.classList.remove('is-growing');
  void plantScene.offsetWidth;
  plantScene.classList.add('is-growing');
}

replayFlower();
replayButton.addEventListener('click', replayFlower);

function openLetter() {
  animateLetterText();
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
}
function hideLetter() {
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
}
mailButton.addEventListener('click', openLetter);
closeLetter.addEventListener('click', hideLetter);
overlay.addEventListener('click', event => {
  if (event.target === overlay) hideLetter();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') hideLetter();
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1900);
}
function makeFirework(x, y) {
  const colors = ['#ff7180', '#ed3348', '#a9c8ff', '#3478f6', '#ffffff'];
  const particleCount = 16;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.18;
    const distance = 42 + Math.random() * 54;
    particle.className = 'firework-particle';
    particle.setAttribute('aria-hidden', 'true');
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
    particle.style.setProperty('--particle-color', colors[Math.floor(Math.random() * colors.length)]);
    scene.appendChild(particle);
    setTimeout(() => particle.remove(), 950);
  }
}

function launchFirework(x, targetY) {
  const rocket = document.createElement('span');
  const launchY = scene.clientHeight - 55;
  rocket.className = 'firework-rocket';
  rocket.setAttribute('aria-hidden', 'true');
  rocket.style.left = `${x}px`;
  rocket.style.top = `${launchY}px`;
  rocket.style.setProperty('--flight-distance', `${targetY - launchY}px`);
  scene.appendChild(rocket);

  setTimeout(() => {
    rocket.remove();
    makeFirework(x, targetY);
  }, 700);
}

heartButton.addEventListener('click', () => {
  for (let i = 0; i < 3; i++) {
    const x = scene.clientWidth * (0.25 + Math.random() * 0.5);
    const targetY = scene.clientHeight * (0.28 + Math.random() * 0.28);
    setTimeout(() => launchFirework(x, targetY), i * 220);
  }
  showToast('A little firework for you! ✦');
});
