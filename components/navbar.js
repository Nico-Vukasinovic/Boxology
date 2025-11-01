class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: #111827;
                    color: rgba(255, 255, 255, 0.7);
                    padding: 4rem 2rem;
                }
                
                .footer-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 2rem;
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
                    background-color: rgba(255, 255,
