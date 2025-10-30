ScrollReveal().reveal('.logo', {
	distance: '50px',
	origin: 'left',
	duration: 1000,
	easing: 'ease-in-out',
	delay: 200,
});

ScrollReveal().reveal('#start', {
	delay: 200,
	distance: '50px',
	origin: 'bottom',
	duration: 1000,
	easing: 'ease-in-out',
	scale: 0.6,
	delay: 200,

	beforeReveal: function (el) {
		el.style.transform = 'scale(0.8)';
	},
	afterReveal: function (el) {
		el.style.transform = 'scale(1)';
	},
});
ScrollReveal().reveal('#projects', {
	delay: 400,
	distance: '50px',
	origin: 'right',
	duration: 2000,
	easing: 'ease-in-out',
});
ScrollReveal().reveal('#contact', {
	delay: 600,
	distance: '50px',
	origin: 'bottom',
	duration: 2000,
	easing: 'ease-in-out',
});

ScrollReveal().reveal('#skills', {
	delay: 600,
	distance: '50px',
	origin: 'bottom',
	duration: 2000,
	easing: 'ease-in-out',
	beforeReveal: function (el) {
		el.style.transform = 'translateY(50px)';
	},
	afterReveal: function (el) {
		el.style.transform = 'translateY(0)';
	},
});

ScrollReveal().reveal('header h1', {
	delay: 100,
	//distance = width of header window
	distance: '1000px',
	origin: 'left',
	duration: 4000,
	// from near logo come out and scale up to be fixed
	scale: 0.1,
	easing: 'ease-in-out',
	beforeReveal: function (el) {
		el.style.transform = 'scale(0.5) translateZ(-100px) rotateZ(160deg)';
		el.style.color = '#ae4203';
	},
	afterReveal: function (el) {
		el.style.transform = 'scale(1) translateZ(0) rotateZ(0)';
		el.style.color = 'transparent';
	},
	// FROM LEFT COME OUT
	beforeReveal: function (el) {
		el.style.transform = 'scale(0.5) translateZ(-100px) rotateY(160deg)';
		el.style.color = '#ae4203';
	},
	afterReveal: function (el) {
		el.style.transform = 'scale(1) translateZ(0) rotateY(0)';
		el.style.color = 'transparent';
	},
});

const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight * 0.7; // Adjust height to fit the header
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const STAR_COUNT = 600;
const STAR_COLORS = ['#fff', 'gold', 'orange', '#ffd6fa'];
const centerX = () => canvas.width / 2;
const centerY = () => canvas.height / 2;
const orbitRadius = Math.min(canvas.width, canvas.height) * 0.7;

const stars = Array.from({ length: STAR_COUNT }, (_, i) => {
	// Randomize both angle and orbit radius for more scattered effect
	const angle = Math.random() * 2 * Math.PI;
	// Occasionally make some stars larger (up to 5)
	let radius = Math.random() * 1.2 + 0.5;
	if (Math.random() < 0.08) {
		// ~8% chance for a big star
		radius = Math.random() * 3 + 2; // between 2 and 5
	}
	return {
		angle,
		radius,
		color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
		twinkle: Math.random() * Math.PI * 8,
		speed: 0.002 + Math.random() * 0.003, // angular speed
		orbit: orbitRadius * (0.7 + Math.random() * 0.3),
		// Fixed vertical offset for each star (so each star stays on its line)
		offsetY: (Math.random() - 0.5) * orbitRadius * 0.8,
		// No horizontal drift, stars move only along their orbit
	};
});

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	stars.forEach((star) => {
		// Update star angle for movement
		star.angle += star.speed;
		// Twinkle effect
		const twinkle = 0.7 + 0.3 * Math.sin(Date.now() * 0.002 + star.twinkle);
		// Calculate star position
		const x = centerX() + Math.cos(star.angle) * star.orbit;
		const y = centerY() + Math.sin(star.angle) * star.orbit + star.offsetY;
		ctx.beginPath();
		ctx.arc(x, y, star.radius * twinkle, 0, 2 * Math.PI);
		ctx.fillStyle = star.color;
		ctx.globalAlpha = 0.7 * twinkle;
		ctx.fill();
		ctx.globalAlpha = 1;
	});
	requestAnimationFrame(animate);
}

animate();
