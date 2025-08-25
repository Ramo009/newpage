ScrollReveal().reveal(".logo", {
  distance: "50px",
  origin: "left",
  duration: 1000,
  easing: "ease-in-out",
  delay: 200,
});

ScrollReveal().reveal("#start", {
  delay: 200,
  distance: "50px",
  origin: "bottom",
  duration: 1000,
  easing: "ease-in-out",
  scale: 0.6,
  delay: 200,

  beforeReveal: function (el) {
    el.style.transform = "scale(0.8)";
  },
  afterReveal: function (el) {
    el.style.transform = "scale(1)";
  },
});
ScrollReveal().reveal("#projects", {
  delay: 400,
  distance: "50px",
  origin: "right",
  duration: 2000,
  easing: "ease-in-out",
});
ScrollReveal().reveal("#contact", {
  delay: 600,
  distance: "50px",
  origin: "bottom",
  duration: 2000,
  easing: "ease-in-out",
});

ScrollReveal().reveal("#skills", {
  delay: 600,
  distance: "50px",
  origin: "bottom",
  duration: 2000,
  easing: "ease-in-out",
  beforeReveal: function (el) {
    el.style.transform = "translateY(50px)";
  },
  afterReveal: function (el) {
    el.style.transform = "translateY(0)";
  },
});

ScrollReveal().reveal("#ai-tools", {
  delay: 800,
  distance: "30px",
  origin: "bottom",
  duration: 1500,
  easing: "ease-in-out",
});

ScrollReveal().reveal(".tool-card", {
  delay: 200,
  distance: "40px",
  origin: "bottom",
  duration: 1200,
  easing: "ease-in-out",
  interval: 300,
});

ScrollReveal().reveal("header h1", {
  delay: 100,
  //distance = width of header window
  distance: "1000px",
  origin: "left",
  duration: 4000,
  // from near logo come out and scale up to be fixed
  scale: 0.1,
  easing: "ease-in-out",
  beforeReveal: function (el) {
    el.style.transform = "scale(0.5) translateZ(-100px) rotateZ(160deg)";
    el.style.color = "#ae4203";
  },
  afterReveal: function (el) {
    el.style.transform = "scale(1) translateZ(0) rotateZ(0)";
    el.style.color = "transparent";
  },
  // FROM LEFT COME OUT
  beforeReveal: function (el) {
    el.style.transform = "scale(0.5) translateZ(-100px) rotateY(160deg)";
    el.style.color = "#ae4203";
  },
  afterReveal: function (el) {
    el.style.transform = "scale(1) translateZ(0) rotateY(0)";
    el.style.color = "transparent";
  },
});

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.7; // Adjust height to fit the header
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const STAR_COUNT = 600;
const STAR_COLORS = ["#fff", "gold", "orange", "#ffd6fa"];
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
  const chatContainer = document.getElementById("chat-container");
  const chatIcon = document.getElementById("chat-icon");

  chatOpen = !chatOpen;

  if (chatOpen) {
    chatContainer.classList.add("show");
    chatIcon.name = "close-outline";
  } else {
    chatContainer.classList.remove("show");
    chatIcon.name = "chatbubble-outline";
  }
}

function handleChatInput(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

async function sendMessage() {
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");
  const message = chatInput.value.trim();

  if (!message) return;

  // Add user message
  addMessage(message, "user");
  chatInput.value = "";

  // Show typing indicator
  showTypingIndicator();

  try {
    // Get AI response
    const response = await getAIResponse(message);
    hideTypingIndicator();
    addMessage(response, "bot");
  } catch (error) {
    hideTypingIndicator();
    addMessage("Sorry, I encountered an error. Please try again later.", "bot");
  }

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessage(text, sender) {
  const chatMessages = document.getElementById("chat-messages");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}-message`;
  messageDiv.innerHTML = `<p>${text}</p>`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  const chatMessages = document.getElementById("chat-messages");
  const typingDiv = document.createElement("div");
  typingDiv.className = "message bot-message typing-indicator";
  typingDiv.id = "typing-indicator";
  typingDiv.innerHTML =
    '<p><span class="dot"></span><span class="dot"></span><span class="dot"></span></p>';
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// AI Response Function - Using a simple rule-based chatbot
async function getAIResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Programming-related responses
  if (lowerMessage.includes("html") || lowerMessage.includes("web")) {
    return "HTML is the backbone of web development! It's a markup language used to structure content on web pages. Would you like to know about HTML tags, semantic elements, or how to get started?";
  }

  if (lowerMessage.includes("css") || lowerMessage.includes("style")) {
    return "CSS is fantastic for styling web pages! It controls the visual presentation - colors, layouts, animations, and responsive design. Are you interested in learning about Flexbox, Grid, or CSS animations?";
  }

  if (lowerMessage.includes("javascript") || lowerMessage.includes("js")) {
    return "JavaScript brings web pages to life! It's a versatile programming language for both frontend and backend development. You can create interactive elements, handle user events, and even build entire applications. What aspect of JavaScript interests you most?";
  }

  if (lowerMessage.includes("python")) {
    return "Python is an excellent choice for beginners! It has clean, readable syntax and is used in web development, data science, AI, and automation. Would you like suggestions for Python learning resources or project ideas?";
  }

  if (lowerMessage.includes("project") || lowerMessage.includes("build")) {
    return "Building projects is the best way to learn programming! Start with simple projects like a personal website, calculator, or to-do list. Each project teaches new concepts and builds your portfolio. What type of project interests you?";
  }

  if (
    lowerMessage.includes("start") ||
    lowerMessage.includes("begin") ||
    lowerMessage.includes("learn")
  ) {
    return "Great question! Here's my advice for starting programming: 1) Choose a language (HTML/CSS for web, Python for general programming), 2) Follow online tutorials, 3) Practice daily, 4) Build small projects, 5) Join coding communities. What's your main interest - web development, mobile apps, or something else?";
  }

  if (lowerMessage.includes("career") || lowerMessage.includes("job")) {
    return "Programming offers many exciting career paths! Web developers, software engineers, data scientists, mobile app developers, and more. The key is building a strong portfolio, contributing to open-source projects, and never stopping learning. What type of career interests you most?";
  }

  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey")
  ) {
    return "Hello! I'm here to help you with programming questions and guidance. Whether you're just starting out or looking to advance your skills, I'm happy to assist with HTML, CSS, JavaScript, Python, project ideas, and career advice. What would you like to know?";
  }

  if (lowerMessage.includes("help")) {
    return "I'm here to help you with programming! I can assist with: 🌐 Web Development (HTML, CSS, JS), 🐍 Python programming, 💡 Project ideas, 🎯 Learning roadmaps, 💼 Career advice, 🔧 Debugging tips. What would you like help with?";
  }

  // Default responses for general queries
  const defaultResponses = [
    "That's an interesting question! Programming is all about problem-solving and creativity. Could you be more specific about what you'd like to learn?",
    "I'd love to help you with that! Could you tell me more about your programming interests or current skill level?",
    "Programming is such an exciting field! Whether you're interested in web development, mobile apps, or data science, there's always something new to learn. What specifically interests you?",
    "Great question! I specialize in helping with programming concepts, project ideas, and learning paths. What programming topic can I help you explore?",
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// AI Code Generator Functions
async function generateCode() {
  const language = document.getElementById("language-select").value;
  const request = document.getElementById("code-request").value.trim();
  const output = document.getElementById("generated-code");

  if (!request) {
    output.innerHTML = "Please describe what code you need!";
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
    },
    python: {
      function: `def greet_user(name, greeting="Hello"):
    """
    Greets a user with a custom message
    
    Args:
        name (str): The user's name
        greeting (str): Custom greeting (default: "Hello")
    
    Returns:
        str: Formatted greeting message
    """
    return f"{greeting}, {name}! Welcome to our application."

# Example usage
user_greeting = greet_user("Alice")
custom_greeting = greet_user("Bob", "Hi there")
print(user_greeting)  # Output: Hello, Alice! Welcome to our application.`,
      class: `class Student:
    def __init__(self, name, age, student_id):
        self.name = name
        self.age = age
        self.student_id = student_id
        self.grades = []
    
    def add_grade(self, subject, grade):
        """Add a grade for a subject"""
        self.grades.append({"subject": subject, "grade": grade})
    
    def get_average_grade(self):
        """Calculate and return the average grade"""
        if not self.grades:
            return 0
        return sum(g["grade"] for g in self.grades) / len(self.grades)
    
    def __str__(self):
        return f"Student: {self.name} (ID: {self.student_id})"

# Usage
student = Student("Alice Johnson", 20, "S12345")
student.add_grade("Math", 85)
student.add_grade("Science", 92)
print(f"Average: {student.get_average_grade():.1f}")`,
      file: `# File Operations in Python
import json
import os

def read_json_file(filename):
    """Read and parse a JSON file"""
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            data = json.load(file)
        return data
    except FileNotFoundError:
        print(f"File '{filename}' not found.")
        return None
    except json.JSONDecodeError:
        print(f"Invalid JSON in file '{filename}'.")
        return None

def write_json_file(filename, data):
    """Write data to a JSON file"""
    try:
        with open(filename, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=2)
        print(f"Data saved to '{filename}'")
    except Exception as e:
        print(f"Error writing file: {e}")

# Example usage
data = {"users": [{"name": "Alice", "age": 25}]}
write_json_file("users.json", data)
loaded_data = read_json_file("users.json")`,
    },
  };

  // Find matching snippet
  for (const [key, snippet] of Object.entries(snippets[language] || {})) {
    if (lowerRequest.includes(key)) {
      return snippet;
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
    python: `# Python script for: ${request}
def main():
    """
    Main function for: ${request}
    """
    print("Starting: ${request}")
    
    # Your implementation here
    result = process_data()
    print(f"Result: {result}")

def process_data():
    """
    Process data for: ${request}
    """
    # Implementation goes here
    return "Processing complete"

if __name__ == "__main__":
    main()`,
  };

  return (
    defaults[language] ||
    `// Code snippet for: ${request}\n// Implementation needed for ${language}`
  );
}

async function generateLearningPath() {
  const goal = document.getElementById("learning-goal").value.trim();
  const output = document.getElementById("learning-path");

  if (!goal) {
    output.innerHTML = "Please tell us what you want to learn!";
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

  if (
    lowerGoal.includes("web") ||
    lowerGoal.includes("frontend") ||
    lowerGoal.includes("website")
  ) {
    return `
<h4>🌐 Web Development Learning Path</h4>
<ul>
  <li><strong>Week 1-2:</strong> HTML Basics - Structure, tags, forms</li>
  <li><strong>Week 3-4:</strong> CSS Fundamentals - Styling, layout, responsive design</li>
  <li><strong>Week 5-6:</strong> JavaScript Basics - Variables, functions, DOM manipulation</li>
  <li><strong>Week 7-8:</strong> Advanced CSS - Flexbox, Grid, animations</li>
  <li><strong>Week 9-10:</strong> JavaScript Projects - Interactive websites, API calls</li>
  <li><strong>Week 11-12:</strong> Framework Introduction - React or Vue.js basics</li>
  <li><strong>Ongoing:</strong> Build portfolio projects and practice daily</li>
</ul>
<p><strong>Resources:</strong> MDN Docs, freeCodeCamp, CSS-Tricks, JavaScript.info</p>
`;
  }

  if (lowerGoal.includes("python")) {
    return `
<h4>🐍 Python Programming Learning Path</h4>
<ul>
  <li><strong>Week 1-2:</strong> Python Basics - Variables, data types, control structures</li>
  <li><strong>Week 3-4:</strong> Functions and Modules - Code organization, imports</li>
  <li><strong>Week 5-6:</strong> Data Structures - Lists, dictionaries, sets, tuples</li>
  <li><strong>Week 7-8:</strong> File Handling and Error Management</li>
  <li><strong>Week 9-10:</strong> Object-Oriented Programming - Classes, inheritance</li>
  <li><strong>Week 11-12:</strong> Popular Libraries - requests, pandas, matplotlib</li>
  <li><strong>Ongoing:</strong> Practice with projects, contribute to open source</li>
</ul>
<p><strong>Resources:</strong> Python.org tutorial, Automate the Boring Stuff, Real Python</p>
`;
  }

  if (lowerGoal.includes("mobile") || lowerGoal.includes("app")) {
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

  if (lowerGoal.includes("data") || lowerGoal.includes("analytics")) {
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
  <li><strong>Week 3-4:</strong> Choose Your First Language - Python/JavaScript recommended</li>
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
