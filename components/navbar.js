class CustomNavbar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 50;
                    background-color: rgba(17, 24, 39, 0.8);
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                }
                
                nav {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 1.5rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .logo {
                    font-family: 'Playfair Display', serif;
                    font-weight: 700;
                    font-size: 1.5rem;
                    color: white;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                }
                
                .logo-icon {
                    margin-right: 0.5rem;
                    color: #f59e0b;
                }
                
                .nav-links {
                    display: flex;
                    gap: 2rem;
                }
                
                .nav-link {
                    color: rgba(255, 255, 255, 0.8);
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.2s ease;
                    display: flex;
                    align-items: center;
                }
                
                .nav-link:hover {
                    color: white;
                }
                
                .nav-link i {
                    margin-right: 0.5rem;
                }
                
                .cta-button {
                    background-color: #3b82f6;
                    color: white;
                    padding: 0.5rem 1.5rem;
                    border-radius: 9999px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                
                .cta-button:hover {
                    background-color: #2563eb;
                    transform: translateY(-1px);
                }
                
                .mobile-menu-button {
                    display: none;
                }
                
                @media (max-width: 768px) {
                    .nav-links {
                        display: none;
                    }
                    
                    .mobile-menu-button {
                        display: block;
                    }
                }
            </style>
            
            <nav>
                <a href="/" class="logo">
                    <i data-feather="box" class="logo-icon"></i>
                    Boxology
                </a>
                <div class="nav-links">
                    <a href="collections.html" class="nav-link">
                        <i data-feather="gift"></i>
                        Collections
                    </a>
                    <a href="build.html" class="nav-link">
                        <i data-feather="edit"></i>
                        Build a Box
                    </a>
                    <a href="about.html" class="nav-link">
                        <i data-feather="info"></i>
                        Our Story
                    </a>
                    <a href="contact.html" class="nav-link">
                        <i data-feather="mail"></i>
                        Contact
                    </a>
                    <a href="contact-b2b.html" class="nav-link">
                        <i data-feather="briefcase"></i>
                        B2B
                    </a>
<a href="cart.html" class="nav-link">
                        <i data-feather="shopping-cart"></i>
                        Cart
                    </a>
<a href="build.html" class="cta-button">
                        Get Started
                    </a>
</div>
                
                <button class="mobile-menu-button text-white">
                    <i data-feather="menu"></i>
                </button>
            </nav>
        `;
    }
}

customElements.define('custom-navbar', CustomNavbar);
