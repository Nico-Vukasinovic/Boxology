
document.addEventListener('DOMContentLoaded', function() {
    // Initialize feather icons
    feather.replace();
    
    // Typewriter effect for hero text
const heroText = document.querySelector('.hero-text');
    if (heroText) {
        const text = heroText.dataset.text;
        let i = 0;
        const typing = setInterval(() => {
            heroText.textContent = text.substring(0, i);
            i++;
            if (i > text.length) clearInterval(typing);
        }, 100);
    }

    // Animate elements when they come into view
    const animateOnScroll = () => {
const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
    // Mobile menu toggle with device detection
    function setupMobileMenu() {
        const mobileMenuButton = document.querySelector('#mobileMenuButton');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenuButton && navLinks) {
            // Initial setup based on screen size
            function checkScreenSize() {
                if (window.innerWidth <= 768) {
                    mobileMenuButton.style.display = 'block';
                    navLinks.style.display = 'none';
                } else {
                    mobileMenuButton.style.display = 'none';
                    navLinks.style.display = 'flex';
                    navLinks.classList.remove('open');
                }
            }

            // Set up event listener for menu button
            mobileMenuButton.addEventListener('click', () => {
                navLinks.classList.toggle('open');
                const icon = mobileMenuButton.querySelector('i');
                if (navLinks.classList.contains('open')) {
                    navLinks.style.display = 'flex';
                    icon.setAttribute('data-feather', 'x');
                } else {
                    navLinks.style.display = 'none';
                    icon.setAttribute('data-feather', 'menu');
                }
                feather.replace();
            });

            // Check screen size on load and resize
            checkScreenSize();
            window.addEventListener('resize', checkScreenSize);
        }
    }

    // Initialize mobile menu
    setupMobileMenu();
// Dark mode toggle (if needed)
    const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
        });
    }
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    // B2B Form Handling
    const handleB2BForm = () => {
        const form = document.getElementById('b2bContactForm');
        const submitBtn = document.getElementById('b2bSubmitBtn');
        const formStatus = document.getElementById('formStatus');
        
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending... <i data-feather="loader" class="ml-2 w-5 h-5 animate-spin"></i>';
                feather.replace();
                
                try {
                    const formData = new FormData(form);
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        formStatus.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4';
                        formStatus.innerHTML = 'Thank you! Our B2B team will contact you within 24 hours.';
                        formStatus.classList.remove('hidden');
                        form.reset();
                    } else {
                        throw new Error('Form submission failed');
                    }
                } catch (error) {
                    console.error('Error submitting form:', error);
                    formStatus.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4';
                    formStatus.innerHTML = 'There was a problem submitting your form. Please try again or contact us directly.';
                    formStatus.classList.remove('hidden');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Submit Inquiry <i data-feather="arrow-right" class="ml-2 w-5 h-5"></i>';
                    feather.replace();
                }
            });
        }
    };
    // Cart functionality
    const updateCartDisplay = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }
    };
// Initialize functions
            updateCartDisplay();
            handleB2BForm();
            // Initialize counter animation for B2B page
            if (document.querySelector('.counter')) {
                const counters = document.querySelectorAll('.counter');
                const speed = 100; // The lower the faster
                const duration = 2000; // Animation duration in ms
                
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const start = 0;
                    const increment = target / (duration / speed);
                    let current = start;
                    
                    const updateCount = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            setTimeout(updateCount, speed);
                        } else {
                            counter.innerText = target;
                            if (counter.nextElementSibling && counter.nextElementSibling.textContent === '%') {
                                counter.nextElementSibling.style.opacity = '1';
                            }
                        }
                    };

                    // Start animation when element comes into view
                    const observer = new IntersectionObserver((entries) => {
                        if (entries[0].isIntersecting) {
                            updateCount();
                            observer.unobserve(counter);
                        }
                    }, { threshold: 0.5 });

                    observer.observe(counter.parentElement);
                });
            }
// Add to cart functionality
    const addToCartBtn = document.getElementById('addToCart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get current cart from localStorage or initialize empty array
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            // Check which box is being added
            let boxId, boxName, boxPrice, boxImage;
            
            if (window.location.pathname.includes('love-box')) {
                boxId = 'love-box';
                boxName = 'The Love Box';
                boxPrice = 129;
                boxImage = 'http://static.photos/love/200x200/42';
            } else if (window.location.pathname.includes('celebration-box')) {
                boxId = 'celebration-box';
                boxName = 'The Celebration Box';
                boxPrice = 149;
                boxImage = 'http://static.photos/celebration/200x200/42';
            } else if (window.location.pathname.includes('appreciation-box')) {
                boxId = 'appreciation-box';
                boxName = 'The Appreciation Box';
                boxPrice = 159;
                boxImage = 'http://static.photos/office/200x200/42';
            } else if (window.location.pathname.includes('wellness-box')) {
                boxId = 'wellness-box';
                boxName = 'The Wellness Box';
                boxPrice = 99;
                boxImage = 'http://static.photos/wellness/200x200/42';
            } else if (window.location.pathname.includes('gourmet-box')) {
                boxId = 'gourmet-box';
                boxName = 'The Gourmet Box';
                boxPrice = 139;
                boxImage = 'http://static.photos/food/200x200/42';
            } else if (window.location.pathname.includes('adventure-box')) {
                boxId = 'adventure-box';
                boxName = 'The Adventure Box';
                boxPrice = 119;
                boxImage = 'http://static.photos/adventure/200x200/42';
            }
            
            const boxItem = {
                id: boxId,
                name: boxName,
                price: boxPrice,
                quantity: 1,
                image: boxImage
            };
            
            const existingItem = cart.find(item => item.id === boxId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push(boxItem);
            }
// Save updated cart
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            
            // Show success message
            const notification = document.createElement('div');
            notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate__animated animate__fadeInUp';
            notification.innerHTML = `
                <div class="flex items-center">
                    <i data-feather="check-circle" class="w-5 h-5 mr-2"></i>
                    Added to cart! <a href="/cart.html" class="ml-2 underline">View Cart</a>
                </div>
            `;
            document.body.appendChild(notification);
            
            // Feather icons replacement
            feather.replace();
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.classList.add('animate__fadeOutDown');
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        });
    }
});
