// Frontend-Integration für Boxology
// Diese Funktionen ersetzen/erweitern den vorherigen Warenkorb-Code

const API_BASE_URL = 'https://api.boxology.at'; // Ihre Backend-URL

// API Helper Function
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API-Fehler');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Stripe Integration
let stripe;
let elements;

async function initializeStripe() {
  stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY'); // Ihre Stripe Public Key
  
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#ff6b6b',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '4px'
    }
  };

  elements = stripe.elements({ appearance });
}

// Verbesserte Bestellabwicklung mit Backend-Integration
async function submitOrder(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const errors = validateCheckoutForm(formData);
  
  if (errors.length > 0) {
    alert('Bitte korrigieren Sie folgende Fehler:\n\n' + errors.join('\n'));
    return;
  }
  
  showLoading(true);
  
  try {
    // 1. Bestelldaten vorbereiten
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const giftWrapCost = cart.filter(item => item.options?.giftWrap).length * 2.50;
    
    const orderData = {
      customer: {
        name: formData.get('name')?.trim(),
        email: formData.get('email')?.trim(),
        phone: formData.get('phone')?.trim() || null,
        address: formData.get('address')?.trim(),
        zip: formData.get('zip')?.trim(),
        city: formData.get('city')?.trim(),
        notes: formData.get('notes')?.trim() || null
      },
      delivery: {
        isGift: formData.get('isGift') === 'on',
        recipientName: formData.get('recipientName')?.trim() || null,
        recipientAddress: formData.get('recipientAddress')?.trim() || null,
        giftMessage: formData.get('giftMessage')?.trim() || null,
        deliveryDate: formData.get('deliveryDate') || null
      },
      items: cart,
      pricing: {
        subtotal: subtotal,
        giftWrapCost: giftWrapCost,
        total: subtotal + giftWrapCost
      }
    };

    // 2. Bestellung an Backend senden
    const orderResponse = await apiCall('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });

    // 3. Payment Intent erstellen
    const paymentResponse = await apiCall('/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        amount: orderData.pricing.total,
        orderId: orderResponse.orderId
      })
    });

    // 4. Stripe Checkout anzeigen
    await processPayment(paymentResponse.clientSecret, orderResponse.orderNumber);

  } catch (error) {
    console.error('Bestellfehler:', error);
    alert('Ein Fehler ist aufgetreten: ' + error.message);
  } finally {
    showLoading(false);
  }
}

// Stripe Payment verarbeiten
async function processPayment(clientSecret, orderNumber) {
  if (!stripe || !elements) {
    await initializeStripe();
  }

  const paymentElement = elements.create('payment');
  
  // Payment Element in Modal anzeigen
  const paymentModal = document.getElementById('paymentModal');
  const paymentElementContainer = document.getElementById('payment-element');
  
  paymentElement.mount(paymentElementContainer);
  paymentModal.style.display = 'flex';
  
  // Payment Form Handler
  document.getElementById('payment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading(true);

    const {error} = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation?orderNumber=${orderNumber}`,
      },
    });

    if (error) {
      alert('Zahlungsfehler: ' + error.message);
      showLoading(false);
    }
    // Bei Erfolg wird zur return_url weitergeleitet
  });
}

// Bestellstatus abfragen
async function checkOrderStatus(orderNumber) {
  try {
    const response = await apiCall(`/api/orders/${orderNumber}`);
    return response.order;
  } catch (error) {
    console.error('Fehler beim Abrufen des Bestellstatus:', error);
    return null;
  }
}

// Newsletter-Anmeldung
async function subscribeNewsletter(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;
  
  if (!email) {
    alert('Bitte geben Sie eine E-Mail-Adresse ein.');
    return;
  }

  try {
    await apiCall('/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    
    alert('Vielen Dank für Ihre Newsletter-Anmeldung! 🎁\n\nSie erhalten 10% Rabatt mit dem Code: WELCOME10');
    event.target.reset();
    
  } catch (error) {
    if (error.message.includes('bereits registriert')) {
      alert('Diese E-Mail-Adresse ist bereits für den Newsletter angemeldet.');
    } else {
      alert('Fehler bei der Anmeldung: ' + error.message);
    }
  }
}

// Personalisierte Box-Anfrage senden
async function submitCustomQuiz() {
  const form = document.getElementById('quiz-form');
  const formData = new FormData(form);
  
  try {
    const customBoxData = {
      customer: {
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value,
        notes: document.getElementById('customerNotes').value
      },
      answers: answers // Aus dem Quiz
    };

    const response = await apiCall('/api/custom-box-request', {
      method: 'POST',
      body: JSON.stringify(customBoxData)
    });

    showQuizConfirmation(response.requestNumber);
    
  } catch (error) {
    console.error('Quiz-Fehler:', error);
    alert('Fehler beim Senden der Anfrage: ' + error.message);
  }
}

// Verbesserte Quiz-Bestätigung
function showQuizConfirmation(requestNumber) {
  document.querySelectorAll('.quiz-step').forEach(step => {
    step.style.display = 'none';
  });
  
  const confirmationStep = document.getElementById('step-confirmation');
  if (confirmationStep) {
    confirmationStep.innerHTML = `
      <div class="confirmation-content">
        <div class="success-icon">🎉</div>
        <h2>Anfrage erfolgreich gesendet!</h2>
        <p><strong>Anfrage-Nummer:</strong> ${requestNumber}</p>
        <p>Vielen Dank für Ihr Interesse an einer personalisierten Box!</p>
        <p>Unser Team wird Ihre Angaben prüfen und Ihnen innerhalb von 24 Stunden ein individuelles Angebot per E-Mail zusenden.</p>
        <div class="next-steps">
          <h3>Wie geht es weiter?</h3>
          <ul>
            <li>📧 Sie erhalten eine Bestätigungs-E-Mail</li>
            <li>🎨 Unser Team erstellt Ihr personalisiertes Angebot</li>
            <li>💝 Nach Ihrer Bestätigung stellen wir Ihre Box zusammen</li>
            <li>🚚 Versand innerhalb von 3-5 Werktagen</li>
          </ul>
        </div>
        <button onclick="location.reload()" class="btn-primary">Neue Anfrage stellen</button>
        <button onclick="window.location.href='/'" class="btn-secondary">Zur Startseite</button>
      </div>
    `;
    confirmationStep.style.display = 'block';
  }
}

// Offline-Unterstützung
let isOnline = navigator.onLine;
const pendingOrders = [];

function handleOfflineOrder(orderData) {
  pendingOrders.push(orderData);
  localStorage.setItem('boxology-pending-orders', JSON.stringify(pendingOrders));
  
  alert('Sie sind momentan offline. Ihre Bestellung wird automatisch gesendet, sobald Sie wieder online sind.');
}

async function processPendingOrders() {
  const pending = JSON.parse(localStorage.getItem('boxology-pending-orders') || '[]');
  
  for (const orderData of pending) {
    try {
      await apiCall('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
      
      // Erfolgreich gesendet - aus Liste entfernen
      const index = pendingOrders.indexOf(orderData);
      if (index > -1) pendingOrders.splice(index, 1);
      
    } catch (error) {
      console.error('Fehler beim Senden der ausstehenden Bestellung:', error);
    }
  }
  
  localStorage.setItem('boxology-pending-orders', JSON.stringify(pendingOrders));
}

// Event Listeners für Online/Offline
window.addEventListener('online', () => {
  isOnline = true;
  processPendingOrders();
  showSuccessMessage('Verbindung wiederhergestellt - ausstehende Bestellungen werden verarbeitet', 'info');
});

window.addEventListener('offline', () => {
  isOnline = false;
  showSuccessMessage('Keine Internetverbindung - Bestellungen werden zwischengespeichert', 'warning');
});

// Push-Benachrichtigungen (Service Worker)
async function initializePushNotifications() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registriert:', registration);
      
      // Push-Berechtigung anfordern
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Push-Benachrichtigungen aktiviert');
      }
    } catch (error) {
      console.error('Service Worker Fehler:', error);
    }
  }
}

// Erweiterte Analytik
function trackEvent(eventName, eventData = {}) {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, eventData);
  }
  
  // Facebook Pixel
  if (typeof fbq !== 'undefined') {
    fbq('track', eventName, eventData);
  }
  
  // Eigene Analytik
  console.log('Event:', eventName, eventData);
}

// Event Tracking für E-Commerce
function trackPurchase(orderData) {
  const items = orderData.items.map(item => ({
    item_id: item.id,
    item_name: item.name,
    price: item.price,
    quantity: item.quantity
  }));

  trackEvent('purchase', {
    transaction_id: orderData.orderNumber,
    value: orderData.pricing.total,
    currency: 'EUR',
    items: items
  });
}

function trackAddToCart(item) {
  trackEvent('add_to_cart', {
    currency: 'EUR',
    value: item.price,
    items: [{
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: 1
    }]
  });
}

// Verbesserte addToCart-Funktion mit Tracking
function addToCart(name, price, id, options = {}) {
  const existingItem = cart.find(item => item.id === id && 
    JSON.stringify(item.options) === JSON.stringify(options));
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const newItem = {
      id: id,
      name: name,
      price: parseFloat(price),
      quantity: 1,
      options: options,
      addedAt: new Date().toISOString()
    };
    cart.push(newItem);
    
    // Analytics Event
    trackAddToCart(newItem);
  }
  
  saveCartToStorage();
  updateCartUI();
  showSuccessMessage(`${name} wurde zum Warenkorb hinzugefügt`);
}

// A/B Testing Framework
class ABTest {
  constructor(testName, variants) {
    this.testName = testName;
    this.variants = variants;
    this.selectedVariant = this.getVariant();
  }
  
  getVariant() {
    const stored = localStorage.getItem(`ab_test_${this.testName}`);
    if (stored && this.variants.includes(stored)) {
      return stored;
    }
    
    const randomVariant = this.variants[Math.floor(Math.random() * this.variants.length)];
    localStorage.setItem(`ab_test_${this.testName}`, randomVariant);
    
    // Analytics Event
    trackEvent('ab_test_assignment', {
      test_name: this.testName,
      variant: randomVariant
    });
    
    return randomVariant;
  }
  
  isVariant(variantName) {
    return this.selectedVariant === variantName;
  }
}

// Beispiel A/B Test
const checkoutButtonTest = new ABTest('checkout_button_color', ['red', 'green', 'blue']);

// Performance Monitoring
function measurePerformance(name, fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  
  // An Analytics senden
  trackEvent('performance_metric', {
    metric_name: name,
    duration: Math.round(end - start)
  });
  
  return result;
}

// Error Tracking
window.addEventListener('error', (event) => {
  console.error('JavaScript Error:', event.error);
  
  trackEvent('javascript_error', {
    error_message: event.message,
    error_filename: event.filename,
    error_lineno: event.lineno,
    error_colno: event.colno
  });
});

// Unhandled Promise Rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  
  trackEvent('promise_rejection', {
    error_message: event.reason?.message || 'Unknown error',
    stack: event.reason?.stack
  });
});

// Erweiterte Initialisierung
document.addEventListener('DOMContentLoaded', async function() {
  // Warenkorb laden
  loadCartFromStorage();
  
  // Stripe initialisieren
  await initializeStripe();
  
  // Push-Benachrichtigungen
  await initializePushNotifications();
  
  // Ausstehende Bestellungen verarbeiten (falls online)
  if (isOnline) {
    await processPendingOrders();
  }
  
  // A/B Test anwenden
  if (checkoutButtonTest.isVariant('green')) {
    document.querySelectorAll('.checkout-btn').forEach(btn => {
      btn.style.backgroundColor = '#28a745';
    });
  } else if (checkoutButtonTest.isVariant('blue')) {
    document.querySelectorAll('.checkout-btn').forEach(btn => {
      btn.style.backgroundColor = '#007bff';
    });
  }
  
  // Event Listeners
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', submitOrder);
  }
  
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', subscribeNewsletter);
  });
  
  const customQuizForm = document.getElementById('quiz-contact-form');
  if (customQuizForm) {
    customQuizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitCustomQuiz();
    });
  }
  
  console.log('✅ Boxology Frontend initialisiert');
});

// Utility Functions
const utils = {
  // Debounce für Suchfunktionen
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle für Scroll-Events
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  },
  
  // Formatierung
  formatPrice: (price) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  },
  
  formatDate: (date) => {
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }
};

// Export für Module (falls verwendet)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addToCart,
    removeFromCart,
    updateCartUI,
    submitOrder,
    subscribeNewsletter,
    submitCustomQuiz,
    utils
  };
}