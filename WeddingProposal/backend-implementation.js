// Backend für Boxology Geschenkbox-Website
// Node.js mit Express, MongoDB, Stripe und Nodemailer

// Package.json dependencies:
/*
{
  "name": "boxology-backend",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "stripe": "^13.6.0",
    "nodemailer": "^6.9.4",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.3.1",
    "express-rate-limit": "^6.10.0",
    "joi": "^17.9.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5"
  }
}
*/

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://boxology.at',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // max 100 Anfragen pro IP
  message: 'Zu viele Anfragen, bitte versuchen Sie es später erneut.'
});
app.use(limiter);

// Spezielle Rate Limits für Bestellungen
const orderLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 Minute
  max: 3, // max 3 Bestellungen pro Minute
  message: 'Bitte warten Sie einen Moment zwischen Bestellungen.'
});

// MongoDB Schemas
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String, required: true },
    zip: { type: String, required: true },
    city: { type: String, required: true },
    notes: { type: String }
  },
  delivery: {
    isGift: { type: Boolean, default: false },
    recipientName: { type: String },
    recipientAddress: { type: String },
    giftMessage: { type: String },
    deliveryDate: { type: Date }
  },
  items: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    options: {
      giftWrap: { type: Boolean, default: false },
      giftMessage: { type: String }
    }
  }],
  pricing: {
    subtotal: { type: Number, required: true },
    giftWrapCost: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  payment: {
    method: { type: String, enum: ['stripe', 'paypal', 'bank_transfer'] },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    transactionId: { type: String },
    paidAt: { type: Date }
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  trackingNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const customBoxRequestSchema = new mongoose.Schema({
  requestNumber: { type: String, unique: true, required: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    notes: { type: String }
  },
  answers: { type: Map, of: String },
  status: { 
    type: String, 
    enum: ['new', 'quoted', 'approved', 'cancelled'], 
    default: 'new' 
  },
  quote: {
    price: { type: Number },
    description: { type: String },
    validUntil: { type: Date }
  },
  createdAt: { type: Date, default: Date.now }
});

const newsletterSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  subscribedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const Order = mongoose.model('Order', orderSchema);
const CustomBoxRequest = mongoose.model('CustomBoxRequest', customBoxRequestSchema);
const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// Stripe Configuration
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Nodemailer Configuration
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Validation Schemas
const Joi = require('joi');

const orderValidation = Joi.object({
  customer: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[\+]?[0-9\s\-\(\)]{8,}$/).optional(),
    address: Joi.string().min(5).max(200).required(),
    zip: Joi.string().min(4).max(10).required(),
    city: Joi.string().min(2).max(100).required(),
    notes: Joi.string().max(500).optional()
  }).required(),
  delivery: Joi.object({
    isGift: Joi.boolean().default(false),
    recipientName: Joi.string().max(100).optional(),
    recipientAddress: Joi.string().max(200).optional(),
    giftMessage: Joi.string().max(300).optional(),
    deliveryDate: Joi.date().min('now').optional()
  }).optional(),
  items: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.number().positive().required(),
      quantity: Joi.number().integer().min(1).required(),
      options: Joi.object({
        giftWrap: Joi.boolean().default(false),
        giftMessage: Joi.string().max(200).optional()
      }).optional()
    })
  ).min(1).required(),
  pricing: Joi.object({
    subtotal: Joi.number().positive().required(),
    giftWrapCost: Joi.number().min(0).required(),
    total: Joi.number().positive().required()
  }).required()
});

// Helper Functions
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  
  return `BOX${year}${month}${day}-${timestamp}${random}`;
}

async function sendOrderConfirmationEmail(order) {
  const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bestellbestätigung - Boxology</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ff6b6b; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; }
    .order-details { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .footer { background: #333; color: white; padding: 15px; text-align: center; }
    .gift-icon { color: #ff6b6b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎁 Vielen Dank für Ihre Bestellung!</h1>
    </div>
    
    <div class="content">
      <h2>Bestellbestätigung</h2>
      <p>Liebe/r ${order.customer.name},</p>
      <p>wir haben Ihre Bestellung erfolgreich erhalten und werden sie schnellstmöglich bearbeiten.</p>
      
      <div class="order-details">
        <h3>Bestelldetails</h3>
        <p><strong>Bestellnummer:</strong> ${order.orderNumber}</p>
        <p><strong>Bestelldatum:</strong> ${new Date(order.createdAt).toLocaleDateString('de-DE')}</p>
        
        <h4>Bestellte Artikel:</h4>
        ${order.items.map(item => `
          <p>• ${item.name} (${item.quantity}x) - €${(item.price * item.quantity).toFixed(2)}
          ${item.options?.giftWrap ? ' <span class="gift-icon">🎁</span>' : ''}</p>
        `).join('')}
        
        ${order.pricing.giftWrapCost > 0 ? `<p><strong>Geschenkverpackung:</strong> €${order.pricing.giftWrapCost.toFixed(2)}</p>` : ''}
        <p><strong>Gesamtbetrag:</strong> €${order.pricing.total.toFixed(2)}</p>
      </div>
      
      ${order.delivery?.isGift ? `
      <div class="order-details">
        <h4>🎁 Geschenksendung</h4>
        <p><strong>Empfänger:</strong> ${order.delivery.recipientName || 'Wie Besteller'}</p>
        ${order.delivery.giftMessage ? `<p><strong>Geschenknachricht:</strong> "${order.delivery.giftMessage}"</p>` : ''}
      </div>
      ` : ''}
      
      <div class="order-details">
        <h4>Lieferadresse</h4>
        <p>${order.delivery?.recipientAddress || `${order.customer.address}, ${order.customer.zip} ${order.customer.city}`}</p>
      </div>
      
      <p>Sie erhalten eine weitere E-Mail, sobald Ihre Bestellung versandt wurde.</p>
    </div>
    
    <div class="footer">
      <p>Boxology - Einzigartige Geschenkboxen<br>
      📧 info@boxology.at | 📞 +43 123 456 789<br>
      🌐 www.boxology.at</p>
    </div>
  </div>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"Boxology" <${process.env.SMTP_USER}>`,
    to: order.customer.email,
    subject: `Bestellbestätigung ${order.orderNumber} - Boxology`,
    html: emailTemplate
  });
}

async function sendAdminNotification(order) {
  const adminEmail = `
Neue Bestellung eingegangen!

Bestellnummer: ${order.orderNumber}
Kunde: ${order.customer.name} (${order.customer.email})
Gesamtbetrag: €${order.pricing.total.toFixed(2)}
Status: ${order.status}

Artikel:
${order.items.map(item => `- ${item.name} (${item.quantity}x)`).join('\n')}

${order.delivery?.isGift ? '🎁 GESCHENKSENDUNG' : ''}

Jetzt in Admin-Panel bearbeiten: ${process.env.ADMIN_URL}/orders/${order._id}
  `;

  await transporter.sendMail({
    from: `"Boxology System" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `Neue Bestellung: ${order.orderNumber}`,
    text: adminEmail
  });
}

// API Routes

// 1. Bestellung aufgeben
app.post('/api/orders', orderLimiter, async (req, res) => {
  try {
    // Validierung
    const { error, value } = orderValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validierungsfehler',
        errors: error.details.map(d => d.message)
      });
    }

    // Bestellnummer generieren
    const orderNumber = generateOrderNumber();

    // Bestellung erstellen
    const order = new Order({
      ...value,
      orderNumber,
      status: 'pending'
    });

    await order.save();

    // E-Mails versenden
    await Promise.all([
      sendOrderConfirmationEmail(order),
      sendAdminNotification(order)
    ]);

    res.status(201).json({
      success: true,
      message: 'Bestellung erfolgreich aufgegeben',
      orderNumber: order.orderNumber,
      orderId: order._id
    });

  } catch (error) {
    console.error('Bestellfehler:', error);
    res.status(500).json({
      success: false,
      message: 'Server-Fehler beim Verarbeiten der Bestellung'
    });
  }
});

// 2. Stripe Payment Intent erstellen
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'eur', orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Cents
      currency,
      metadata: {
        orderId: orderId.toString()
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    console.error('Stripe Fehler:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler bei Zahlungsverarbeitung'
    });
  }
});

// 3. Payment Webhook (Stripe)
app.post('/api/webhook/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      await Order.findByIdAndUpdate(orderId, {
        'payment.status': 'completed',
        'payment.method': 'stripe',
        'payment.transactionId': paymentIntent.id,
        'payment.paidAt': new Date(),
        status: 'confirmed',
        updatedAt: new Date()
      });
    }

    res.json({received: true});
  } catch (error) {
    console.error('Webhook Fehler:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// 4. Personalisierte Box Anfrage
app.post('/api/custom-box-request', async (req, res) => {
  try {
    const requestNumber = generateOrderNumber().replace('BOX', 'REQ');
    
    const request = new CustomBoxRequest({
      ...req.body,
      requestNumber
    });

    await request.save();

    // Admin-Benachrichtigung
    await transporter.sendMail({
      from: `"Boxology" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Neue Anfrage für personalisierte Box: ${requestNumber}`,
      text: `
Neue Anfrage für personalisierte Box

Anfrage-Nr: ${requestNumber}
Kunde: ${request.customer.name} (${request.customer.email})

Antworten:
${Object.entries(request.answers || {}).map(([key, value]) => `${key}: ${value}`).join('\n')}

Anmerkungen: ${request.customer.notes || 'Keine'}
      `
    });

    res.status(201).json({
      success: true,
      message: 'Anfrage erfolgreich gesendet',
      requestNumber
    });

  } catch (error) {
    console.error('Custom Box Request Fehler:', error);
    res.status(500).json({
      success: false,
      message: 'Server-Fehler'
    });
  }
});

// 5. Newsletter-Anmeldung
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Gültige E-Mail-Adresse erforderlich'
      });
    }

    const subscription = new Newsletter({ email });
    await subscription.save();

    // Willkommens-E-Mail
    await transporter.sendMail({
      from: `"Boxology" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Willkommen beim Boxology Newsletter! 🎁',
      html: `
        <h2>Willkommen bei Boxology!</h2>
        <p>Vielen Dank für Ihre Newsletter-Anmeldung!</p>
        <p>Sie erhalten ab sofort Updates über neue Boxen, Sonderangebote und exklusive Inhalte.</p>
        <p>🎁 Zur Begrüßung erhalten Sie 10% Rabatt auf Ihre erste Bestellung mit dem Code: <strong>WELCOME10</strong></p>
      `
    });

    res.status(201).json({
      success: true,
      message: 'Newsletter-Anmeldung erfolgreich'
    });

  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'E-Mail-Adresse bereits registriert'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Server-Fehler'
      });
    }
  }
});

// 6. Bestellstatus abfragen
app.get('/api/orders/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderNumber: req.params.orderNumber 
    }).select('-payment.transactionId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Bestellung nicht gefunden'
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server-Fehler'
    });
  }
});

// Database Connection & Server Start
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB verbunden');
  
  app.listen(PORT, () => {
    console.log(`🚀 Server läuft auf Port ${PORT}`);
    console.log(`🌐 API verfügbar unter: http://localhost:${PORT}/api`);
  });
}).catch(error => {
  console.error('❌ MongoDB Verbindungsfehler:', error);
  process.exit(1);
});

// Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Server wird heruntergefahren...');
  await mongoose.connection.close();
  process.exit(0);
});