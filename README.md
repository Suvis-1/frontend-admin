# Frontend Admin Dashboard

A Vue 3 + Vite powered **Admin Dashboard** for managing lessons, orders, and icons.  
This project uses **Pinia** for state management, **Vue Router** for navigation, and **Vue Toastification** for user feedback. It connects to a backend API defined via environment variables.

---

## 🚀 Features
- **Authentication** with JWT token (stored in `localStorage`).
- **Lessons Management**: create, edit, delete lessons with validation.
- **Orders Table**: view customer orders.
- **Icons Manager**: upload and preview icons.
- **Dashboard Layout**: sidebar navigation with protected routes.
- **Toast Notifications**: consistent success/error feedback.
- **Environment Config**: backend API base URL via `.env`.

---

## 📂 Project Structure
```
frontend-admin/
├── src/
│   ├── assets/          # Global styles
│   ├── components/      # Reusable components (LessonTable, LessonEditor, LessonCreator, IconManager, etc.)
│   ├── views/           # Page views (Dashboard, Login, Lessons, Orders, Icons)
│   ├── store/           # Pinia store (useAdminStore)
│   ├── api.js           # Centralized API calls
│   ├── router/          # Vue Router setup
│   └── main.js          # App entry point
├── index.html           # Root HTML
├── vite.config.js       # Vite configuration
├── package.json         # Dependencies & scripts
├── .env                 # Environment variables (ignored in git)
└── README.md            # Project documentation
```

---

## ⚙️ Setup

### 1. Clone the repo
```bash
git clone https://github.com/your-username/frontend-admin.git
cd frontend-admin
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Create a `.env` file in the root:
```
VITE_API_BASE=https://cst3144-backendserver.onrender.com
```

### 4. Run development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

### 6. Preview production build
```bash
npm run preview
```

---

## 📦 Deployment
For GitHub Pages:
```bash
npm run deploy
```
This builds the project and moves the output into the `docs/` folder, which GitHub Pages can serve.

---

## 🔑 Authentication
- Admin login stores a JWT token in `localStorage` (`adminToken`).
- Router guards check token validity before allowing access to `/dashboard/*`.
- Expired or invalid tokens redirect to `/login`.

---

## 🛠️ Tech Stack
- [Vue 3](https://vuejs.org/)  
- [Vite](https://vitejs.dev/)  
- [Pinia](https://pinia.vuejs.org/)  
- [Vue Router](https://router.vuejs.org/)  
- [Vue Toastification](https://github.com/Maronato/vue-toastification)

---

## 📖 Notes
- `.env` is ignored in `.gitignore` for security.  
- Provide an `.env.example` for collaborators:
  ```
  VITE_API_BASE=<your-backend-url>
  ```
- All API calls are centralized in `src/api.js` with token support.

