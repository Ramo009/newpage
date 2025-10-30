ScrollReveal().reveal('.logo', {
	distance: '50px',
	origin: 'left',
	duration: 500,
	easing: 'ease-in-out',
	delay: 200,
});

ScrollReveal().reveal('#start', {
	delay: 200,
	distance: '50px',
	origin: 'bottom',
	duration: 500,
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
	duration: 500,
	easing: 'ease-in-out',
});
ScrollReveal().reveal('#contact', {
	delay: 600,
	distance: '50px',
	origin: 'bottom',
	duration: 500,
	easing: 'ease-in-out',
});

ScrollReveal().reveal('#skills', {
	delay: 600,
	distance: '50px',
	origin: 'bottom',
	duration: 500,
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
	duration: 500,
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

// AI Chat Functionality
let chatOpen = false;

function toggleChat() {
	const chatContainer = document.getElementById('chat-container');
	const chatIcon = document.getElementById('chat-icon');

	chatOpen = !chatOpen;

	if (chatOpen) {
		chatContainer.classList.add('show');
		chatIcon.name = 'close-outline';
	} else {
		chatContainer.classList.remove('show');
		chatIcon.name = 'chatbubble-outline';
	}
}

function handleChatInput(event) {
	if (event.key === 'Enter') {
		sendMessage();
	}
}

async function sendMessage() {
	const chatInput = document.getElementById('chat-input');
	const chatMessages = document.getElementById('chat-messages');
	const message = chatInput.value.trim();

	console.log('User message:', message); // Debug log

	if (!message) return;

	// Add user message
	addMessage(message, 'user');
	chatInput.value = '';

	// Show typing indicator
	showTypingIndicator();

	try {
		// Get AI response
		const response = await getAIResponse(message);
		console.log('AI response:', response); // Debug log
		hideTypingIndicator();
		addMessage(response, 'bot');
	} catch (error) {
		console.error('AI Error:', error); // Debug log
		hideTypingIndicator();
		addMessage(
			'Sorry, I encountered an error. Please try again later.',
			'bot',
		);
	}

	// Scroll to bottom
	chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessage(text, sender) {
	const chatMessages = document.getElementById('chat-messages');
	const messageDiv = document.createElement('div');
	messageDiv.className = `message ${sender}-message`;
	messageDiv.innerHTML = `<p>${text}</p>`;
	chatMessages.appendChild(messageDiv);
	chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
	const chatMessages = document.getElementById('chat-messages');
	const typingDiv = document.createElement('div');
	typingDiv.className = 'message bot-message typing-indicator';
	typingDiv.id = 'typing-indicator';
	typingDiv.innerHTML =
		'<p><span class="dot"></span><span class="dot"></span><span class="dot"></span></p>';
	chatMessages.appendChild(typingDiv);
	chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
	const typingIndicator = document.getElementById('typing-indicator');
	if (typingIndicator) {
		typingIndicator.remove();
	}
}

// AI Response Function - Using a simple rule-based chatbot
async function getAIResponse(message) {
	console.log('getAIResponse called with:', message); // Debug log
	const lowerMessage = message.toLowerCase();
	console.log('Lowercase message:', lowerMessage); // Debug log

	// Quick test responses to verify the AI is working
	if (lowerMessage === 'test') {
		return '🎉 AI is working perfectly! The test response is successful!';
	}

	if (lowerMessage === 'hello') {
		return '👋 Hello! I can see your message clearly. The AI is responding correctly!';
	}

	// Programming-related responses
	if (
		lowerMessage.includes('html') ||
		lowerMessage.includes('web') ||
		lowerMessage.includes('website') ||
		lowerMessage.includes('markup')
	) {
		return "HTML is the backbone of web development! It's a markup language used to structure content on web pages. Would you like to know about HTML tags, semantic elements, or how to get started?";
	}

	if (
		lowerMessage.includes('css') ||
		lowerMessage.includes('style') ||
		lowerMessage.includes('design') ||
		lowerMessage.includes('layout') ||
		lowerMessage.includes('color')
	) {
		return 'CSS is fantastic for styling web pages! It controls the visual presentation - colors, layouts, animations, and responsive design. Are you interested in learning about Flexbox, Grid, or CSS animations?';
	}

	if (
		lowerMessage.includes('javascript') ||
		lowerMessage.includes('js') ||
		lowerMessage.includes('frontend') ||
		lowerMessage.includes('interactive')
	) {
		return "JavaScript brings web pages to life! It's a versatile programming language for both frontend and backend development. You can create interactive elements, handle user events, and even build entire applications. What aspect of JavaScript interests you most?";
	}

	if (
		lowerMessage.includes('nodejs') ||
		lowerMessage.includes('node.js') ||
		lowerMessage.includes('backend') ||
		lowerMessage.includes('server') ||
		lowerMessage.includes('api')
	) {
		return "Node.js is a powerful JavaScript runtime for building server-side applications! It's great for creating APIs, real-time applications, and more. Would you like to learn about setting up a Node.js project or working with Express?";
	}

	if (lowerMessage.includes('python')) {
		return "While Python is great, I'd recommend Node.js for modern web development! Node.js lets you use JavaScript for both frontend and backend development, creating a unified development experience. Would you like to learn about Node.js instead?";
	}

	if (
		lowerMessage.includes('react') ||
		lowerMessage.includes('vue') ||
		lowerMessage.includes('angular') ||
		lowerMessage.includes('framework')
	) {
		return 'JavaScript frameworks like React, Vue, and Angular are excellent for building modern web applications! They help organize your code and create reusable components. Which framework interests you, or would you like me to recommend one for beginners?';
	}

	if (
		lowerMessage.includes('database') ||
		lowerMessage.includes('mongodb') ||
		lowerMessage.includes('mysql') ||
		lowerMessage.includes('data')
	) {
		return "Databases are essential for storing and managing application data! For Node.js, I'd recommend starting with MongoDB (NoSQL) or MySQL (SQL). Which type of data storage are you interested in learning about?";
	}

	if (
		lowerMessage.includes('git') ||
		lowerMessage.includes('github') ||
		lowerMessage.includes('version control')
	) {
		return 'Git and GitHub are essential tools for developers! Git helps you track changes in your code, while GitHub lets you store and collaborate on projects. Would you like to learn about basic Git commands or setting up your first repository?';
	}

	if (
		lowerMessage.includes('responsive') ||
		lowerMessage.includes('mobile') ||
		lowerMessage.includes('tablet') ||
		lowerMessage.includes('screen')
	) {
		return 'Responsive design ensures your website looks great on all devices! You can use CSS media queries, Flexbox, and CSS Grid to create layouts that adapt to different screen sizes. Want to learn about mobile-first design principles?';
	}

	if (
		lowerMessage.includes('project') ||
		lowerMessage.includes('build') ||
		lowerMessage.includes('create') ||
		lowerMessage.includes('make')
	) {
		return 'Building projects is the best way to learn programming! Start with simple projects like a personal website, calculator, or to-do list. Each project teaches new concepts and builds your portfolio. What type of project interests you?';
	}

	if (
		lowerMessage.includes('portfolio') ||
		lowerMessage.includes('showcase') ||
		lowerMessage.includes('resume')
	) {
		return 'A strong portfolio is crucial for developers! Include 3-5 projects that showcase different skills - a responsive website, an interactive app, and maybe an API project. Make sure to include live demos and source code links. Want tips on what projects to include?';
	}

	if (
		lowerMessage.includes('job') ||
		lowerMessage.includes('career') ||
		lowerMessage.includes('hire') ||
		lowerMessage.includes('interview')
	) {
		return 'The tech industry offers amazing career opportunities! Focus on building a strong portfolio, contributing to open source, networking, and practicing coding challenges. What type of developer role interests you most - frontend, backend, or full-stack?';
	}

	if (
		lowerMessage.includes('beginner') ||
		lowerMessage.includes('start') ||
		lowerMessage.includes('begin') ||
		lowerMessage.includes('new') ||
		lowerMessage.includes('first time')
	) {
		return "Welcome to programming! Here's my beginner roadmap: 1) Start with HTML/CSS for web basics, 2) Learn JavaScript for interactivity, 3) Practice with small projects, 4) Learn Node.js for backend, 5) Build a full portfolio. What's your main goal - websites, apps, or something else?";
	}

	if (
		lowerMessage.includes('learn') ||
		lowerMessage.includes('study') ||
		lowerMessage.includes('tutorial') ||
		lowerMessage.includes('course')
	) {
		return "There are many great ways to learn programming! I recommend: freeCodeCamp (free), MDN docs (reference), YouTube tutorials, and building projects. What's your preferred learning style - video tutorials, interactive coding, or reading documentation?";
	}

	if (
		lowerMessage.includes('difficult') ||
		lowerMessage.includes('hard') ||
		lowerMessage.includes('struggling') ||
		lowerMessage.includes('stuck')
	) {
		return "Don't worry - every programmer feels stuck sometimes! Break problems into smaller pieces, use console.log() to debug, search Stack Overflow, and don't hesitate to ask for help. What specific topic or problem are you struggling with?";
	}

	if (
		lowerMessage.includes('time') ||
		lowerMessage.includes('long') ||
		lowerMessage.includes('quickly') ||
		lowerMessage.includes('fast')
	) {
		return "Learning programming takes time - typically 6 months to a year for job readiness if you practice consistently. Focus on fundamentals first, build projects regularly, and don't rush. Quality practice beats speed! What's your target timeline?";
	}

	if (
		lowerMessage.includes('money') ||
		lowerMessage.includes('salary') ||
		lowerMessage.includes('pay') ||
		lowerMessage.includes('income')
	) {
		return "Programming can be very rewarding financially! Entry-level developers typically start at $50k-70k, with experienced developers earning $80k-150k+ depending on location and skills. Focus on building skills first - the money will follow! Any specific role you're curious about?";
	}

	if (
		lowerMessage.includes('freelance') ||
		lowerMessage.includes('freelancer') ||
		lowerMessage.includes('clients')
	) {
		return 'Freelancing can be great for developers! Start by building a strong portfolio, learning client communication skills, and understanding project management. Platforms like Upwork and Fiverr can help you find first clients. What type of freelance work interests you?';
	}

	if (
		lowerMessage.includes('ai') ||
		lowerMessage.includes('artificial intelligence') ||
		lowerMessage.includes('machine learning')
	) {
		return 'AI is an exciting field! While traditionally Python-focused, JavaScript now has great AI libraries too like TensorFlow.js. You can build AI features right into web apps! Are you interested in chatbots, image recognition, or something else?';
	}

	if (
		lowerMessage.includes('hello') ||
		lowerMessage.includes('hi') ||
		lowerMessage.includes('hey') ||
		lowerMessage.includes('greetings')
	) {
		return "Hello! I'm your AI programming assistant! 👋 I'm here to help with web development, Node.js, career advice, project ideas, and learning guidance. What programming topic would you like to explore today?";
	}

	if (
		lowerMessage.includes('help') ||
		lowerMessage.includes('assist') ||
		lowerMessage.includes('support')
	) {
		return "I'm here to help you succeed in programming! 🚀 I can assist with: 🌐 Web Development (HTML, CSS, JS), ⚡ Node.js backend development, 💡 Project ideas & planning, 🎯 Learning roadmaps, 💼 Career guidance, 🔧 Debugging tips. What would you like help with?";
	}

	if (
		lowerMessage.includes('thank') ||
		lowerMessage.includes('thanks') ||
		lowerMessage.includes('appreciate')
	) {
		return "You're very welcome! I'm happy to help you on your programming journey. Feel free to ask me anything else - whether it's technical questions, career advice, or project ideas. Good luck with your coding! 🎉";
	}

	if (
		lowerMessage.includes('error') ||
		lowerMessage.includes('bug') ||
		lowerMessage.includes('debug') ||
		lowerMessage.includes('fix')
	) {
		return 'Debugging is a crucial skill! Try these steps: 1) Read error messages carefully, 2) Use console.log() to check values, 3) Check syntax and typos, 4) Search the error on Stack Overflow, 5) Use browser dev tools. What kind of error are you encountering?';
	}

	if (
		lowerMessage.includes('hosting') ||
		lowerMessage.includes('deploy') ||
		lowerMessage.includes('publish') ||
		lowerMessage.includes('live')
	) {
		return 'Ready to show your project to the world? Great! For static sites, try Netlify or GitHub Pages (free). For Node.js apps, consider Heroku, Vercel, or Railway. Make sure your code is on GitHub first. Need help with deployment steps?';
	}

	// Default responses for unmatched queries - now more varied and helpful
	const defaultResponses = [
		"That's an interesting question! Programming covers so many areas. Are you curious about web development, mobile apps, databases, or something else specific?",
		"I'd love to help you with that! Could you tell me more? For example, are you looking for code examples, learning resources, or career advice?",
		'Great question! I specialize in web development with HTML, CSS, JavaScript, and Node.js. What specific programming topic can I help you explore?',
		"Programming is such a vast and exciting field! Whether you're interested in building websites, APIs, or learning new technologies, I'm here to help. What would you like to know more about?",
		"I'm here to make programming easier for you! Feel free to ask about specific technologies, request code examples, or get advice on learning paths. What's on your mind?",
	];

	return defaultResponses[
		Math.floor(Math.random() * defaultResponses.length)
	];
}

// AI Code Generator Functions
async function generateCode() {
	const language = document.getElementById('language-select').value;
	const request = document.getElementById('code-request').value.trim();
	const output = document.getElementById('generated-code');

	if (!request) {
		output.innerHTML = 'Please describe what code you need!';
		return;
	}

	output.innerHTML = '<div class="loading">Generating code...</div>';

	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const code = getCodeSnippet(language, request);
	output.innerHTML = `<pre><code>${code}</code></pre>`;
}

function getCodeSnippet(language, request) {
	const lowerRequest = request.toLowerCase();

	const snippets = {
		html: {
			navigation: `<nav class="navbar">
  <div class="nav-brand">
    <a href="#home">YourLogo</a>
  </div>
  <ul class="nav-links">
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#services">Services</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>`,
			form: `<form class="contact-form">
  <div class="form-group">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
  </div>
  <div class="form-group">
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
  </div>
  <div class="form-group">
    <label for="message">Message:</label>
    <textarea id="message" name="message" rows="5" required></textarea>
  </div>
  <button type="submit">Send Message</button>
</form>`,
			card: `<div class="card">
  <img src="image.jpg" alt="Card Image" class="card-img">
  <div class="card-content">
    <h3 class="card-title">Card Title</h3>
    <p class="card-description">This is a description of the card content.</p>
    <a href="#" class="card-button">Read More</a>
  </div>
</div>`,
		},
		css: {
			responsive: `/* Mobile First Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 10px;
    font-size: 14px;
  }
}

@media (min-width: 769px) {
  .container {
    padding: 20px;
    font-size: 16px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }
}`,
			flexbox: `.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.flex-item {
  flex: 1;
  min-width: 250px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}`,
			animation: `@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animated-element {
  animation: fadeInUp 0.6s ease-out;
}

.hover-effect {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-effect:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}`,
			grid: `/* CSS Grid Layout */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.grid-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Advanced Grid */
.layout-grid {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}`,
			button: `/* Modern Button Styles */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}`,
		},
		javascript: {
			dom: `// DOM Manipulation Examples
const element = document.getElementById('myElement');
const elements = document.querySelectorAll('.my-class');

// Add event listener
element.addEventListener('click', function() {
  this.classList.toggle('active');
});

// Create new element
const newDiv = document.createElement('div');
newDiv.textContent = 'Hello World!';
newDiv.className = 'dynamic-content';
document.body.appendChild(newDiv);`,
			fetch: `// Fetch API Example
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    console.log('Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Usage
fetchData().then(data => {
  // Handle the data
}).catch(error => {
  // Handle errors
});`,
			validation: `// Form Validation
function validateForm(formData) {
  const errors = {};
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Password validation
  if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  
  // Required fields
  const requiredFields = ['name', 'email', 'password'];
  requiredFields.forEach(field => {
    if (!formData[field] || formData[field].trim() === '') {
      errors[field] = \`\${field.charAt(0).toUpperCase() + field.slice(1)} is required\`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}`,
			array: `// Array Methods Examples
const numbers = [1, 2, 3, 4, 5];

// Map - transform each element
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Filter - get elements that match condition
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4]

// Reduce - combine all elements
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 15

// Find - get first matching element
const found = numbers.find(num => num > 3);
console.log(found); // 4`,
			function: `// Function Examples
// Regular function
function calculateArea(width, height) {
    return width * height;
}

// Arrow function
const calculateVolume = (width, height, depth) => {
    return width * height * depth;
};

// Async function
async function processData(data) {
    try {
        const processed = await performAsyncOperation(data);
        return processed;
    } catch (error) {
        console.error('Processing failed:', error);
        throw error;
    }
}

// Higher-order function
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
console.log(double(5)); // 10`,
		},
		nodejs: {
			function: `// Node.js Function Example
function greetUser(name, greeting = "Hello") {
    /**
     * Greets a user with a custom message
     * @param {string} name - The user's name
     * @param {string} greeting - Custom greeting (default: "Hello")
     * @returns {string} Formatted greeting message
     */
    return \`\${greeting}, \${name}! Welcome to our application.\`;
}

// Example usage
const userGreeting = greetUser("Alice");
const customGreeting = greetUser("Bob", "Hi there");
console.log(userGreeting); // Output: Hello, Alice! Welcome to our application.

// Export for use in other modules
module.exports = { greetUser };`,
			class: `// Node.js Class Example
class Student {
    constructor(name, age, studentId) {
        this.name = name;
        this.age = age;
        this.studentId = studentId;
        this.grades = [];
    }
    
    addGrade(subject, grade) {
        /** Add a grade for a subject */
        this.grades.push({ subject, grade });
    }
    
    getAverageGrade() {
        /** Calculate and return the average grade */
        if (this.grades.length === 0) return 0;
        const sum = this.grades.reduce((acc, g) => acc + g.grade, 0);
        return sum / this.grades.length;
    }
    
    toString() {
        return \`Student: \${this.name} (ID: \${this.studentId})\`;
    }
}

// Usage
const student = new Student("Alice Johnson", 20, "S12345");
student.addGrade("Math", 85);
student.addGrade("Science", 92);
console.log(\`Average: \${student.getAverageGrade().toFixed(1)}\`);

module.exports = Student;`,
			server: `// Node.js Express Server Example
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Node.js API!' });
});

app.get('/api/users', (req, res) => {
    const users = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' }
    ];
    res.json(users);
});

app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    const newUser = { id: Date.now(), name, email };
    res.status(201).json(newUser);
});

// Start server
app.listen(PORT, () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
			file: `// Node.js File Operations Example
const fs = require('fs').promises;
const path = require('path');

async function readJsonFile(filename) {
    /** Read and parse a JSON file */
    try {
        const filePath = path.join(__dirname, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(\`File '\${filename}' not found.\`);
            return null;
        } else if (error instanceof SyntaxError) {
            console.log(\`Invalid JSON in file '\${filename}'.\`);
            return null;
        }
        throw error;
    }
}

async function writeJsonFile(filename, data) {
    /** Write data to a JSON file */
    try {
        const filePath = path.join(__dirname, filename);
        const jsonData = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, jsonData, 'utf8');
        console.log(\`Data saved to '\${filename}'\`);
    } catch (error) {
        console.error(\`Error writing file: \${error.message}\`);
        throw error;
    }
}

// Example usage
async function main() {
    const data = { users: [{ name: "Alice", age: 25 }] };
    await writeJsonFile("users.json", data);
    const loadedData = await readJsonFile("users.json");
    console.log('Loaded data:', loadedData);
}

main().catch(console.error);`,
		},
	};

	// Find matching snippet using smart keyword matching
	const keywordMap = {
		html: {
			navigation: [
				'nav',
				'navbar',
				'menu',
				'navigation',
				'header menu',
				'top menu',
			],
			form: [
				'form',
				'contact',
				'input',
				'contact form',
				'login',
				'signup',
				'register',
			],
			card: ['card', 'box', 'item', 'product', 'service card'],
			hero: ['hero', 'banner', 'landing', 'main section', 'jumbotron'],
			gallery: ['gallery', 'portfolio', 'images', 'grid', 'showcase'],
			footer: ['footer', 'bottom', 'copyright', 'social links'],
			pricing: ['pricing', 'plans', 'subscription', 'price table'],
		},
		css: {
			responsive: [
				'responsive',
				'mobile',
				'media query',
				'breakpoint',
				'device',
			],
			flexbox: ['flex', 'flexbox', 'layout', 'align', 'justify'],
			animation: [
				'animation',
				'transition',
				'hover',
				'effect',
				'keyframe',
			],
			grid: ['grid', 'css grid', 'layout', 'columns', 'rows'],
			button: ['button', 'btn', 'click', 'hover button'],
		},
		javascript: {
			dom: ['dom', 'element', 'query', 'select', 'click', 'event'],
			fetch: ['fetch', 'api', 'ajax', 'request', 'http', 'data'],
			validation: ['validate', 'form validation', 'check', 'error'],
			array: ['array', 'list', 'loop', 'map', 'filter'],
			function: ['function', 'method', 'call', 'return'],
		},
		nodejs: {
			server: ['server', 'express', 'api', 'backend', 'route'],
			function: ['function', 'method', 'export', 'module'],
			class: ['class', 'object', 'constructor', 'method'],
			file: ['file', 'read', 'write', 'json', 'fs'],
		},
	};

	// Smart matching: check if any keyword matches
	for (const [snippetKey, snippet] of Object.entries(
		snippets[language] || {},
	)) {
		const keywords = keywordMap[language]?.[snippetKey] || [snippetKey];

		for (const keyword of keywords) {
			if (lowerRequest.includes(keyword)) {
				console.log(
					`Matched "${lowerRequest}" with keyword "${keyword}" for snippet "${snippetKey}"`,
				);
				return snippet;
			}
		}
	}

	// Default snippets for each language
	const defaults = {
		html: `<!-- Basic HTML Template -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${request}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Welcome to My Site</h1>
    </header>
    <main>
        <p>Content for: ${request}</p>
    </main>
    <script src="script.js"></script>
</body>
</html>`,
		css: `/* CSS for: ${request} */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.element {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.element:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}`,
		javascript: `// JavaScript for: ${request}
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - ${request}');
    
    // Your code here
    function handleUserInteraction() {
        // Implementation for ${request}
        console.log('Handling: ${request}');
    }
    
    // Event listeners
    document.querySelectorAll('.interactive').forEach(element => {
        element.addEventListener('click', handleUserInteraction);
    });
});`,
		nodejs: `// Node.js script for: ${request}
const express = require('express');

function main() {
    /**
     * Main function for: ${request}
     */
    console.log("Starting Node.js application: ${request}");
    
    // Your implementation here
    const result = processData();
    console.log(\`Result: \${result}\`);
}

function processData() {
    /**
     * Process data for: ${request}
     */
    // Implementation goes here
    return "Processing complete";
}

// Export functions for use in other modules
module.exports = {
    main,
    processData
};

// Run if this file is executed directly
if (require.main === module) {
    main();
}`,
	};

	return (
		defaults[language] ||
		`// Code snippet for: ${request}\n// Implementation needed for ${language}`
	);
}

async function generateLearningPath() {
	const goal = document.getElementById('learning-goal').value.trim();
	const output = document.getElementById('learning-path');

	if (!goal) {
		output.innerHTML = 'Please tell us what you want to learn!';
		return;
	}

	output.innerHTML =
		'<div class="loading">Creating your learning path...</div>';

	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 1500));

	const path = getLearningPath(goal);
	output.innerHTML = path;
}

function getLearningPath(goal) {
	const lowerGoal = goal.toLowerCase();

	// Frontend/Web Development
	if (
		lowerGoal.includes('web') ||
		lowerGoal.includes('frontend') ||
		lowerGoal.includes('website') ||
		lowerGoal.includes('html') ||
		lowerGoal.includes('css') ||
		lowerGoal.includes('javascript')
	) {
		return `
<h4>🌐 Web Development Learning Path</h4>
<ul>
  <li><strong>Week 1-2:</strong> HTML Basics - Structure, tags, forms, semantic HTML</li>
  <li><strong>Week 3-4:</strong> CSS Fundamentals - Styling, layout, responsive design</li>
  <li><strong>Week 5-6:</strong> JavaScript Basics - Variables, functions, DOM manipulation</li>
  <li><strong>Week 7-8:</strong> Advanced CSS - Flexbox, Grid, animations, SASS</li>
  <li><strong>Week 9-10:</strong> JavaScript Projects - Interactive websites, API calls, ES6+</li>
  <li><strong>Week 11-12:</strong> Framework Introduction - React or Vue.js basics</li>
  <li><strong>Week 13-14:</strong> Build Portfolio - 3-5 projects showcasing your skills</li>
</ul>
<p><strong>Resources:</strong> MDN Docs, freeCodeCamp, CSS-Tricks, JavaScript.info</p>
<p><strong>First Project Ideas:</strong> Personal portfolio, weather app, todo list</p>
`;
	}

	// Backend/Node.js Development
	if (
		lowerGoal.includes('nodejs') ||
		lowerGoal.includes('node.js') ||
		lowerGoal.includes('backend') ||
		lowerGoal.includes('server') ||
		lowerGoal.includes('api')
	) {
		return `
<h4>⚡ Node.js Backend Development Learning Path</h4>
<ul>
  <li><strong>Week 1-2:</strong> JavaScript Fundamentals - ES6+, async/await, modules</li>
  <li><strong>Week 3-4:</strong> Node.js Basics - Runtime, npm, file system, modules</li>
  <li><strong>Week 5-6:</strong> Express.js Framework - Routing, middleware, REST APIs</li>
  <li><strong>Week 7-8:</strong> Database Integration - MongoDB/MySQL, Mongoose/Sequelize</li>
  <li><strong>Week 9-10:</strong> Authentication & Security - JWT, bcrypt, validation</li>
  <li><strong>Week 11-12:</strong> Testing & Deployment - Jest, Docker, AWS/Heroku</li>
  <li><strong>Week 13-14:</strong> Full-Stack Project - Complete web application</li>
</ul>
<p><strong>Resources:</strong> Node.js docs, Express.js guide, MongoDB University</p>
<p><strong>Project Ideas:</strong> Blog API, e-commerce backend, chat application</p>
`;
	}

	// Full-Stack Development
	if (
		lowerGoal.includes('fullstack') ||
		lowerGoal.includes('full-stack') ||
		lowerGoal.includes('full stack') ||
		lowerGoal.includes('complete developer')
	) {
		return `
<h4>🚀 Full-Stack Development Learning Path</h4>
<ul>
  <li><strong>Month 1:</strong> Frontend Basics - HTML, CSS, JavaScript fundamentals</li>
  <li><strong>Month 2:</strong> Frontend Advanced - React/Vue, state management, API calls</li>
  <li><strong>Month 3:</strong> Backend Basics - Node.js, Express.js, REST APIs</li>
  <li><strong>Month 4:</strong> Database & Auth - MongoDB/PostgreSQL, JWT, security</li>
  <li><strong>Month 5:</strong> DevOps Basics - Git, testing, deployment, CI/CD</li>
  <li><strong>Month 6:</strong> Capstone Project - Full-stack application with all features</li>
</ul>
<p><strong>Resources:</strong> The Odin Project, Full Stack Open, freeCodeCamp</p>
<p><strong>Final Project:</strong> Social media app, e-commerce site, or SaaS tool</p>
`;
	}

	// React Development
	if (
		lowerGoal.includes('react') ||
		lowerGoal.includes('reactjs') ||
		lowerGoal.includes('react.js')
	) {
		return `
<h4>⚛️ React Development Learning Path</h4>
<ul>
  <li><strong>Week 1-2:</strong> JavaScript Prerequisites - ES6+, destructuring, promises</li>
  <li><strong>Week 3-4:</strong> React Basics - Components, JSX, props, state</li>
  <li><strong>Week 5-6:</strong> React Hooks - useState, useEffect, custom hooks</li>
  <li><strong>Week 7-8:</strong> State Management - Context API, Redux Toolkit</li>
  <li><strong>Week 9-10:</strong> React Router - Navigation, dynamic routes, guards</li>
  <li><strong>Week 11-12:</strong> Testing & Best Practices - Jest, React Testing Library</li>
  <li><strong>Week 13-14:</strong> Real Projects - Build 2-3 React applications</li>
</ul>
<p><strong>Resources:</strong> React.dev docs, React course by Kent C. Dodds, Scrimba React</p>
<p><strong>Project Ideas:</strong> Movie database app, expense tracker, blog platform</p>
`;
	}

	if (
		lowerGoal.includes('nodejs') ||
		lowerGoal.includes('node.js') ||
		lowerGoal.includes('backend')
	) {
		return `
<h4>⚡ Node.js Programming Learning Path</h4>
<ul>
  <li><strong>Week 1-2:</strong> JavaScript Fundamentals - Variables, functions, ES6+ features</li>
  <li><strong>Week 3-4:</strong> Node.js Basics - Runtime, modules, npm package management</li>
  <li><strong>Week 5-6:</strong> Express.js Framework - Routing, middleware, REST APIs</li>
  <li><strong>Week 7-8:</strong> Database Integration - MongoDB, MySQL, database design</li>
  <li><strong>Week 9-10:</strong> Authentication & Security - JWT, bcrypt, API security</li>
  <li><strong>Week 11-12:</strong> Testing & Deployment - Jest, Docker, cloud platforms</li>
  <li><strong>Ongoing:</strong> Build full-stack applications, learn TypeScript</li>
</ul>
<p><strong>Resources:</strong> Node.js docs, Express.js guide, freeCodeCamp Node.js course</p>
`;
	}

	if (lowerGoal.includes('mobile') || lowerGoal.includes('app')) {
		return `
<h4>📱 Mobile App Development Learning Path</h4>
<ul>
  <li><strong>Week 1-2:</strong> Choose Platform - React Native, Flutter, or native (iOS/Android)</li>
  <li><strong>Week 3-4:</strong> Programming Basics - JavaScript/Dart/Swift/Kotlin</li>
  <li><strong>Week 5-6:</strong> UI/UX Design Principles - Mobile-first design</li>
  <li><strong>Week 7-8:</strong> Framework Fundamentals - Components, navigation</li>
  <li><strong>Week 9-10:</strong> Data Management - APIs, local storage, state management</li>
  <li><strong>Week 11-12:</strong> App Store Deployment - Publishing your first app</li>
  <li><strong>Ongoing:</strong> User feedback, updates, advanced features</li>
</ul>
<p><strong>Resources:</strong> Official docs, Expo (React Native), Flutter.dev</p>
`;
	}

	if (lowerGoal.includes('data') || lowerGoal.includes('analytics')) {
		return `
<h4>📊 Data Science Learning Path</h4>
<ul>
  <li><strong>Week 1-2:</strong> Python Basics + NumPy fundamentals</li>
  <li><strong>Week 3-4:</strong> Pandas for data manipulation and analysis</li>
  <li><strong>Week 5-6:</strong> Data Visualization - Matplotlib, Seaborn</li>
  <li><strong>Week 7-8:</strong> Statistics and Probability fundamentals</li>
  <li><strong>Week 9-10:</strong> Machine Learning basics - Scikit-learn</li>
  <li><strong>Week 11-12:</strong> Real-world projects and datasets</li>
  <li><strong>Ongoing:</strong> Advanced ML, deep learning, specialization</li>
</ul>
<p><strong>Resources:</strong> Kaggle Learn, Python for Data Analysis book, Coursera ML course</p>
`;
	}

	// Default learning path
	return `
<h4>🚀 General Programming Learning Path for: ${goal}</h4>
<ul>
  <li><strong>Week 1-2:</strong> Programming Fundamentals - Logic, problem-solving</li>
  <li><strong>Week 3-4:</strong> Choose Your First Language - JavaScript/Node.js recommended</li>
  <li><strong>Week 5-6:</strong> Practice Basic Projects - Calculator, simple games</li>
  <li><strong>Week 7-8:</strong> Data Structures and Algorithms basics</li>
  <li><strong>Week 9-10:</strong> Version Control - Git and GitHub</li>
  <li><strong>Week 11-12:</strong> Build a Portfolio Project</li>
  <li><strong>Ongoing:</strong> Join coding communities, contribute to projects</li>
</ul>
<p><strong>Resources:</strong> freeCodeCamp, Codecademy, LeetCode for practice</p>
<p><strong>Tip:</strong> Be more specific about your goals (e.g., "web development", "mobile apps", "data science") for a customized path!</p>
`;
}
