
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
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                try {
                    // In a real app, you would send this to your backend
                    // const response = await fetch('/api/b2b-contact', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     },
                    //     body: JSON.stringify(data),
                    // });
                    
                    // Show success message
                    const notification = document.createElement('div');
                    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate__animated animate__fadeInUp';
                    notification.innerHTML = `
                        <div class="flex items-center">
                            <i data-feather="check-circle" class="w-5 h-5 mr-2"></i>
                            Thank you! Our B2B team will contact you within 24 hours.
                        </div>
                    `;
                    document.body.appendChild(notification);
                    
                    form.reset();
                    feather.replace();
                    
                    setTimeout(() => {
                        notification.classList.add('animate__fadeOutDown');
                        setTimeout(() => notification.remove(), 500);
                    }, 5000);
                    
                } catch (error) {
                    console.error('Error submitting form:', error);
                    // Show error message
                }
            });
        }
    };

    // Cart functionality
    const updateCartDisplay = () => {
const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    };
    // Initialize functions
    updateCartDisplay();
    handleB2BForm();
// Add to cart functionality
    const addToCartBtn = document.getElementById('addToCart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get current cart from localStorage or initialize empty array
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Add Love Box to cart if not already there
            // Check which box is being added
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
                cart.push(loveBoxItem);
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
