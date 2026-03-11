# نور AI Pro — Backend

## الملفات
- `api/chat.js` — Vercel Function (تخفي مفاتيح Groq)
- `public/index.html` — التطبيق الرئيسي
- `vercel.json` — إعدادات Vercel

## خطوات الرفع على Vercel

### 1. أنشئ حساب GitHub
- افتح github.com من الموبايل
- سجّل حساب جديد

### 2. ارفع الملفات
- افتح github.com/new لإنشاء مستودع جديد
- اسمه: noor-ai
- ارفع الملفات الثلاثة

### 3. أنشئ حساب Vercel
- افتح vercel.com
- سجّل دخول بـ GitHub

### 4. أضف المفتاح السري
- في Vercel → Settings → Environment Variables
- أضف: GROQ_KEY = مفتاحك

### 5. انشر
- Vercel ينشر تلقائياً
- ستحصل على رابط مثل: noor-ai.vercel.app
