class QuizBoxBuilder extends HTMLElement {
  constructor() {
    super();
    this.steps = [
      {
        title: "What's your budget?",
        key: "budget",
        type: "range",
        min: 50,
        max: 300,
        step: 25
      },
      {
        title: "Who is this gift for?",
        key: "recipient",
        type: "buttons",
        options: [
          { label: "Partner", icon: "heart", value: "partner" },
          { label: "Parent", icon: "users", value: "parent" },
          { label: "Friend", icon: "smile", value: "friend" },
          { label: "Colleague", icon: "briefcase", value: "colleague" }
        ]
      },
      {
        title: "What's the occasion?",
        key: "occasion",
        type: "buttons",
        options: [
          { label: "Birthday", icon: "cake", value: "birthday" },
          { label: "Anniversary", icon: "calendar", value: "anniversary" },
          { label: "Holiday", icon: "home", value: "holiday" },
          { label: "Just Because", icon: "sun", value: "just_because" }
        ]
      },
      {
        title: "What are their interests?",
        key: "interests",
        type: "chips",
        options: [
          "Reading", "Travel", "Cooking", "Music", 
          "Art", "Sports", "Technology", "Fashion"
        ]
      },
      {
        title: "What size box?",
        key: "size",
        type: "buttons",
        options: [
          { label: "Small (6\" x 6\")", icon: "box", value: "small" },
          { label: "Medium (10\" x 8\")", icon: "box", value: "medium" },
          { label: "Large (12\" x 12\")", icon: "box", value: "large" }
        ]
      }
    ];
    this.currentStep = 0;
    this.answers = {};
    this.items = {
      small: { price: 39, items: 3 },
      medium: { price: 59, items: 6 },
      large: { price: 89, items: 9 }
    };
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
    this.setupEventListeners();
    this.updateBoxVisualization();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Inter', sans-serif;
          --primary: #3b82f6;
          --primary-dark: #2563eb;
        }

        .builder-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .quiz-container {
          background: rgba(31, 41, 55, 0.9);
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .quiz-step {
          display: none;
          animation: fadeIn 0.5s ease;
        }
        
        .quiz-step.active {
          display: block;
        }

        .step-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 2rem;
          color: white;
          text-align: center;
        }

        .range-container {
          margin: 2rem 0;
        }

        .range-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          color: #d1d5db;
        }

        input[type="range"] {
          width: 100%;
          height: 10px;
          -webkit-appearance: none;
          background: #374151;
          border-radius: 5px;
          outline: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          background: var(--primary);
          border-radius: 50%;
          cursor: pointer;
        }

        .option-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 1rem;
        }

        .option-button {
          padding: 1rem;
          background: #374151;
          border-radius: 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }

        .option-button:hover {
          background: #4B5563;
        }

        .option-button.selected {
          border-color: var(--primary);
          background: rgba(59, 130, 246, 0.1);
        }

        .option-button i {
          width: 24px;
          height: 24px;
          margin-bottom: 0.5rem;
        }

        .chips-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .chip {
          padding: 0.5rem 1rem;
          background: #374151;
          border-radius: 9999px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .chip.selected {
          background: var(--primary);
          color: white;
        }

        .navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }

        .nav-button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .prev-btn {
          background: none;
          border: 1px solid #4B5563;
          color: #D1D5DB;
        }

        .prev-btn:hover {
          background: #374151;
        }

        .next-btn {
          background: var(--primary);
          border: none;
          color: white;
        }

        .next-btn:hover {
          background: var(--primary-dark);
        }

        .preview-container {
          display: none;
        }

        @media (min-width: 768px) {
          .builder-container {
            grid-template-columns: 1fr 1fr;
          }
          .preview-container {
            display: block;
            position: sticky;
            top: 1rem;
            height: fit-content;
          }
        }

        .box-visualization {
          background: #111827;
          border-radius: 1rem;
          padding: 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .box-3d {
          width: 200px;
          height: 200px;
          position: relative;
          transform-style: preserve-3d;
          transform: rotateX(-20deg) rotateY(30deg);
          transition: all 0.3s ease;
        }

        .box-side {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid rgba(255,255,255,0.1);
          background: var(--box-color, #1e40af);
          box-shadow: inset 0 0 30px rgba(0,0,0,0.2);
        }

        .box-front { transform: translateZ(100px); }
        .box-back { transform: translateZ(-100px); }
        .box-right { transform: rotateY(90deg) translateZ(100px); }
        .box-left { transform: rotateY(-90deg) translateZ(100px); }
        .box-top { transform: rotateX(90deg) translateZ(100px); }
        .box-bottom { transform: rotateX(-90deg) translateZ(100px); }

        .box-details {
          margin-top: 2rem;
          text-align: center;
          color: #d1d5db;
        }

        .box-price {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          margin: 0.5rem 0;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #374151;
          border-radius: 3px;
          margin: 2rem 0;
          overflow: hidden;
        }

        .progress {
          height: 100%;
          background: var(--primary);
          transition: width 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>

      <div class="builder-container">
        <div class="quiz-container">
          <div class="progress-bar">
            <div class="progress" style="width: ${(this.currentStep / this.steps.length) * 100}%"></div>
          </div>

          ${this.steps.map((step, index) => `
            <div class="quiz-step ${index === 0 ? 'active' : ''}" data-step="${index}">
              <h2 class="step-title">${step.title}</h2>
              
              ${step.type === 'range' ? `
                <div class="range-container">
                  <input type="range" id="${step.key}" min="${step.min}" max="${step.max}" step="${step.step}" 
                    value="${(step.max + step.min) / 2}">
                  <div class="range-labels">
                    <span>$${step.min}</span>
                    <span>$${step.max}+</span>
                  </div>
                </div>
              ` : ''}

              ${step.type === 'buttons' ? `
                <div class="option-buttons">
                  ${step.options.map(option => `
                    <div class="option-button" data-value="${option.value}">
                      <i data-feather="${option.icon}"></i>
                      <span>${option.label}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              ${step.type === 'chips' ? `
                <div class="chips-container">
                  ${step.options.map(option => `
                    <div class="chip" data-value="${option.toLowerCase()}">${option}</div>
                  `).join('')}
                </div>
              ` : ''}

              <div class="navigation">
                ${index > 0 ? `<button class="nav-button prev-btn">Back</button>` : '<div></div>'}
                <button class="nav-button next-btn">
                  ${index === this.steps.length - 1 ? 'Complete' : 'Next'}
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="preview-container">
          <div class="box-visualization">
            <div class="box-3d">
              <div class="box-side box-front"></div>
              <div class="box-side box-back"></div>
              <div class="box-side box-right"></div>
              <div class="box-side box-left"></div>
              <div class="box-side box-top"></div>
              <div class="box-side box-bottom"></div>
            </div>
            
            <div class="box-details">
              <h3>Your Custom Box</h3>
              <div class="box-price">$${this.items.medium.price}</div>
              <p>Medium size with 6 items</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    this.shadowRoot.querySelectorAll('.option-button').forEach(button => {
      button.addEventListener('click', () => {
        const stepIndex = parseInt(button.closest('.quiz-step').dataset.step);
        const step = this.steps[stepIndex];
        const value = button.dataset.value;
        
        this.answers[step.key] = value;
        button.closest('.option-buttons').querySelectorAll('.option-button').forEach(btn => {
          btn.classList.remove('selected');
        });
        button.classList.add('selected');
        
        if (step.key === 'size') {
          this.updateBoxVisualization();
        }
      });
    });

    this.shadowRoot.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
        const stepIndex = parseInt(chip.closest('.quiz-step').dataset.step);
        const step = this.steps[stepIndex];
        
        const selectedChips = Array.from(chip.closest('.chips-container').querySelectorAll('.chip.selected'))
          .map(c => c.dataset.value);
        
        this.answers[step.key] = selectedChips;
      });
    });

    this.shadowRoot.querySelectorAll('input[type="range"]').forEach(range => {
      range.addEventListener('input', () => {
        const stepIndex = parseInt(range.closest('.quiz-step').dataset.step);
        const step = this.steps[stepIndex];
        this.answers[step.key] = parseInt(range.value);
      });
    });

    this.shadowRoot.querySelectorAll('.next-btn').forEach(button => {
      button.addEventListener('click', () => {
        const currentStep = parseInt(button.closest('.quiz-step').dataset.step);
        this.goToStep(currentStep + 1);
      });
    });

    this.shadowRoot.querySelectorAll('.prev-btn').forEach(button => {
      button.addEventListener('click', () => {
        const currentStep = parseInt(button.closest('.quiz-step').dataset.step);
        this.goToStep(currentStep - 1);
      });
    });
  }

  goToStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.shadowRoot.querySelectorAll('.quiz-step').forEach(step => {
        step.classList.remove('active');
      });
      this.shadowRoot.querySelector(`.quiz-step[data-step="${stepIndex}"]`).classList.add('active');
      
      this.currentStep = stepIndex;
      this.shadowRoot.querySelector('.progress').style.width = `${(stepIndex / this.steps.length) * 100}%`;
      
      if (stepIndex === this.steps.length - 1) {
        this.generateBoxRecommendation();
      }
    }
  }

  updateBoxVisualization() {
    const size = this.answers.size || 'medium';
    const box = this.items[size];
    const box3d = this.shadowRoot.querySelector('.box-3d');
    
    // Update size
    const scale = size === 'small' ? 0.8 : size === 'medium' ? 1 : 1.2;
    box3d.style.transform = `rotateX(-20deg) rotateY(30deg) scale(${scale})`;
    
    // Update details
    const details = this.shadowRoot.querySelector('.box-details');
    details.querySelector('.box-price').textContent = `$${box.price}`;
    details.querySelector('p').textContent = `${size} size with ${box.items} items`;
  }

  generateBoxRecommendation() {
    const size = this.answers.size || 'medium';
    const price = this.answers.budget || this.items[size].price;
    const recipient = this.answers.recipient || 'friend';
    const occasion = this.answers.occasion || 'birthday';
    const interests = this.answers.interests || [];

    // In a real app, we would fetch recommended items from an API
    // Here we just simulate recommendations
    setTimeout(() => {
      alert(`Your custom ${size} box ($${price}) for ${recipient}'s ${occasion} has been created!`);
      // Dispatch event to add to cart
      this.dispatchEvent(new CustomEvent('box-created', {
        detail: {
          size,
          price,
          recipient,
          occasion,
          interests
        }
      }));
    }, 500);
  }
}

customElements.define('quiz-box-builder', QuizBoxBuilder);
