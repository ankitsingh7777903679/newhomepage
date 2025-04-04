// Preloader
window.addEventListener('load', () => {
  document.getElementById('preloader').style.display = 'none';
});

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
  delay: 0,
  easing: 'ease-in-out',
  anchorPlacement: 'top-bottom'
});

// Initialize Particles
particlesJS('particles-js', {
  particles: {
    number: { value: 60, density: { enable: true, value_area: 800 } },
    color: { value: '#ffffff' },
    shape: { type: 'circle' },
    opacity: { value: 0.3, random: false, anim: { enable: false } },
    size: { value: 2, random: true },
    line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.2, width: 1 },
    move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
  },
  interactivity: {
    detect_on: 'canvas',
    events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
    modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } }, push: { particles_nb: 3 } }
  },
  retina_detect: true
});

// Typed.js
const typed = new Typed('#typedText', {
  strings: [
    'Your Exam Prep Buddy',
    'Unlock Past Papers & Tips',
    'Shine in B.Com, BCA, 10th, 12th'
  ],
  typeSpeed: 50,
  backSpeed: 30,
  backDelay: 1500,
  loop: true,
  showCursor: true,
  cursorChar: '|',
  autoInsertCss: true,
  fadeOut: true,
  fadeOutClass: 'typed-fade-out',
  fadeOutDelay: 500,
  onStringTyped: function() {
    const typedElement = document.querySelector('.typed-cursor');
    if (typedElement) typedElement.style.opacity = '1';
  }
});

// Dark Mode Toggle
const modeIcon = document.querySelector('.mode-icon');
let isDarkMode = localStorage.getItem('darkMode') === 'true';
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
if (localStorage.getItem('darkMode') === null) {
  isDarkMode = prefersDarkScheme.matches;
  localStorage.setItem('darkMode', isDarkMode);
}

const applyMode = () => {
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    modeIcon.textContent = 'brightness_7';
  } else {
    document.body.classList.remove('dark-mode');
    modeIcon.textContent = 'brightness_4';
  }
};

prefersDarkScheme.addEventListener('change', (e) => {
  if (localStorage.getItem('darkMode') === null) {
    isDarkMode = e.matches;
    applyMode();
  }
});

modeIcon.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  localStorage.setItem('darkMode', isDarkMode);
  applyMode();
});

// Generate Cards
function generateBoardCards(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const boardData = [
    { title: '10th Class', desc: 'Boost your GSEB 10th prep with real past papers!', link: 'tenth.html' },
    { title: '12th Comm', desc: 'Ace Commerce exams with last years questions!', link: 'comm.html' },
    { title: '12th Sci', desc: 'Master Science concepts with authentic papers!', link: 'sci.html' },
    { title: '12th Arts', desc: 'Shine in Arts with proven exam practice!', link: 'arts.html' }
  ];

  boardData.forEach(data => {
    const card = `
      <div class="col">
        <div class="card tilt-card" data-tilt>
          <div class="card-body">
            <p class="flip-card-head"><u>GSEB BOARD</u></p>
            <h4 class="flip-card-subhead">${data.title}</h4>
            <p class="flip-card-text">${data.desc}</p>
            <a href="${data.link}" target="_blank" class="flip-card-link">Explore Now</a>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

function generateCollegeCards(containerId, course, links, descriptions) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 1; i <= 6; i++) {
    const card = `
      <div class="col">
        <div class="card tilt-card" data-tilt>
          <div class="card-body p-0 ">
          <div class="card-icon"><i class="fa-solid fa-graduation-cap fw-bolder"></i></div>
            <p class="flip-card-head"><u>${course}</u></p>
            <h4 class="flip-card-subhead">SEM-${i}</h4>
            <p class="flip-card-text">${descriptions[i-1]}</p>
            <a href="${links[i-1]}" target="_blank" class="flip-card-link">Explore Now</a>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += card;
  }
}

const bcaLinks = [
  "https://questionbanker.in/bca_sem1",
  "https://questionbanker.in/bca_sem2",
  "https://questionbanker.in/bca_sem3",
  "https://questionbanker.in/bca-sem4-solution",
  "https://questionbanker.in/bca_sem5",
  "https://questionbanker.in/bca_sem6"
];

const bcaDescriptions = [
  "Kickstart BCA with Sem 1 papers—nail the basics!",
  "Level up in Sem 2 with real exam practice!",
  "Conquer Sem 3 challenges with past questions!",
  "Ace Sem 4 with proven study material!",
  "Boost Sem 5 prep with authentic papers!",
  "Finish strong in Sem 6—top scores await!"
];

const bcomLinks = [
  "https://questionbanker.in/bcom_sem1",
  "https://questionbanker.in/bcom_sem2",
  "https://questionbanker.in/bcom_sem3",
  "https://questionbanker.in/bcom_sem4",
  "https://questionbanker.in/bcom_sem5",
  "https://questionbanker.in/bcom_sem6"
];

const bcomDescriptions = [
  "Start B.Com strong with Sem 1 past papers!",
  "Master Sem 2 concepts with real questions!",
  "Shine in Sem 3 with exam-ready practice!",
  "Crack Sem 4 with top-notch resources!",
  "Excel in Sem 5—past papers made easy!",
  "End Sem 6 with confidence and high marks!"
];

// Search Functionality
const searchData = [
  { title: 'GSEB 10th Maths', category: 'Board Papers', link: 'tenth.html', icon: 'fa-school' },
  { title: 'GSEB 12th Commerce', category: 'Board Papers', link: 'comm.html', icon: 'fa-school' },
  { title: 'GSEB 12th Science', category: 'Board Papers', link: 'sci.html', icon: 'fa-school' },
  { title: 'GSEB 12th Arts', category: 'Board Papers', link: 'arts.html', icon: 'fa-school' },
  { title: 'BCA Sem 1', category: 'College Papers', link: 'bca_sem1.html', icon: 'fa-graduation-cap' },
  { title: 'BCA Sem 2', category: 'College Papers', link: 'bca_sem2.html', icon: 'fa-graduation-cap' },
  { title: 'BCA Sem 3', category: 'College Papers', link: 'bca_sem3.html', icon: 'fa-graduation-cap' },
  { title: 'BCA Sem 4', category: 'College Papers', link: 'bca_sem4.html', icon: 'fa-graduation-cap' },
  { title: 'BCA Sem 5', category: 'College Papers', link: 'bca_sem5.html', icon: 'fa-graduation-cap' },
  { title: 'BCA Sem 6', category: 'College Papers', link: 'bca_sem6.html', icon: 'fa-graduation-cap' },
  { title: 'B.Com Sem 1', category: 'College Papers', link: 'bcom_sem1.html', icon: 'fa-graduation-cap' },
  { title: 'B.Com Sem 2', category: 'College Papers', link: 'bcom_sem2.html', icon: 'fa-graduation-cap' },
  { title: 'B.Com Sem 3', category: 'College Papers', link: 'bcom_sem3.html', icon: 'fa-graduation-cap' },
  { title: 'B.Com Sem 4', category: 'College Papers', link: 'bcom_sem4.html', icon: 'fa-graduation-cap' },
  { title: 'B.Com Sem 5', category: 'College Papers', link: 'bcom_sem5.html', icon: 'fa-graduation-cap' },
  { title: 'B.Com Sem 6', category: 'College Papers', link: 'bcom_sem6.html', icon: 'fa-graduation-cap' }
];

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
let selectedSuggestionIndex = -1;

function updateSearchHistory(query) {
  if (!query.trim()) return;
  
  searchHistory = searchHistory.filter(item => item !== query);
  searchHistory.unshift(query);
  searchHistory = searchHistory.slice(0, 5);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function fuzzyMatch(str, pattern) {
  pattern = pattern.toLowerCase();
  str = str.toLowerCase();
  
  let i = 0;
  let j = 0;
  
  while (i < str.length && j < pattern.length) {
    if (str[i] === pattern[j]) {
      j++;
    }
    i++;
  }
  
  return j === pattern.length;
}

function getSearchSuggestions(query) {
  if (!query.trim()) {
    return searchHistory.map(item => ({
      title: item,
      category: 'Recent Search',
      icon: 'fa-history'
    }));
  }

  return searchData.filter(item => 
    fuzzyMatch(item.title, query) || 
    fuzzyMatch(item.category, query)
  );
}

function renderSuggestions(suggestions) {
  const suggestionsContainer = document.getElementById('searchSuggestions');
  suggestionsContainer.innerHTML = '';
  
  if (suggestions.length === 0) {
    suggestionsContainer.innerHTML = `
      <div class="suggestion-item">
        <i class="fas fa-info-circle"></i>
        <span class="suggestion-text">No results found</span>
      </div>
    `;
    return;
  }

  suggestions.forEach((suggestion, index) => {
    const suggestionElement = document.createElement('div');
    suggestionElement.className = `suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`;
    suggestionElement.innerHTML = `
      <i class="fas ${suggestion.icon}"></i>
      <span class="suggestion-text">${suggestion.title}</span>
      <span class="suggestion-category">${suggestion.category}</span>
    `;
    
    suggestionElement.addEventListener('click', () => {
      if (suggestion.link) {
        window.location.href = suggestion.link;
      } else {
        document.getElementById('searchInput').value = suggestion.title;
        performSearch(suggestion.title);
      }
    });
    
    suggestionsContainer.appendChild(suggestionElement);
  });
}

function performSearch(query) {
  updateSearchHistory(query);
  
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const title = card.querySelector('.flip-card-subhead')?.textContent.toLowerCase() || '';
    const category = card.querySelector('.flip-card-head')?.textContent.toLowerCase() || '';
    const description = card.querySelector('.flip-card-text')?.textContent.toLowerCase() || '';
    
    const isMatch = title.includes(query.toLowerCase()) || 
                   category.includes(query.toLowerCase()) || 
                   description.includes(query.toLowerCase());
    
    card.parentElement.style.display = isMatch ? 'block' : 'none';
  });
}

function handleSearchInput() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');
  const suggestionsContainer = document.getElementById('searchSuggestions');
  
  // Show/hide clear button
  clearBtn.style.display = input.value ? 'flex' : 'none';
  
  // Get and render suggestions
  const suggestions = getSearchSuggestions(input.value);
  renderSuggestions(suggestions);
  
  // Show/hide suggestions container
  suggestionsContainer.classList.toggle('active', input.value !== '');
  
  // Reset selected suggestion
  selectedSuggestionIndex = -1;
}

function handleKeyDown(e) {
  const suggestions = document.querySelectorAll('.suggestion-item');
  const suggestionsContainer = document.getElementById('searchSuggestions');
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
    suggestions[selectedSuggestionIndex]?.scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
    if (selectedSuggestionIndex >= 0) {
      suggestions[selectedSuggestionIndex]?.scrollIntoView({ block: 'nearest' });
    }
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const input = document.getElementById('searchInput');
    if (selectedSuggestionIndex >= 0) {
      const selectedSuggestion = suggestions[selectedSuggestionIndex];
      if (selectedSuggestion) {
        const link = selectedSuggestion.querySelector('a');
        if (link) {
          window.location.href = link.href;
        } else {
          input.value = selectedSuggestion.querySelector('.suggestion-text').textContent;
          performSearch(input.value);
        }
      }
    } else {
      performSearch(input.value);
    }
    suggestionsContainer.classList.remove('active');
  } else if (e.key === 'Escape') {
    suggestionsContainer.classList.remove('active');
  }
}

// Initialize search functionality
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');
  const searchBtn = document.querySelector('.search-btn');
  
  // Event listeners
  searchInput.addEventListener('input', handleSearchInput);
  searchInput.addEventListener('keydown', handleKeyDown);
  
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    handleSearchInput();
    document.getElementById('searchSuggestions').classList.remove('active');
  });
  
  searchBtn.addEventListener('click', () => {
    performSearch(searchInput.value);
    document.getElementById('searchSuggestions').classList.remove('active');
  });
  
  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      document.getElementById('searchSuggestions').classList.remove('active');
    }
  });
});

// EmailJS Feedback Form
function sendEmail(event) {
  event.preventDefault();
  const fromName = document.getElementById("inputName").value;
  const fromEmail = document.getElementById("inputEmail1").value;
  const message = document.getElementById("floatingTextarea").value;
  const templateParams = {
    from_name: fromName,
    email_id: fromEmail,
    message: message
  };
  emailjs.send("service_p9r3x14", "template_6nfwf7q", templateParams)
    .then(() => {
      const alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
      alertModal.show();
    })
    .catch((error) => {
      alert("Failed to send feedback. Check console.");
      console.error("FAILED...", error);
    });
}

// DOM Load Initialization
document.addEventListener('DOMContentLoaded', () => {
  applyMode();
  generateBoardCards('bord-paper');
  generateCollegeCards('bca-papers', 'BCA', bcaLinks, bcaDescriptions);
  generateCollegeCards('bcom-papers', 'B.Com', bcomLinks, bcomDescriptions);
  VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
    max: 25,
    speed: 400,
    glare: true,
    'max-glare': 0.5
  });

  const myCarousel = new bootstrap.Carousel(document.getElementById('featuredSlider'), {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    touch: true,
    keyboard: true
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') myCarousel.prev();
    else if (e.key === 'ArrowRight') myCarousel.next();
  });
});