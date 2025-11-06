class CustomFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        
        // WICHTIG: Prüfe, ob Feather bereits geladen ist
        if (window.feather) {
            this.replaceIcons();
        } else {
            // Warte bis Feather geladen ist
            window.addEventListener('feather-loaded', () => this.replaceIcons());
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: #111827;
                    color: rgba(255, 255, 255, 0.7);
                    padding: 4rem 2rem;
                    margin-top: auto;
                }
                .footer-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 2rem;
                }
                .footer-section h3 {
                    color: white;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                .footer-section a {
                    color: rgba(255, 255, 255, 0.7);
                    text-decoration: none;
                    display: block;
                    padding: 0.25rem 0;
                    transition: color 0.2s ease;
                }
                .footer-section a:hover {
                    color: white;
                }
                .footer-logo {
                    font-family: 'Playfair Display', serif;
                    font-weight: 700;
                    font-size: 1.5rem;
                    color: white;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .footer-logo-icon {
                    margin-right: 0.5rem;
                    color: #f59e0b;
                }
                .footer-description {
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                }
                .social-links {
                    display: flex;
                    gap: 1rem;
                }
                .social-link {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    text-decoration: none;
                    transition: background-color 0.2s ease;
                }
                .social-link:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                }
                .copyright {
                    text-align: center;
                    margin-top: 3rem;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.5);
                }
                @media (max-width: 768px) {
                    .footer-container {
                        grid-template-columns: 1fr;
                        text-align: center;
                    }
                    .social-links {
                        justify-content: center;
                    }
                    .footer-logo {
                        justify-content: center;
                    }
                }
            </style>
            
            <footer>
                <div class="footer-container">
                    <div class="footer-section">
                        <a href="/" class="footer-logo">
                            <i data-feather="box" class="footer-logo-icon"></i>
                            Boxology
                        </a>
                        <p class="footer-description">
                            Crafting meaningful gifting experiences that create lasting memories and bring joy to both giver and receiver.
                        </p>
                        <div class="social-links">
                            <a href="#" class="social-link" aria-label="Instagram">
                                <i data-feather="instagram"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="Facebook">
                                <i data-feather="facebook"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="Twitter">
                                <i data-feather="twitter"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="Pinterest">
                                <i data-feather="pinterest"></i>
                            </a>
                        </div>
                    </div>
                    
                    <div class="footer-section">
                        <h3>Collections</h3>
                        <a href="/Boxology/love-box.html">The Love Box</a>
                        <a href="/Boxology/celebration-box.html">The Celebration Box</a>
                        <a href="/Boxology/appreciation-box.html">The Appreciation Box</a>
                        <a href="/Boxology/build.html">Build Your Own</a>
                    </div>
                    
                    <div class="footer-section">
                        <h3>Company</h3>
                        <a href="/Boxology/about.html">Our Story</a>
                        <a href="/Boxology/contact.html">Contact Us</a>
                        <a href="/Boxology/contact-b2b.html">B2B Solutions</a>
                        <a href="/Boxology/careers.html">Careers</a>
                    </div>
                    
<div class="footer-section">
    <h3>Support</h3>
    <a href="/Boxology/faq.html">FAQ</a>
    <a href="/Boxology/shipping.html">Shipping Info</a>
    <a href="/Boxology/returns.html">Returns</a>
    <a href="/Boxology/terms.html">Terms & Conditions</a>
    <a href="/Boxology/imprint.html">Impressum</a>
    <a href="/Boxology/privacy.html" class="hover:underline">Privacy Policy</a>
</div>
                </div>
                
                <div class="copyright">
                    <p>&copy; 2024 Boxology. All rights reserved. Made with ❤️ for meaningful connections.</p>
                </div>
            </footer>
        `;
    }

    replaceIcons() {
        if (window.feather) {
            feather.replace({ container: this.shadowRoot });
        }
    }
}

customElements.define('custom-footer', CustomFooter);

// Signalisieren, dass Feather geladen ist
window.dispatchEvent(new Event('feather-loaded'));
