# Shift Start Backend API

## 🚀 Overview
Backend API for Shift Start website built with Node.js, Express, and MongoDB. This API provides comprehensive endpoints for team management, project portfolio, contact forms, and admin authentication.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Admin/User)
- Secure password hashing with bcrypt
- Rate limiting for auth endpoints

### 👥 Team Management
- CRUD operations for team members
- Multi-language support (Arabic/English)
- Skills and social media links management
- Role-based team member organization

### 📁 Project Portfolio
- Complete project management system
- Image gallery with primary image selection
- Category-based filtering
- View tracking and statistics
- Featured projects highlighting

### 📧 Contact System
- Contact form with spam detection
- Automated email notifications
- Admin message management
- Priority and status tracking
- Notes system for internal use

### 🛡️ Security Features
- Helmet.js security headers
- CORS configuration
- XSS protection
- NoSQL injection prevention
- Request rate limiting
- Input validation and sanitization

## 🏗️ Architecture

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── teamController.js    # Team management
│   ├── projectController.js # Project management
│   └── contactController.js # Contact system
├── middleware/
│   ├── auth.js             # Authentication middleware
│   ├── security.js         # Security middleware
│   └── errorHandler.js     # Error handling
├── models/
│   ├── User.js             # User model
│   ├── TeamMember.js       # Team member model
│   ├── Project.js          # Project model
│   └── Contact.js          # Contact model
├── routes/
│   ├── authRoutes.js       # Auth endpoints
│   ├── teamRoutes.js       # Team endpoints
│   ├── projectRoutes.js    # Project endpoints
│   └── contactRoutes.js    # Contact endpoints
├── scripts/
│   └── seedData.js         # Database seeding
└── server.js               # Main server file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create `.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/shift-start

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Email (Nodemailer)
EMAIL_FROM=noreply@shiftstart.sy
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Admin
ADMIN_EMAIL=admin@shiftstart.sy
ADMIN_PASSWORD=Admin123!@#

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup
```bash
# Import sample data
npm run seed

# Or manually:
node scripts/seedData.js -i
```

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # User login
GET    /api/auth/logout       # User logout
GET    /api/auth/me           # Get current user
PUT    /api/auth/updatedetails # Update user details
PUT    /api/auth/updatepassword # Change password
GET    /api/auth/status       # Check auth status
```

### Team Management
```
GET    /api/team              # Get all team members
GET    /api/team/:id          # Get single team member
POST   /api/team              # Create team member (Admin)
PUT    /api/team/:id          # Update team member (Admin)
DELETE /api/team/:id          # Delete team member (Admin)
GET    /api/team/role/:role   # Get members by role
```

### Projects
```
GET    /api/projects          # Get all projects
GET    /api/projects/:id      # Get single project
POST   /api/projects          # Create project (Admin)
PUT    /api/projects/:id      # Update project (Admin)
DELETE /api/projects/:id      # Delete project (Admin)
GET    /api/projects/featured # Get featured projects
GET    /api/projects/category/:category # Get by category
```

### Contact
```
POST   /api/contact           # Submit contact form
GET    /api/contact           # Get all messages (Admin)
GET    /api/contact/:id       # Get single message (Admin)
PUT    /api/contact/:id/status # Update status (Admin)
POST   /api/contact/:id/notes # Add note (Admin)
```

## 🔒 Security Features

### Rate Limiting
- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Contact form: 3 submissions per hour

### Data Protection
- Password hashing with bcrypt (cost: 12)
- JWT token expiration
- Input validation and sanitization
- NoSQL injection prevention
- XSS protection

### Headers
- Security headers with Helmet.js
- CORS configuration
- Content Security Policy
- HSTS enforcement

## 📊 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['admin', 'user'],
  avatar: String,
  isActive: Boolean,
  lastLogin: Date
}
```

### TeamMember
```javascript
{
  name: { ar: String, en: String },
  role: ['fullstack', 'frontend', 'backend', 'ui', 'ux', 'manager', 'designer'],
  bio: { ar: String, en: String },
  image: String,
  skills: [String],
  social: { github, linkedin, twitter, dribbble, behance },
  order: Number,
  isActive: Boolean
}
```

### Project
```javascript
{
  title: { ar: String, en: String },
  description: { ar: String, en: String },
  slug: String (auto-generated),
  images: [{ url, alt, isPrimary }],
  category: ['website', 'mobile', 'ecommerce', 'corporate', 'other'],
  technologies: [String],
  links: { live, github, demo },
  teamMembers: [ObjectId],
  status: ['planning', 'development', 'testing', 'completed', 'maintained'],
  featured: Boolean,
  isPublic: Boolean,
  stats: { views, likes }
}
```

### Contact
```javascript
{
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  category: ['general', 'project', 'support', 'partnership', 'career'],
  status: ['new', 'read', 'replied', 'archived'],
  priority: ['low', 'normal', 'high', 'urgent'],
  notes: [{ note, addedBy, addedAt }],
  isSpam: Boolean
}
```

## 🔧 Development

### Running Tests
```bash
npm test
```

### Database Management
```bash
# Import sample data
npm run seed

# Delete all data
node scripts/seedData.js -d
```

### Code Quality
- ESLint configuration
- Prettier formatting
- Error handling middleware
- Request logging with Morgan

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=complex-production-secret
EMAIL_HOST=your-smtp-server
# ... other production configs
```

### Docker Support
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📈 Monitoring & Health Checks

### Health Check Endpoint
```
GET /health
```

Response:
```json
{
  "success": true,
  "message": "Server is running successfully",
  "timestamp": "2024-01-15T10:30:00Z",
  "environment": "development",
  "uptime": 3600
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email info@shiftstart.sy or contact the development team.

---

**Shift Start Team** - Professional Web Development