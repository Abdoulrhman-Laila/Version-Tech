# Version-Tech — نقطة تحول

موقع ويب احترافي لفريق **Version-Tech** للتطوير والتصميم، مبني بـ **React** و **Vite** و **Tailwind CSS**، مع دعم ثنائي اللغة (عربي / إنجليزي)، الوضع الليلي، ولوحة إدارية لإدارة المحتوى.

![Version-Tech](https://img.shields.io/badge/Version--Tech-نقطة%20تحول-4d3bff)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Vite](https://img.shields.io/badge/Vite-7-646CFF)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC)

## المميزات

### التصميم والواجهة
- تصميم حديث بألوان **Primary** (انظر `tailwind.config.js` و `src/index.css`)
- دعم **الوضع الليلي / النهاري** مع حفظ التفضيل
- **RTL / LTR** تلقائي حسب اللغة
- تأثيرات **glass**، **gradient-text**، وظلال `shadow-soft` / `shadow-medium`
- رسوم متحركة عبر **Framer Motion**

### المحتوى واللغات
- **i18next** — ملفات الترجمة في `src/i18n/locales/`
- عناوين SEO عبر **react-helmet-async**

### الأداء
- **Vite** للبناء السريع
- **Lazy loading** لصفحات الموقع العامة في `App.jsx`

### الصفحات (الواجهة العامة)
- الرئيسية، من نحن، الخدمات، الفريق، المشاريع، التواصل، التسجيل، 404

### لوحة الإدارة
- مسارات تحت `/admin` (مثال: `/admin/dashboard`, `/admin/team`, `/admin/projects`, `/admin/contacts`)
- واجهات متصلة بـ API عبر `src/services/api.js` (يتطلب تشغيل الـ backend)

## البدء السريع

### المتطلبات
- **Node.js** 18+ (يُفضّل LTS)
- **npm**

### التثبيت والتشغيل

```bash
git clone <repository-url>
cd <project-folder>
npm install
npm run dev
```

يفتح عادةً على: **http://localhost:5173** (المنفذ الافتراضي لـ Vite).

### البناء والمعاينة

```bash
npm run build
npm run preview
```

### فحص الكود

```bash
npm run lint
```

## الخلفية (API) — اختياري

يوجد مجلد **`backend/`** يحتوي خادم API للمشروع. راجع `backend/README.md` لتشغيله وربطه بالواجهة.

## نظام الألوان (Tailwind)

الألوان الأساسية معرّفة كسلسلة **`primary`** في `tailwind.config.js`، مع تدرجات مثل `bg-primary-gradient`، واستخدام دوال مساعدة في `src/index.css` (مثل `.card`, `.glass`, `.btn-gradient`).

مثال مختصر:

```js
// tailwind.config.js — theme.extend.colors.primary
primary: {
  500: "#6f6af0",
  600: "#4d3bff",
  800: "#1e3a8a",
  900: "#141a3a",
  // ...
}
```

## هيكل المشروع (مبسّط)

```
src/
├── assets/              # صور وموارد ثابتة (مثل الشعار)
├── components/
│   ├── Layout/          # Header, Footer
│   └── UI/              # LoadingSpinner وغيرها
├── contexts/            # AppContext (ثيم، لغة، …)
├── i18n/
│   └── locales/         # ar.json, en.json
├── pages/               # صفحات الموقع
│   └── Admin/           # لوحة الإدارة
├── services/            # طلبات API (axios)
├── App.jsx
├── main.jsx
└── index.css            # أنماط عامة + فئات مساعدة
```

## التقنيات الرئيسية

| الطبقة | الأدوات |
|--------|---------|
| الواجهة | React 18, React Router 6 |
| البناء | Vite 7 |
| الأنماط | Tailwind CSS 3, PostCSS |
| الحركة | Framer Motion |
| النماذج | React Hook Form, Yup |
| الترجمة | i18next, react-i18next |
| الطلبات | Axios |
| الإشعارات | react-hot-toast |
| SEO | react-helmet-async |

## التخصيص السريع

- **الترجمة**: عدّل `src/i18n/locales/ar.json` و `en.json`
- **الألوان والثيم**: `tailwind.config.js` و `src/index.css`
- **مسارات الصفحات**: `src/App.jsx`

## الترخيص

هذا المشروع مرخّص تحت [MIT License](LICENSE) (إن وُجد الملف).

## التواصل (مثال — عدّل حسب نطاقك)

- **الموقع**: [version-tech.sy](https://version-tech.sy)
- **البريد**: info@version-tech.sy

---

<div align="center">
  <p>صنع بـ ❤️ بواسطة فريق <strong>Version-Tech</strong></p>
  <p>© 2024–2026 Version-Tech</p>
</div>

</div>