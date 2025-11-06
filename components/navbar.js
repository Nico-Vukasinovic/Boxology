class CustomNavbar extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
    this.setupEventListeners();
    this.updateCartCount();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background: rgba(34, 34, 34, 0.95);
          color: #fff;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease;
        }
        
        nav {
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .logo {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 2rem;
          color: white;
          text-decoration: none;
          display: flex;
          align-items: center;
          z-index: 60;
          transition: all 0.3s ease;
        }
        
        .logo:hover {
          transform: scale(1.05);
          text-shadow: 0 0 15px rgba(245, 158, 11, 0.5);
        }
        
        .logo-icon {
          margin-right: 0.75rem;
          color: #f59e0b;
          transition: transform 0.3s ease;
        }
        
        .logo:hover .logo-icon {
          transform: rotate(15deg) scale(1.1);
        }
        
        .nav-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          gap: 2.5rem;
          align-items: center;
        }
        
        .nav-link {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-weight: 500;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          position: relative;
          padding: 0.5rem 0;
        }
        
        .nav-link:hover {
          color: white;
          transform: translateY(-2px);
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .nav-link i {
          margin-right: 0.5rem;
          transition: transform 0.3s ease;
        }
        
        .nav-link:hover i {
          transform: translateY(-3px);
        }
        
        .cta-button {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          padding: 0.75rem 1.75rem;
          border-radius: 9999px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-decoration: none;
          font-size: 1.1rem;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }
        
        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: 0.5s;
        }
        
        .cta-button:hover::before {
          left: 100%;
        }
        
        .nav-toggle {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }
        
        .bar {
          width: 25px;
          height: 3px;
          background: #fff;
          transition: all 0.3s ease;
        }
        
        .cart-count {
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          color: white;
          border-radius: 9999px;
          font-size: 0.85rem;
          padding: 0.2rem 0.6rem;
          margin-left: 0.5rem;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
          transition: all 0.3s ease;
        }
        
        .nav-link:hover .cart-count {
          transform: scale(1.1);
        }
        
        /* Desktop Enhancements */
        @media (min-width: 769px) {
          :host {
            padding: 0.5rem 0;
          }
          
          .logo {
            font-size: 2rem;
          }
          
          .nav-link {
            font-size: 1.1rem;
          }
          
          .cta-button {
            font-size: 1.1rem;
          }
        }
        
        /* Mobile Styles (unverändert) */
        @media (max-width: 768px) {
          nav {
            padding: 1rem;
          }
          
          .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            background: #222;
            max-height: 0;
            overflow: hidden;
            transition: max-height .3s ease;
            padding: 0 1rem;
            gap: 0;
          }
          
          .nav-links.open {
            max-height: 70vh;
            overflow-y: auto;
            padding: 1rem;
            gap: 0.5rem;
          }
          
          .nav-toggle {
            display: flex;
          }
          
          .cta-button {
            width: 100%;
            text-align: center;
            justify-content: center;
            margin-top: 1rem;
          }
          
          .nav-link {
            font-size: 1.1rem;
            padding: 0.75rem 0;
            width: 100%;
            justify-content: center;
          }
          
          .nav-link::after {
            display: none;
          }
        }
        
        @media (max-width: 480px) {
          nav {
            padding: 0.75rem 1rem;
          }
          
          .logo {
            font-size: 1.5rem;
          }
        }
      </style>
      
      <nav>
        <a href="/" class="logo">
          <i data-feather="box" class="logo-icon"></i>
          Boxology
        </a>
        <div class="nav-links">
          <a href="/Boxology/collections.html" class="nav-link">
            <i data-feather="gift"></i>
            Collections
          </a>
          <a href="/Boxology/build.html" class="nav-link">
            <i data-feather="edit"></i>
            Build a Box
          </a>
          <a href="/Boxology/about.html" class="nav-link">
            <i data-feather="info"></i>
            Our Story
          </a>
          <a href="/Boxology/contact.html" class="nav-link">
            <i data-feather="mail"></i>
            Contact
          </a>
          <a href="/Boxology/contact-b2b.html" class="nav-link">
            <i data-feather="briefcase"></i>
            B2B
          </a>
          <a href="/Boxology/cart.html" class="nav-link">
            <i data-feather="shopping-cart"></i>
            Cart
            <span class="cart-count" id="cart-count">0</span>
          </a>
          <a href="/Boxology/build.html" class="cta-button">
            Get Started
          </a>
        </div>
        <button class="nav-toggle" id="mobileMenuButton">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </nav>
    `;
  }

  setupEventListeners() {
    const menuButton = this.shadowRoot.getElementById('mobileMenuButton');
    const navLinks = this.shadowRoot.querySelector('.nav-links');
    const menuIcon = this.shadowRoot.querySelector('.logo-icon');

    menuButton.addEventListener('click', () => {
      this.isOpen = !this.isOpen;
      navLinks.classList.toggle('open');
      
      // Animate hamburger icon
      const bars = menuButton.querySelectorAll('.bar');
      if (this.isOpen) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      }
    });

    // Close menu when clicking a link (mobile)
    this.shadowRoot.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          this.isOpen = false;
          navLinks.classList.remove('open');
          const bars = menuButton.querySelectorAll('.bar');
          bars[0].style.transform = '';
          bars[1].style.opacity = '';
          bars[2].style.transform = '';
        }
      });
    });

    // Close menu on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.isOpen = false;
        navLinks.classList.remove('open');
        const bars = menuButton.querySelectorAll('.bar');
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      }
    });
  }

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCount = this.shadowRoot.getElementById('cart-count');
    
    if (cartCount) {
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
  }
}

customElements.define('custom-navbar', CustomNavbar);
