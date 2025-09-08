# Boxology Backend Environment Configuration
# Kopieren Sie diese Datei als .env und füllen Sie die Werte aus

# Server Configuration
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://boxology.at

# Database
MONGODB_URI=mongodb://localhost:27017/boxology
# Für MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/boxology

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@boxology.at
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@boxology.at

# Stripe Payment
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Admin Panel
ADMIN_URL=https://admin.boxology.at

# JWT Secret (für spätere Admin-Authentifizierung)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# File Upload (für Produktbilder)
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880