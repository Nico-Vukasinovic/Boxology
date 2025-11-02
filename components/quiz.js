class CustomQuiz extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: #1f2937;
          border-radius: 0.75rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: white;
        }
        .question {
          margin-bottom: 2rem;
        }
        .question-title {
          font-weight: 600;
          margin-bottom: 1rem;
          color: #e5e7eb;
        }
        .options {
          display: grid;
          gap: 0.75rem;
        }
        .option {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          background: #374151;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .option:hover {
          background: #4b5563;
        }
        .option.selected {
          background: #3b82f6;
        }
        .option input {
          margin-right: 0.75rem;
        }
        .navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }
        button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .next-btn {
          background: #3b82f6;
          color: white;
          border: none;
        }
        .next-btn:hover {
          background: #2563eb;
        }
        .prev-btn {
          background: transparent;
          color: #9ca3af;
          border: 1px solid #4b5563;
        }
        .prev-btn:hover {
          background: #374151;
        }
        .results {
          display: none;
          padding: 1.5rem;
          background: #111827;
          border-radius: 0.5rem;
          margin-top: 1.5rem;
        }
        .results h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: white;
        }
        .result-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .result-item img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 0.5rem;
          margin-right: 1rem;
        }
        .progress-bar {
          height: 4px;
          background: #374151;
          border-radius: 2px;
          margin-bottom: 1.5rem;
          overflow: hidden;
        }
        .progress {
          height: 100%;
          background: #3b82f6;
          transition: width 0.3s;
        }
      </style>
      <div class="quiz-container">
        <h2>Find Your Perfect Box</h2>
        <div class="progress-bar">
          <div class="progress" id="progress"></div>
        </div>
        <div id="questions-container"></div>
        <div class="navigation">
          <button class="prev-btn" id="prev-btn" disabled>
            <i data-feather="chevron-left"></i> Previous
          </button>
          <button class="next-btn" id="next-btn">
            Next <i data-feather="chevron-right"></i>
          </button>
        </div>
        <div class="results" id="results">
          <h3>We Recommend</h3>
          <div id="recommendations"></div>
          <button class="next-btn" id="start-over-btn" style="margin-top: 1rem;">
            Start Over <i data-feather="refresh-cw"></i>
          </button>
        </div>
      </div>
    `;

    this.questions = [
      {
        question: "Who is this gift for?",
        options: [
          { text: "Romantic Partner", value: "romantic" },
          { text: "Family Member", value: "family" },
          { text: "Friend", value: "friend" },
          { text: "Colleague", value: "colleague" }
        ]
      },
      {
        question: "What's the occasion?",
        options: [
          { text: "Birthday", value: "birthday" },
          { text: "Anniversary", value: "anniversary" },
          { text: "Just Because", value: "just_because" },
          { text: "Thank You", value: "thank_you" }
        ]
      },
      {
        question: "What's their personality like?",
        options: [
          { text: "Romantic & Sentimental", value: "romantic" },
          { text: "Practical & Thoughtful", value: "practical" },
          { text: "Fun & Playful", value: "fun" },
          { text: "Sophisticated & Elegant", value: "sophisticated" }
        ]
      },
      {
        question: "What's your budget?",
        options: [
          { text: "Under $50", value: "under_50" },
          { text: "$50 - $100", value: "50_100" },
          { text: "$100 - $150", value: "100_150" },
          { text: "Over $150", value: "over_150" }
        ]
      }
    ];

    this.recommendations = {
      romantic: {
        id: "love-box",
        name: "The Love Box",
        price: 129,
        description: "Perfect for expressing love and affection",
        image: "http://static.photos/love/200x200/42",
        link: "/love-box.html"
      },
      family: {
        id: "family-box",
        name: "The Family Box",
        price: 99,
        description: "Celebrate family bonds with thoughtful items",
        image: "http://static.photos/family/200x200/42",
        link: "/collections.html"
      },
      friend: {
        id: "friendship-box",
        name: "The Friendship Box",
        price: 89,
        description: "Show your appreciation for a special friend",
        image: "http://static.photos/friends/200x200/42",
        link: "/collections.html"
      },
      colleague: {
        id: "appreciation-box",
        name: "The Appreciation Box",
        price: 119,
        description: "Professional yet thoughtful gift for colleagues",
        image: "http://static.photos/office/200x200/42",
        link: "/collections.html"
      }
    };

    this.currentQuestion = 0;
    this.answers = {};
    this.renderQuestion();
    this.setupEventListeners();
    feather.replace();
  }

  renderQuestion() {
    const container = this.shadowRoot.getElementById('questions-container');
    const progress = this.shadowRoot.getElementById('progress');
    const prevBtn = this.shadowRoot.getElementById('prev-btn');
    const nextBtn = this.shadowRoot.getElementById('next-btn');
    const results = this.shadowRoot.getElementById('results');

    // Update progress
    progress.style.width = `${((this.currentQuestion + 1) / this.questions.length) * 100}%`;

    // Hide results if showing
    results.style.display = 'none';

    // Update navigation buttons
    prevBtn.disabled = this.currentQuestion === 0;
    nextBtn.textContent = this.currentQuestion === this.questions.length - 1 ? 'See Results' : 'Next';
    nextBtn.innerHTML = this.currentQuestion === this.questions.length - 1 ? 
      'See Results <i data-feather="chevron-right"></i>' : 
      'Next <i data-feather="chevron-right"></i>';

    // Render current question
    const question = this.questions[this.currentQuestion];
    let html = `
      <div class="question">
        <div class="question-title">${question.question}</div>
        <div class="options">
    `;

    question.options.forEach((option, index) => {
      const isSelected = this.answers[this.currentQuestion] === index;
      html += `
        <div class="option ${isSelected ? 'selected' : ''}" data-index="${index}">
          <input type="radio" name="question-${this.currentQuestion}" id="option-${index}" 
            ${isSelected ? 'checked' : ''}>
          <label for="option-${index}">${option.text}</label>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;

    // Update feather icons
    feather.replace();
  }

  setupEventListeners() {
    this.shadowRoot.addEventListener('click', (e) => {
      // Handle option selection
      const option = e.target.closest('.option');
      if (option) {
        const options = this.shadowRoot.querySelectorAll('.option');
        options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        const index = parseInt(option.dataset.index);
        this.answers[this.currentQuestion] = index;
      }

      // Handle navigation buttons
      if (e.target.closest('#next-btn')) {
        if (this.currentQuestion < this.questions.length - 1) {
          this.currentQuestion++;
          this.renderQuestion();
        } else {
          this.showResults();
        }
      }

      if (e.target.closest('#prev-btn')) {
        this.currentQuestion--;
        this.renderQuestion();
      }

      if (e.target.closest('#start-over-btn')) {
        this.currentQuestion = 0;
        this.answers = {};
        this.renderQuestion();
      }
    });
  }

  showResults() {
    const container = this.shadowRoot.getElementById('questions-container');
    const results = this.shadowRoot.getElementById('results');
    const recommendations = this.shadowRoot.getElementById('recommendations');
    const nextBtn = this.shadowRoot.getElementById('next-btn');
    const prevBtn = this.shadowRoot.getElementById('prev-btn');

    // Hide questions and navigation
    container.style.display = 'none';
    nextBtn.style.display = 'none';
    prevBtn.style.display = 'none';

    // Determine recommendation based on first answer
    const firstAnswer = this.answers[0];
    const recommendationKey = this.questions[0].options[firstAnswer].value;
    const recommendation = this.recommendations[recommendationKey];

    // Show results
    recommendations.innerHTML = `
      <div class="result-item">
        <img src="${recommendation.image}" alt="${recommendation.name}">
        <div>
          <h4>${recommendation.name}</h4>
          <p>${recommendation.description}</p>
          <p class="text-primary font-bold">$${recommendation.price}</p>
          <a href="${recommendation.link}" class="text-blue-400 hover:text-blue-300 mt-2 inline-block">
            View Details <i data-feather="arrow-right" class="w-4 h-4"></i>
          </a>
        </div>
      </div>
    `;

    results.style.display = 'block';
    feather.replace();
  }
}

customElements.define('custom-quiz', CustomQuiz);
