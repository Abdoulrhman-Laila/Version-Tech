# 🔗 دليل التكامل - Frontend & Backend Integration

## 🚀 نظرة عامة

تم ربط موقع Shift Start بالكامل مع Backend API وقاعدة البيانات MongoDB. هذا الدليل يوضح كيفية عمل النظام والتكامل بين المكونات المختلفة.

## 🏗️ هيكل المشروع الكامل

```
shift-start-project/
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js              # خدمات API
│   │   ├── pages/
│   │   │   ├── Home.jsx            # مربوط بـ Featured Projects
│   │   │   ├── Team.jsx            # مربوط بـ Team API
│   │   │   ├── Projects.jsx        # مربوط بـ Projects API
│   │   │   ├── Contact.jsx         # مربوط بـ Contact API
│   │   │   └── Admin.jsx           # لوحة الإدارة
│   │   └── ...
└── backend/
    ├── models/
    │   ├── User.js                 # نموذج المستخدمين
    │   ├── TeamMember.js           # نموذج أعضاء الفريق
    │   ├── Project.js              # نموذج المشاريع
    │   └── Contact.js              # نموذج الرسائل
    ├── controllers/
    │   ├── authController.js       # تحكم المصادقة
    │   ├── teamController.js       # تحكم الفريق
    │   ├── projectController.js    # تحكم المشاريع
    │   └── contactController.js    # تحكم الرسائل
    ├── routes/
    │   ├── authRoutes.js           # مسارات المصادقة
    │   ├── teamRoutes.js           # مسارات الفريق
    │   ├── projectRoutes.js        # مسارات المشاريع
    │   └── contactRoutes.js        # مسارات الرسائل
    └── ...
```

## 📊 قاعدة البيانات

### اسم قاعدة البيانات
```
shift-start-team
```

### الجداول (Collections)

#### 1. Users (المستخدمين)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "admin" | "user",
  avatar: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. TeamMembers (أعضاء الفريق)
```javascript
{
  _id: ObjectId,
  name: {
    ar: String,
    en: String
  },
  role: "fullstack" | "frontend" | "backend" | "ui" | "ux" | "manager" | "designer",
  bio: {
    ar: String,
    en: String
  },
  image: String,
  skills: [String],
  social: {
    github: String,
    linkedin: String,
    twitter: String,
    dribbble: String,
    behance: String
  },
  order: Number,
  isActive: Boolean,
  joinedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Projects (المشاريع)
```javascript
{
  _id: ObjectId,
  title: {
    ar: String,
    en: String
  },
  description: {
    ar: String,
    en: String
  },
  slug: String (auto-generated),
  images: [{
    url: String,
    alt: { ar: String, en: String },
    isPrimary: Boolean
  }],
  category: "website" | "mobile" | "ecommerce" | "corporate" | "other",
  technologies: [String],
  links: {
    live: String,
    github: String,
    demo: String
  },
  client: {
    name: String,
    website: String,
    logo: String
  },
  duration: String,
  teamMembers: [ObjectId], // ref to TeamMember
  status: "planning" | "development" | "testing" | "completed" | "maintained",
  featured: Boolean,
  order: Number,
  isPublic: Boolean,
  completedAt: Date,
  stats: {
    views: Number,
    likes: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. Contacts (الرسائل)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  category: "general" | "project" | "support" | "partnership" | "career",
  status: "new" | "read" | "replied" | "archived",
  priority: "low" | "normal" | "high" | "urgent",
  ipAddress: String,
  userAgent: String,
  readAt: Date,
  repliedAt: Date,
  assignedTo: ObjectId, // ref to User
  notes: [{
    note: String,
    addedBy: ObjectId, // ref to User
    addedAt: Date
  }],
  isSpam: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### 🔐 Authentication
```
POST   /auth/login              # تسجيل الدخول
POST   /auth/register           # إنشاء حساب
GET    /auth/logout             # تسجيل الخروج
GET    /auth/me                 # بيانات المستخدم الحالي
PUT    /auth/updatedetails      # تحديث البيانات
PUT    /auth/updatepassword     # تغيير كلمة المرور
GET    /auth/status             # حالة المصادقة
```

### 👥 Team Management
```
GET    /team                    # جلب أعضاء الفريق
GET    /team/:id                # جلب عضو واحد
GET    /team/role/:role         # جلب الأعضاء حسب الدور
POST   /team                    # إضافة عضو جديد (Admin)
PUT    /team/:id                # تحديث عضو (Admin)
DELETE /team/:id                # حذف عضو (Admin)
PUT    /team/:id/order          # تحديث ترتيب العضو (Admin)
GET    /team/admin/stats        # إحصائيات الفريق (Admin)
```

### 📁 Projects
```
GET    /projects                # جلب المشاريع
GET    /projects/:id            # جلب مشروع واحد
GET    /projects/featured       # جلب المشاريع المميزة
GET    /projects/category/:cat  # جلب مشاريع حسب الفئة
POST   /projects                # إضافة مشروع (Admin)
PUT    /projects/:id            # تحديث مشروع (Admin)
DELETE /projects/:id            # حذف مشروع (Admin)
PUT    /projects/:id/featured   # تبديل الحالة المميزة (Admin)
PUT    /projects/:id/order      # تحديث الترتيب (Admin)
GET    /projects/admin/stats    # إحصائيات المشاريع (Admin)
```

### 📧 Contact
```
POST   /contact                 # إرسال رسالة جديدة
GET    /contact                 # جلب الرسائل (Admin)
GET    /contact/:id             # جلب رسالة واحدة (Admin)
PUT    /contact/:id/status      # تحديث حالة الرسالة (Admin)
POST   /contact/:id/notes       # إضافة ملاحظة (Admin)
PUT    /contact/:id/spam        # تمييز كـ spam (Admin)
DELETE /contact/:id             # حذف رسالة (Admin)
GET    /contact/stats           # إحصائيات الرسائل (Admin)
```

## 🔗 التكامل في Frontend

### 1. خدمة API (src/services/api.js)
```javascript
// تكوين Axios مع الـ Base URL والـ Interceptors
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

// API functions for each module
export const authAPI = { ... };
export const teamAPI = { ... };
export const projectsAPI = { ... };
export const contactAPI = { ... };
```

### 2. ربط الصفحات

#### Team Page (src/pages/Team.jsx)
```javascript
// جلب بيانات الفريق من API
useEffect(() => {
  const fetchTeamMembers = async () => {
    const response = await teamAPI.getAll();
    setTeamMembers(response.data.data);
  };
  fetchTeamMembers();
}, []);
```

#### Projects Page (src/pages/Projects.jsx)
```javascript
// جلب المشاريع مع الفلترة
useEffect(() => {
  const fetchProjects = async () => {
    const response = await projectsAPI.getAll();
    setProjects(response.data.data);
  };
  fetchProjects();
}, []);
```

#### Contact Page (src/pages/Contact.jsx)
```javascript
// إرسال رسالة تواصل
const handleSubmit = async (e) => {
  const response = await contactAPI.submit(formData);
  toast.success(response.data.message);
};
```

#### Home Page (src/pages/Home.jsx)
```javascript
// جلب المشاريع المميزة
useEffect(() => {
  const fetchFeaturedProjects = async () => {
    const response = await projectsAPI.getFeatured();
    setFeaturedProjects(response.data.data.slice(0, 3));
  };
  fetchFeaturedProjects();
}, []);
```

## 🛡️ الأمان والحماية

### 1. Backend Security
- **JWT Authentication**: مصادقة آمنة بـ JWT
- **Password Hashing**: تشفير كلمات المرور بـ bcrypt
- **Rate Limiting**: تحديد معدل الطلبات
- **Data Validation**: التحقق من صحة البيانات
- **XSS Protection**: حماية من XSS
- **CORS Configuration**: تكوين CORS آمن
- **Helmet.js**: رؤوس أمان إضافية

### 2. Frontend Security
- **Token Storage**: حفظ الـ Token في localStorage
- **Auto Logout**: تسجيل خروج تلقائي عند انتهاء الصلاحية
- **Input Validation**: التحقق من المدخلات
- **Error Handling**: معالجة الأخطاء الآمنة

## 🚀 التشغيل والإعداد

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
```bash
npm install
npm run dev
```

### 3. Database Setup
```bash
# إدخال البيانات التجريبية
cd backend
node scripts/seedData.js -i
```

## 📱 لوحة الإدارة

### الوصول إلى لوحة الإدارة
```
URL: http://localhost:3000/admin
Email: admin@shiftstart.sy
Password: Admin123!@#
```

### الميزات المتاحة
- **Dashboard**: إحصائيات شاملة
- **Team Management**: إدارة أعضاء الفريق
- **Projects Management**: إدارة المشاريع
- **Contact Management**: إدارة الرسائل

## 🔄 تدفق البيانات

### 1. Public Flow
```
User → Frontend → API → Database → Response → Frontend → User
```

### 2. Admin Flow
```
Admin → Login → JWT Token → Protected Routes → CRUD Operations
```

### 3. Contact Form Flow
```
User → Contact Form → API → Database + Email Notification → Success Message
```

## 📊 الإحصائيات والتقارير

### 1. Team Stats
- إجمالي الأعضاء
- الأعضاء النشطين
- توزيع الأدوار

### 2. Projects Stats
- إجمالي المشاريع
- المشاريع المميزة
- توزيع الفئات
- إجمالي المشاهدات

### 3. Contact Stats
- إجمالي الرسائل
- الرسائل الجديدة
- توزيع الأولويات
- معدل الرد

## 🔧 استكشاف الأخطاء

### مشاكل شائعة
1. **Connection Refused**: تأكد من تشغيل Backend على port 5000
2. **MongoDB Error**: تأكد من تشغيل MongoDB
3. **CORS Error**: تحقق من إعدادات CORS في Backend
4. **Auth Error**: تحقق من صحة الـ JWT Token

### Logs
- **Backend**: تحقق من console logs في terminal
- **Frontend**: تحقق من Browser Developer Tools
- **Database**: تحقق من MongoDB logs

## 🚀 الخطوات التالية

### للتطوير
1. إضافة المزيد من الميزات للوحة الإدارة
2. تحسين الأداء وإضافة Caching
3. إضافة نظام رفع الملفات
4. تحسين SEO والـ Meta Tags

### للإنتاج
1. إعداد Environment Variables للإنتاج
2. تكوين Docker للنشر
3. إعداد SSL/HTTPS
4. تحسين Database Performance

---

**الفريق**: Shift Start Development Team
**آخر تحديث**: يناير 2024