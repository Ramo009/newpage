"use strict";

//h1 text animateconsole.log();
const texts = [
  "Welcome to my website!",
  "Your Science Website!",
  "More about Technology!",
];

let currentTextIndex = 0;
let charIndex = 0;
let typingSpeed = 100; // Typing speed in milliseconds

function typeWriter() {
  if (charIndex < texts[currentTextIndex].length) {
    document.getElementById("title").innerHTML +=
      texts[currentTextIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, typingSpeed);
  } else {
    // Wait for 2 seconds before starting to erase the text
    setTimeout(eraseWriter, 2000);
  }
}

function eraseWriter() {
  if (charIndex > 0) {
    document.getElementById("title").innerHTML = texts[
      currentTextIndex
    ].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseWriter, typingSpeed);
  } else {
    // Move to the next text
    currentTextIndex = (currentTextIndex + 1) % texts.length; // Cycle through texts
    setTimeout(typeWriter, 500); // Wait before starting to type the next text
  }
}

// Start typing effect when the page loads
window.onload = typeWriter;

//Overlay js code
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayContent = document.getElementById("overlayContent");
const overlayImage = document.getElementById("overlayImage");
const closeOverlayButton = document.getElementById("closeOverlayButton");

// Function to open the overlay with dynamic content
function openOverlay(title, content, image) {
  overlayTitle.innerText = title;
  overlayContent.innerText = content;
  overlayImage.src = image;
  overlayImage.alt = title; // Set alt attribute for accessibility
  overlay.style.display = "flex"; // Show the overlay
}

// Close overlay when clicking the close button
closeOverlayButton.addEventListener("click", () => {
  overlay.style.display = "none"; // Hide the overlay
});

// Close overlay when clicking outside the content
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    overlay.style.display = "none";
  }
});

// Add click event to each column to open the overlay
document.querySelectorAll(".column").forEach((column) => {
  column.addEventListener("click", function () {
    const title = column.getAttribute("data-title");
    const content = column.getAttribute("data-content");
    const image = column.getAttribute("data-image"); // Get the image source
    openOverlay(title, content, image); // Open the overlay with the book's title, content, and image
  });
});
// Particles.js configuration
particlesJS.load("particles-js", "particles.json", function () {
  console.log("callback - particles.js config loaded");
});

// Scroll to Next Section
const scrollDownButton = document.getElementById("scrollDown");
const nextSection = document.getElementById("articles"); // The next section you want to scroll to

scrollDownButton.onclick = function () {
  // Scroll to the next section smoothly
  nextSection.scrollIntoView({ behavior: "smooth" });
};

// Scroll to Top Button
const scrollToTopButton = document.getElementById("scrollToTop");

window.onscroll = function () {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    scrollToTopButton.style.display = "block"; // Show button when scrolled down
    scrollDownButton.style.display = "none"; // Hide scroll down button when scrolled down
  } else {
    scrollToTopButton.style.display = "none"; // Hide button when at the top
    scrollDownButton.style.display = "block"; // Show scroll down button when at the top
  }
};

scrollToTopButton.onclick = function () {
  window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
};
particlesJS("particles-js", {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: "#ffffff",
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000",
      },
      polygon: {
        nb_sides: 5,
      },
      image: {
        src: "img/github.svg",
        width: 100,
        height: 100,
      },
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 5,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false,
      },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#fff",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 6,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: {
        enable: true,
        mode: ["grab", "bubble"],
      },
      onclick: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 300,
        line_linked: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 400,
        size: 5,
        duration: 2,
        opacity: 8,
        speed: 3,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
});