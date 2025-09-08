// Helper function to handle option selection
function selectOption(element, answerField) {
  // Remove selected class from all options in this step
  const options = element.parentElement.querySelectorAll('.quiz-option');
  options.forEach(opt => opt.classList.remove('selected'));
  
  // Add selected class to clicked option
  element.classList.add('selected');
  
  // Store the selected value
  answers[answerField] = element.getAttribute('data-value');
  
  // Show other input if "Andere" is selected
  if (answerField === 'relationship' && element.getAttribute('data-value') === 'andere') {
    document.getElementById('other-relationship-input').style.display = 'block';
  } else if (answerField === 'relationship') {
    document.getElementById('other-relationship-input').style.display = 'none';
  }
}

// Mobile menu toggle
document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
  document.querySelector('.nav-links').classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('active');
  });
});

function showLegalModal(title, contentId) {
  event.preventDefault();
  const modal = document.getElementById('legal-modal');
  const titleElement = document.getElementById('modal-title');
  const contentElement = document.getElementById('modal-content');
  
  titleElement.textContent = title;
  contentElement.innerHTML = document.getElementById(contentId).innerHTML;
  
  modal.style.display = 'flex';
}

function hideLegalModal() {
  document.getElementById('legal-modal').style.display = 'none';
}

// Close modal when clicking outside content
document.getElementById('legal-modal').addEventListener('click', function(e) {
  if (e.target === this) {
    hideLegalModal();
  }
});

// Testimonial Slider
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.slider-dot');
let currentTestimonial = 0;
let testimonialInterval;

function showTestimonial(index) {
testimonials.forEach(testimonial => testimonial.classList.remove('active'));
dots.forEach(dot => dot.classList.remove('active'));

testimonials[index].classList.add('active');
dots[index].classList.add('active');
currentTestimonial = index;
}

function startTestimonialSlider() {
clearInterval(testimonialInterval);
testimonialInterval = setInterval(() => {
currentTestimonial = (currentTestimonial + 1) % testimonials.length;
showTestimonial(currentTestimonial);
}, 6000);
}

dots.forEach(dot => {
dot.addEventListener('click', function() {
const slideIndex = parseInt(this.getAttribute('data-slide'));
showTestimonial(slideIndex);
startTestimonialSlider();
});
});

startTestimonialSlider();

// Quiz Functionality
const steps = document.querySelectorAll('.quiz-step');
const progressBar = document.getElementById('progress-bar');
let currentStep = 0;
const totalSteps = steps.length - 1; // excluding the thank you step

// Navigation functionality
document.addEventListener('click', function(e) {
  // Handle next button clicks
  if (e.target.classList.contains('quiz-next')) {
    e.preventDefault();
    const currentStepId = steps[currentStep].id;
    let isValid = true;

    // Validate current step
    if (currentStepId === 'step1' && !answers.recipient) {
      alert('Bitte wähle eine Option aus');
      isValid = false;
    } else if (currentStepId === 'step2' && !answers.age && !answers.exactAge) {
      alert('Bitte geben Sie das genaue Alter an');
      isValid = false;
    } else if (currentStepId === 'step3' && !answers.gender) {
      alert('Bitte wähle eine Option aus');
      isValid = false;
    } else if (currentStepId === 'step4' && !answers.relationship) {
      alert('Bitte wähle eine Option aus');
      isValid = false;
    } else if (currentStepId === 'step5' && answers.interests.length === 0) {
      alert('Bitte wähle mindestens eine Option aus');
      isValid = false;
    } else if (currentStepId === 'step6' && !answers.occasion) {
      alert('Bitte wähle eine Option aus');
      isValid = false;
    } else if (currentStepId === 'step7' && !answers.budget) {
      alert('Bitte wähle eine Option aus');
      isValid = false;
    } else if (currentStepId === 'step8' && !answers.style) {
      alert('Bitte wähle eine Option aus');
      isValid = false;
    }

    if (isValid) {
      if (currentStep === totalSteps - 1) {
        submitQuiz(e);
      } else {
        showStep(currentStep + 1);
      }
    }
  }

  // Handle back button clicks
  if (e.target.classList.contains('quiz-prev')) {
    e.preventDefault();
    showStep(currentStep - 1);
  }
});

// Store answers
const answers = {
recipient: '',
age: '',
exactAge: null,
gender: '',
relationship: '',
interests: [],
occasion: '',
budget: '',
style: '',
contact: {}
};

function updateProgress() {
const progress = (currentStep / (totalSteps - 1)) * 100;
progressBar.style.width = `${progress}%`;
}

function showStep(stepIndex) {
steps.forEach(step => step.classList.remove('active'));
steps[stepIndex].classList.add('active');
currentStep = stepIndex;
updateProgress();

// Scroll to top of quiz container
document.querySelector('.quiz-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Navigation functionality
function updateNavigationButtons() {
  const prevButtons = document.querySelectorAll('.prev-step');
  const nextButtons = document.querySelectorAll('.next-step');
  
  prevButtons.forEach(button => {
    button.style.display = currentStep === 0 ? 'none' : 'block';
  });
  
  nextButtons.forEach(button => {
    button.textContent = currentStep === totalSteps - 1 ? 'Abschicken' : 'Weiter';
  });
}

document.addEventListener('click', function(e) {
  // Handle next button clicks
  if (e.target.classList.contains('next-step')) {
    e.preventDefault();
    const currentStepId = steps[currentStep].id;
    let isValid = true;

    // Validate current step
    if (currentStepId === 'step1' && !answers.recipient) {
      alert('Bitte wähle eine Option aus');
      isValid = false;
    } else if (currentStepId === 'step2' && !answers.age && !answers.exactAge) {
      alert('Bitte geben Sie das genaue Alter an');
      isValid = false;
    } else if (currentStepId === 'step3' && !answers.gender) {
      alert('Bitte wähle eine Option aus');
      isValid = false;
    } else if (currentStepId === 'step4' && !answers.relationship) {
      alert('Bitte wähle eine Option aus');
      isValid = false;
    } else if (currentStepId === 'step5' && answers.interests.length === 0) {
      alert('Bitte wähle mindestens eine Option aus');
      isValid = false;
    } else if (currentStepId === 'step6' && !answers.occasion) {
      alert('Bitte wähle eine Option aus');
      isValid = false;
    } else if (currentStepId === 'step7' && !answers.budget) {
      alert('Bitte wähle eine Option aus');
      isValid = false;
    } else if (currentStepId === 'step8' && !answers.style) {
      alert('Bitte wähle eine Option aus');
      isValid = false;
    }

    if (isValid) {
      if (currentStep === totalSteps - 1) {
        // Get form data for the last step
        const form = document.getElementById('quiz-form');
        const nameInput = form.querySelector('input[type="text"]');
        const emailInput = form.querySelector('input[type="email"]');

        if (!nameInput.value.trim()) {
          alert('Bitte gib deinen Namen ein');
          return;
        }

        if (!emailInput.value.trim() || !emailInput.checkValidity()) {
          alert('Bitte gib eine gültige E-Mail-Adresse ein');
          return;
        }

        // Save contact info
        answers.contact = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: form.querySelector('input[type="tel"]').value.trim(),
          notes: form.querySelector('textarea').value.trim()
        };

        // Show thank you step
        showStep(currentStep + 1);

        // Reset form after delay
        setTimeout(() => {
          // Reset the entire quiz
          document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
          });
          form.reset();
          showStep(0);

          // Reset answers object
          answers.recipient = '';
          answers.age = '';
          answers.gender = '';
          answers.relationship = '';
          answers.interests = [];
          answers.occasion = '';
          answers.budget = '';
          answers.style = '';
          answers.contact = {};
        }, 10000);
      } else {
        showStep(currentStep + 1);
      }
    }
  }

  // Handle back button clicks
  if (e.target.classList.contains('prev-step')) {
    e.preventDefault();
    showStep(currentStep - 1);
  }
});

// Update buttons when step changes
function showStep(stepIndex) {
  steps.forEach(step => step.classList.remove('active'));
  steps[stepIndex].classList.add('active');
  currentStep = stepIndex;
  updateProgress();
  updateNavigationButtons();
  
  // Scroll to top of quiz container
  document.querySelector('.quiz-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Initialize buttons on load
updateNavigationButtons();

// Interest search functionality
const interestSearch = document.getElementById('interest-search');
const interestOptions = document.querySelectorAll('#interest-options .quiz-option');
const selectedInterestsContainer = document.getElementById('selected-interests');
const selectedTagsContainer = document.getElementById('selected-tags');

// Search filter
interestSearch.addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  
  interestOptions.forEach(option => {
    const text = option.textContent.toLowerCase();
    const categories = option.getAttribute('data-categories');
    const matchesSearch = text.includes(searchTerm) || 
                         (categories && categories.includes(searchTerm));
    
    option.style.display = matchesSearch ? 'block' : 'none';
  });
});

// Handle quiz option selection
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('quiz-option')) {
    // Show/hide custom budget input
    if (e.target.getAttribute('data-value') === '200') {
      document.getElementById('custom-budget-input').style.display = 'block';
      answers.budget = ''; // Reset budget when switching to custom
    } else {
      document.getElementById('custom-budget-input').style.display = 'none';
    }
    // Show/hide other person input
    if (e.target.getAttribute('data-value') === 'andere') {
      document.getElementById('other-person-input').style.display = 'block';
    } else {
      document.getElementById('other-person-input').style.display = 'none';
    }
    const option = e.target;
    const questionId = option.closest('.quiz-step').id;
    const value = option.getAttribute('data-value');

    if (questionId === 'step4' && value === 'andere') {
      document.getElementById('other-relationship-input').style.display = 'block';
    } else if (questionId === 'step4') {
      document.getElementById('other-relationship-input').style.display = 'none';
    } else if (questionId === 'step5') {
      // Multiple selection for interests
      option.classList.toggle('selected');
      
      if (option.classList.contains('selected')) {
        if (!answers.interests.includes(value)) {
          answers.interests.push(value);
        }
      } else {
        answers.interests = answers.interests.filter(item => item !== value);
      }
      updateSelectedInterests();
    } else {
      // Single selection for other steps
      document.querySelectorAll(`#${questionId} .quiz-option`).forEach(opt => {
        opt.classList.remove('selected');
      });
      option.classList.add('selected');
      
      // Store the answer
      switch(questionId) {
        case 'step1': answers.recipient = value; break;
        case 'step2': answers.age = value; break;
        case 'step3': answers.gender = value; break;
        case 'step4': answers.relationship = value; break;
        case 'step6': answers.occasion = value; break;
        case 'step7': answers.budget = value; break;
        case 'step8': answers.style = value; break;
      }
    }
  }
});

function updateSelectedInterests() {
  selectedTagsContainer.innerHTML = '';
  
  if (answers.interests.length > 0) {
    selectedInterestsContainer.style.display = 'block';
    
    answers.interests.forEach(interest => {
      const option = document.querySelector(`.quiz-option[data-value="${interest}"]`);
      if (option) {
        const tag = document.createElement('div');
        tag.className = 'quiz-option selected';
        tag.textContent = option.textContent;
        tag.style.margin = '0';
        tag.style.cursor = 'default';
        selectedTagsContainer.appendChild(tag);
      }
    });
  } else {
    selectedInterestsContainer.style.display = 'none';
  }
}

// New helper functions
function validateAndProceed() {
  // Validate current step before proceeding
  let isValid = true;

  // Handle custom budget input
  if (currentStep === 6 && answers.budget === '200') {
    const customBudgetInput = document.querySelector('#custom-budget-input input');
    if (!customBudgetInput.value || parseInt(customBudgetInput.value) < 200) {
      alert('Bitte gib einen Betrag von mindestens €200 ein');
      isValid = false;
    } else {
      answers.budget = customBudgetInput.value + '€';
    }
  }

  if (currentStep === 0 && !answers.recipient) {
    alert('Bitte wähle eine Option aus');
    isValid = false;
  }
  if (currentStep === 1 && !answers.age) {
    alert('Bitte wähle eine Option aus');
    isValid = false;
  }
  if (currentStep === 2 && !answers.gender) {
    alert('Bitte wähle eine Option aus');
    isValid = false;
  }
  if (currentStep === 3 && !answers.relationship) {
    alert('Bitte wähle eine Option aus');
    isValid = false;
  }
  if (currentStep === 4 && answers.interests.length === 0) {
    alert('Bitte wähle mindestens eine Option aus');
    isValid = false;
  }
  if (currentStep === 5 && !answers.occasion) {
    alert('Bitte wähle eine Option aus');
    isValid = false;
  }
  if (currentStep === 6 && !answers.budget) {
    alert('Bitte wähle eine Option aus');
    isValid = false;
  }
  if (currentStep === 7 && !answers.style) {
    alert('Bitte wähle eine Option aus');
    isValid = false;
  }

  if (isValid) {
    showStep(currentStep + 1);
  }
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('quiz-submit')) {
    e.preventDefault();
    
    // Validate form
    const form = document.getElementById('quiz-form');
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');

    if (!nameInput.value.trim()) {
      alert('Bitte gib deinen Namen ein');
      return;
    }

    if (!emailInput.value.trim() || !emailInput.checkValidity()) {
      alert('Bitte gib eine gültige E-Mail-Adresse ein');
      return;
    }

    // Save contact info
    answers.contact = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: form.querySelector('input[type="tel"]').value.trim(),
      notes: form.querySelector('textarea').value.trim()
    };

    // Prepare email data
    const emailData = {
      to: 'boxology.help@gmail.com',
      subject: 'Neue Box-Anfrage von ' + answers.contact.name,
      body: `Neue Box-Anfrage erhalten:
      
Name: ${answers.contact.name}
Email: ${answers.contact.email}
Telefon: ${answers.contact.phone || 'Keine Angabe'}

Empfänger: ${answers.recipient}
Alter: ${answers.age}
Geschlecht: ${answers.gender}
Beziehung: ${answers.relationship}
Interessen: ${answers.interests.join(', ')}
Anlass: ${answers.occasion}
Budget: ${answers.budget}
Stil: ${answers.style}

Besondere Wünsche:
${answers.contact.notes || 'Keine besonderen Wünsche'}

Gesammelte Antworten:
${JSON.stringify(answers, null, 2)}`
    };

    // Send email using mailto link
    const mailtoLink = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
    window.open(mailtoLink, '_blank');

    // Show thank you step
    showStep(currentStep + 1);

    // Reset form after delay
    setTimeout(() => {
      document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      form.reset();
      showStep(0);
      answers.recipient = '';
      answers.age = '';
      answers.gender = '';
      answers.relationship = '';
      answers.interests = [];
      answers.occasion = '';
      answers.budget = '';
      answers.style = '';
      answers.contact = {};
    }, 10000);
  }
});

function subscribeNewsletter(e) {
  e.preventDefault();
  const email = e.target.closest('form').querySelector('input[type="email"]').value;
  if (!email || !email.includes('@')) {
    alert('Bitte gib eine gültige E-Mail-Adresse ein');
    return;
  }
  alert('Vielen Dank für deine Anmeldung!');
  e.target.closest('form').reset();
}


// Cart functionality
const cartCount = document.querySelector('.cart-count');
let cartItems = 0;

// In a real app, this would be triggered when adding a product
function updateCart() {
cartCount.textContent = cartItems;
if (cartItems > 0) {
cartCount.style.display = 'flex';
} else {
cartCount.style.display = 'none';
}
}

// Simulate adding to cart
setTimeout(() => {
cartItems = 1;
updateCart();
}, 3000);

// Back to top button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', function() {
if (window.pageYOffset > 300) {
backToTopButton.classList.add('visible');
} else {
backToTopButton.classList.remove('visible');
}
});

backToTopButton.addEventListener('click', function() {
window.scrollTo({
top: 0,
behavior: 'smooth'
});
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function(e) {
e.preventDefault();

const targetId = this.getAttribute('href');
if (targetId === '#') return;

const targetElement = document.querySelector(targetId);
if (targetElement) {
window.scrollTo({
top: targetElement.offsetTop - 100,
behavior: 'smooth'
});
}
});
});

// Animation on scroll
function animateOnScroll() {
const elements = document.querySelectorAll('.fade-in');

elements.forEach(element => {
const elementPosition = element.getBoundingClientRect().top;
const screenPosition = window.innerHeight / 1.3;

if (elementPosition < screenPosition) {
element.style.opacity = '1';
}
});
}

// Set initial state for fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
el.style.opacity = '0';
el.style.transition = 'opacity 0.8s ease-out';
});

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);