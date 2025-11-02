class BoxBuilder extends HTMLElement {
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
        .builder-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .items-section, .preview-section {
          background: #111827;
          border-radius: 0.5rem;
          padding: 1.5rem;
        }
        h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: white;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 0.5rem;
        }
        .category-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .category-tab {
          padding: 0.5rem 1rem;
          background: #374151;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .category-tab.active {
          background: #3b82f6;
        }
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }
        .item-card {
          background: #374151;
          border-radius: 0.5rem;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .item-card:hover {
          background: #4b5563;
        }
        .item-card.selected {
          background: #3b82f6;
          border: 2px solid white;
        }
        .item-image {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 0.25rem;
          margin-bottom: 0.5rem;
        }
        .preview-box {
          background: #374151;
          border-radius: 0.5rem;
          padding: 1.5rem;
          min-height: 300px;
          position: relative;
        }
        .preview-items {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .preview-item {
          background: #1f2937;
          border-radius: 0.25rem;
          padding: 0.5rem;
          text-align: center;
          font-size: 0.8rem;
        }
        .customization-options {
          margin-top: 1.5rem;
        }
        .option-group {
          margin-bottom: 1rem;
        }
        .option-group h4 {
          margin-bottom: 0.5rem;
          color: white;
        }
        .option-select {
          width: 100%;
          padding: 0.5rem;
          background: #374151;
          border: 1px solid #4b5563;
          border-radius: 0.25rem;
          color: white;
        }
        .actions {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary {
          background: #3b82f6;
          color: white;
          border: none;
        }
        .btn-primary:hover {
          background: #2563eb;
        }
        .btn-secondary {
          background: transparent;
          color: #9ca3af;
          border: 1px solid #4b5563;
        }
        .btn-secondary:hover {
          background: #374151;
        }
      </style>
      <div class="builder-container">
        <div class="items-section">
          <h2>Build Your Box</h2>
          <div class="category-tabs">
            <div class="category-tab active" data-category="all">All Items</div>
            <div class="category-tab" data-category="love">Love</div>
            <div class="category-tab" data-category="celebration">Celebration</div>
            <div class="category-tab" data-category="gourmet">Gourmet</div>
            <div class="category-tab" data-category="wellness">Wellness</div>
          </div>
          <div class="items-grid" id="items-grid">
            <!-- Items will be populated here -->
          </div>
        </div>
        <div class="preview-section">
          <h2>Your Box Preview</h2>
          <div class="preview-box">
            <div id="empty-message">Select items to add to your box</div>
            <div class="preview-items" id="preview-items"></div>
          </div>
          <div class="customization-options">
            <div class="option-group">
              <h4>Box Style</h4>
              <select class="option-select" id="box-style">
                <option value="classic">Classic Gift Box</option>
                <option value="premium">Premium Wooden Box</option>
                <option value="eco">Eco-Friendly Box</option>
                <option value="luxury">Luxury Velvet Box</option>
              </select>
            </div>
            <div class="option-group">
              <h4>Packaging Color</h4>
              <select class="option-select" id="box-color">
                <option value="red">Passionate Red</option>
                <option value="blue">Serene Blue</option>
                <option value="green">Natural Green</option>
                <option value="black">Elegant Black</option>
                <option value="white">Pure White</option>
              </select>
            </div>
            <div class="option-group">
              <h4>Add Personal Note</h4>
              <textarea class="option-select" id="personal-note" rows="3" placeholder="Write your personal message here..."></textarea>
            </div>
            <div class="option-group">
              <h4>Include Photo</h4>
              <input type="file" id="photo-upload" accept="image/*">
            </div>
          </div>
          <div class="actions">
            <button class="btn btn-secondary" id="reset-btn">Reset</button>
            <button class="btn btn-primary" id="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      </div>
    `;

    this.items = [
      { id: 1, name: "Love Letter Set", category: "love", price: 12.99, image: "http://static.photos/love/200x200/1" },
      { id: 2, name: "Scented Candle", category: "love", price: 19.99, image: "http://static.photos/love/200x200/2" },
      { id: 3, name: "Champagne Glasses", category: "celebration", price: 24.99, image: "http://static.photos/celebration/200x200/1" },
      { id: 4, name: "Gourmet Chocolates", category: "gourmet", price: 16.99, image: "http://static.photos/food/200x200/1" },
      { id: 5, name: "Herbal Tea Set", category: "wellness", price: 14.99, image: "http://static.photos/wellness/200x200/1" },
      { id: 6, name: "Memory Book", category: "love", price: 22.99, image: "http://static.photos/love/200x200/3" },
      { id: 7, name: "Confetti Pack", category: "celebration", price: 8.99, image: "http://static.photos/celebration/200x200/2" },
      { id: 8, name: "Artisan Coffee", category: "gourmet", price: 18.99, image: "http://static.photos/food/200x200/2" },
      { id: 9, name: "Aromatherapy Oil", category: "wellness", price: 21.99, image: "http://static.photos/wellness/200x200/2" },
      { id: 10, name: "Custom Playlist Card", category: "love", price: 9.99, image: "http://static.photos/love/200x200/4" }
    ];

    this.selectedItems = [];
    this.renderItems();
    this.setupEventListeners();
  }

  renderItems(category = 'all') {
    const itemsGrid = this.shadowRoot.getElementById('items-grid');
    itemsGrid.innerHTML = '';

    const filteredItems = category === 'all' 
      ? this.items 
      : this.items.filter(item => item.category === category);

    filteredItems.forEach(item => {
      const isSelected = this.selectedItems.some(selected => selected.id === item.id);
      const itemCard = document.createElement('div');
      itemCard.className = `item-card ${isSelected ? 'selected' : ''}`;
      itemCard.dataset.id = item.id;
      itemCard.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="item-image">
        <div>${item.name}</div>
        <div>$${item.price}</div>
      `;
      itemsGrid.appendChild(itemCard);
    });
  }

  renderPreview() {
    const previewItems = this.shadowRoot.getElementById('preview-items');
    const emptyMessage = this.shadowRoot.getElementById('empty-message');

    if (this.selectedItems.length === 0) {
      emptyMessage.style.display = 'block';
      previewItems.style.display = 'none';
    } else {
      emptyMessage.style.display = 'none';
      previewItems.style.display = 'grid';
      previewItems.innerHTML = '';

      this.selectedItems.forEach(item => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
          <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 50px; object-fit: cover;">
          <div>${item.name}</div>
        `;
        previewItems.appendChild(previewItem);
      });
    }
  }

  setupEventListeners() {
    // Category tabs
    this.shadowRoot.querySelectorAll('.category-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.shadowRoot.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.renderItems(tab.dataset.category);
      });
    });

    // Item selection
    this.shadowRoot.addEventListener('click', (e) => {
      const itemCard = e.target.closest('.item-card');
      if (itemCard) {
        const itemId = parseInt(itemCard.dataset.id);
        const item = this.items.find(i => i.id === itemId);

        if (itemCard.classList.contains('selected')) {
          // Remove item
          this.selectedItems = this.selectedItems.filter(i => i.id !== itemId);
          itemCard.classList.remove('selected');
        } else {
          // Add item
          this.selectedItems.push(item);
          itemCard.classList.add('selected');
        }
        this.renderPreview();
      }
    });

    // Reset button
    this.shadowRoot.getElementById('reset-btn').addEventListener('click', () => {
      this.selectedItems = [];
      this.renderItems();
      this.renderPreview();
    });

    // Add to cart button
    this.shadowRoot.getElementById('add-to-cart-btn').addEventListener('click', () => {
      if (this.selectedItems.length === 0) {
        alert('Please select at least one item for your box');
        return;
      }

      const boxStyle = this.shadowRoot.getElementById('box-style').value;
      const boxColor = this.shadowRoot.getElementById('box-color').value;
      const personalNote = this.shadowRoot.getElementById('personal-note').value;
      const photoUpload = this.shadowRoot.getElementById('photo-upload').files[0];
      const boxData = {
        id: 'custom-box-' + Date.now(), // Unique ID for each custom box
        name: 'Custom Gift Box',
        items: this.selectedItems,
        customization: {
          style: boxStyle,
          color: boxColor,
          note: personalNote,
          hasPhoto: !!photoUpload
        },
        price: this.selectedItems.reduce((sum, item) => sum + item.price, 0) + 15.99, // Base box price
        quantity: 1,
        image: 'http://static.photos/gift/200x200/42' // Default image for custom boxes
      };
// Save to localStorage
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push(boxData);
      localStorage.setItem('cart', JSON.stringify(cart));

      // Show success message
      alert('Your custom box has been added to cart!');
    });
  }
}

customElements.define('custom-box-builder', BoxBuilder);
