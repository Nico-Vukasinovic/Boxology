// Verbesserter Warenkorb für Boxology Geschenkbox-Website
let cart = [];

// Warenkorb beim Laden der Seite wiederherstellen
function loadCartFromStorage() {
  try {
    const savedCart = localStorage.getItem('boxology-cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartUI();
    }
  } catch (error) {
    console.error('Fehler beim Laden des Warenkorbs:', error);
    cart = [];
  }
}

// Warenkorb in localStorage speichern
function saveCartToStorage() {
  try {
    localStorage.setItem('boxology-cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Fehler beim Speichern des Warenkorbs:', error);
  }
}

// Box zum Warenkorb hinzufügen (verbessert)
function addToCart(name, price, id, options = {}) {
  const existingItem = cart.find(item => item.id === id && 
    JSON.stringify(item.options) === JSON.stringify(options));
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: id,
      name: name,
      price: parseFloat(price),
      quantity: 1,
      options: options, // Für Geschenkverpackung, etc.
      addedAt: new Date().toISOString()
    });
  }
  
  saveCartToStorage();
  updateCartUI();
  showSuccessMessage(`${name} wurde zum Warenkorb hinzugefügt`);
}

// Artikelmenge ändern
function updateQuantity(id, newQuantity) {
  const item = cart.find(item => item.id === id);
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      item.quantity = parseInt(newQuantity);
      saveCartToStorage();
      updateCartUI();
    }
  }
}

// Artikel aus Warenkorb entfernen (verbessert)
function removeFromCart(id) {
  const item = cart.find(item => item.id === id);
  if (item) {
    cart = cart.filter(item => item.id !== id);
    saveCartToStorage();
    updateCartUI();
    showSuccessMessage(`${item.name} wurde entfernt`, 'info');
  }
}

// Warenkorb leeren
function clearCart() {
  if (confirm('Möchten Sie wirklich alle Artikel aus dem Warenkorb entfernen?')) {
    cart = [];
    saveCartToStorage();
    updateCartUI();
    showSuccessMessage('Warenkorb wurde geleert', 'info');
  }
}

// Verbesserte Warenkorb UI mit Mengenänderung
function updateCartUI() {
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const emptyCart = document.getElementById('emptyCart');
  const totalPrice = document.getElementById('totalPrice');
  const clearCartBtn = document.getElementById('clearCartBtn');
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  if (cartCount) cartCount.textContent = totalItems;
  
  if (cart.length === 0) {
    if (cartItems) cartItems.innerHTML = '';
    if (cartTotal) cartTotal.style.display = 'none';
    if (emptyCart) emptyCart.style.display = 'block';
    if (clearCartBtn) clearCartBtn.style.display = 'none';
  } else {
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartTotal) cartTotal.style.display = 'block';
    if (clearCartBtn) clearCartBtn.style.display = 'inline-block';
    
    if (cartItems) {
      cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="cart-item-price">€${item.price.toFixed(2)}</div>
            ${item.options.giftWrap ? '<small class="gift-option">🎁 Geschenkverpackung</small>' : ''}
          </div>
          <div class="cart-item-controls">
            <div class="quantity-controls">
              <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" class="qty-btn">-</button>
              <span class="quantity">${item.quantity}</span>
              <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" class="qty-btn">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Entfernen">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `).join('');
    }
    
    if (totalPrice) totalPrice.textContent = totalAmount.toFixed(2);
  }
}

// Verbesserte Erfolgsmeldungen
function showSuccessMessage(message, type = 'success') {
  const successMessage = document.getElementById('successMessage');
  if (successMessage) {
    successMessage.textContent = message;
    successMessage.className = `success-message ${type}`;
    successMessage.classList.add('show');
    
    setTimeout(() => {
      successMessage.classList.remove('show');
    }, 3000);
  }
}

// E-Mail-Validierung
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Telefonnummer-Validierung (optional)
function validatePhone(phone) {
  if (!phone) return true; // Optional
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
  return phoneRegex.test(phone);
}

// Verbesserte Formularvalidierung
function validateCheckoutForm(formData) {
  const errors = [];
  
  if (!formData.get('name')?.trim()) {
    errors.push('Name ist erforderlich');
  }
  
  if (!validateEmail(formData.get('email'))) {
    errors.push('Gültige E-Mail-Adresse ist erforderlich');
  }
  
  if (!validatePhone(formData.get('phone'))) {
    errors.push('Gültige Telefonnummer eingeben oder Feld leer lassen');
  }
  
  if (!formData.get('address')?.trim()) {
    errors.push('Adresse ist erforderlich');
  }
  
  if (!formData.get('zip')?.trim()) {
    errors.push('Postleitzahl ist erforderlich');
  }
  
  if (!formData.get('city')?.trim()) {
    errors.push('Stadt ist erforderlich');
  }
  
  return errors;
}

// Loading-State anzeigen
function showLoading(show = true) {
  const loadingElement = document.getElementById('loading');
  if (loadingElement) {
    loadingElement.style.display = show ? 'flex' : 'none';
  }
  
  // Formulare deaktivieren während Loading
  document.querySelectorAll('form button[type="submit"]').forEach(btn => {
    btn.disabled = show;
    btn.textContent = show ? 'Wird verarbeitet...' : btn.dataset.originalText || 'Bestellen';
  });
}

// Verbesserte Checkout-Funktion
function proceedToCheckout() {
  if (cart.length === 0) {
    alert('Ihr Warenkorb ist leer!');
    return;
  }
  
  const checkoutModal = document.getElementById('checkoutModal');
  const orderSummary = document.getElementById('orderSummary');
  const checkoutTotal = document.getElementById('checkoutTotal');
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const giftWrapCost = cart.filter(item => item.options.giftWrap).length * 2.50; // €2.50 pro Geschenkverpackung
  const totalAmount = subtotal + giftWrapCost;
  
  if (orderSummary) {
    orderSummary.innerHTML = cart.map(item => `
      <div class="order-item">
        <div>
          <span class="item-name">${item.name}</span>
          <span class="item-quantity">(${item.quantity}x)</span>
          ${item.options.giftWrap ? '<small class="gift-wrap">+ Geschenkverpackung</small>' : ''}
        </div>
        <span class="item-total">€${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('') + 
    (giftWrapCost > 0 ? `
      <div class="order-item gift-wrap-total">
        <span>Geschenkverpackung</span>
        <span>€${giftWrapCost.toFixed(2)}</span>
      </div>
    ` : '');
  }
  
  if (checkoutTotal) checkoutTotal.textContent = totalAmount.toFixed(2);
  if (checkoutModal) checkoutModal.style.display = 'flex';
  
  toggleCart(); // Warenkorb schließen
}

// Verbesserte Bestellabwicklung
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
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const giftWrapCost = cart.filter(item => item.options.giftWrap).length * 2.50;
    
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
      },
      orderDate: new Date().toISOString(),
      orderNumber: generateOrderNumber()
    };
    
    // Simuliere API-Call (in Produktion: echter Backend-Call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await sendOrderNotification(orderData);
    showOrderConfirmation(orderData.orderNumber);
    
  } catch (error) {
    console.error('Bestellfehler:', error);
    alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
  } finally {
    showLoading(false);
  }
}

// Verbesserte Bestellnummer-Generierung
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  
  return `BOX${year}${month}${day}-${timestamp}${random}`;
}

// Verbesserte E-Mail-Funktion (für Backend-Integration vorbereitet)
async function sendOrderNotification(orderData) {
  const emailContent = generateOrderEmail(orderData);
  
  // In Produktion: Backend-API aufrufen
  // const response = await fetch('/api/send-order', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ orderData, emailContent })
  // });
  
  console.log('Bestellung würde gesendet werden:', orderData);
  console.log('E-Mail-Inhalt:', emailContent);
}

function generateOrderEmail(orderData) {
  return `
Neue Boxology Bestellung

Bestellnummer: ${orderData.orderNumber}
Bestelldatum: ${new Date(orderData.orderDate).toLocaleDateString('de-DE')}

=== KUNDENDATEN ===
Name: ${orderData.customer.name}
E-Mail: ${orderData.customer.email}
Telefon: ${orderData.customer.phone || 'Nicht angegeben'}
Adresse: ${orderData.customer.address}
${orderData.customer.zip} ${orderData.customer.city}

=== LIEFERUNG ===
${orderData.delivery.isGift ? `
🎁 GESCHENKSENDUNG
Empfänger: ${orderData.delivery.recipientName || 'Wie Besteller'}
Lieferadresse: ${orderData.delivery.recipientAddress || 'Wie Rechnungsadresse'}
Geschenknachricht: ${orderData.delivery.giftMessage || 'Keine'}
Wunschliefertermin: ${orderData.delivery.deliveryDate || 'Schnellstmöglich'}
` : 'Standard-Lieferung an Rechnungsadresse'}

=== BESTELLTE ARTIKEL ===
${orderData.items.map(item => 
  `• ${item.name} (${item.quantity}x) - €${(item.price * item.quantity).toFixed(2)}${item.options.giftWrap ? ' + Geschenkverpackung' : ''}`
).join('\n')}

=== PREISE ===
Zwischensumme: €${orderData.pricing.subtotal.toFixed(2)}
${orderData.pricing.giftWrapCost > 0 ? `Geschenkverpackung: €${orderData.pricing.giftWrapCost.toFixed(2)}` : ''}
GESAMTBETRAG: €${orderData.pricing.total.toFixed(2)}

=== ANMERKUNGEN ===
${orderData.customer.notes || 'Keine besonderen Wünsche'}

---
Automatisch generiert von boxology.at
  `.trim();
}

// Verbesserte Bestellbestätigung
function showOrderConfirmation(orderNumber) {
  closeCheckout();
  cart = [];
  saveCartToStorage();
  updateCartUI();
  
  const confirmationMessage = `
🎉 Vielen Dank für Ihre Bestellung!

Bestellnummer: ${orderNumber}

Wir haben Ihre Bestellung erhalten und werden sie schnellstmöglich bearbeiten. 

Sie erhalten in Kürze eine Bestätigungs-E-Mail mit allen Details.

Bei Fragen erreichen Sie uns unter:
📧 info@boxology.at
📞 +43 123 456 789
  `.trim();
  
  alert(confirmationMessage);
}

// Geschenkoptionen hinzufügen
function addGiftOptions(itemId) {
  const modal = document.getElementById('giftOptionsModal');
  const currentItemId = document.getElementById('currentItemId');
  
  if (currentItemId) currentItemId.value = itemId;
  if (modal) modal.style.display = 'flex';
}

function applyGiftOptions() {
  const itemId = document.getElementById('currentItemId')?.value;
  const giftWrap = document.getElementById('giftWrap')?.checked;
  const giftMessage = document.getElementById('giftMessage')?.value;
  
  if (itemId) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
      item.options = {
        ...item.options,
        giftWrap: giftWrap,
        giftMessage: giftMessage?.trim() || null
      };
      
      saveCartToStorage();
      updateCartUI();
    }
  }
  
  closeGiftOptions();
}

function closeGiftOptions() {
  const modal = document.getElementById('giftOptionsModal');
  if (modal) modal.style.display = 'none';
}

// Warenkorb-Funktionen
function toggleCart() {
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  
  if (cartSidebar) cartSidebar.classList.toggle('open');
  if (cartOverlay) cartOverlay.classList.toggle('show');
}

function closeCheckout() {
  const checkoutModal = document.getElementById('checkoutModal');
  if (checkoutModal) checkoutModal.style.display = 'none';
}

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', function() {
  // Warenkorb aus localStorage laden
  loadCartFromStorage();
  
  // Event Listeners
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', submitOrder);
    
    // Original-Texte für Buttons speichern
    checkoutForm.querySelectorAll('button[type="submit"]').forEach(btn => {
      btn.dataset.originalText = btn.textContent;
    });
  }
  
  // Weitere Event Listeners wie im Original-Code...
  // (Quiz, Newsletter, etc. - hier gekürzt für Übersichtlichkeit)
});