# Zentriya IT Solutions - Corporate Platform & Live CMS Portal

Welcome to the **Zentriya IT Solutions** corporate web platform. This project is a modern, responsive, high-performance web application designed for a premier IT training, services, and career consultancy provider. It is built using **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS**, featuring a robust **Dual-Mode Data Engine** (Supabase live database integration with seamless client-side local storage fallback).

---

## 🚀 Key Features

- **Enterprise Showcase**: Richly detailed pages for **Services**, **Academic Programs**, **Courses**, **Internship Tracks**, **Team Directory**, **Careers**, and an interactive **Media Gallery**.
- **Tech Insights Blog & Articles**: Fully functional blog section supporting categorizations, featured posts, and live statistics tracking.
- **Client & Industry Network**: Interactive integrations showing placed students, career statistics, and corporate partner success stories.
- **Dynamic Student Journey**: Step-by-step educational roadmap visualizer.
- **Universal Live CMS Admin Panel**:
  - Secure Admin authentication (Supabase auth or secure simulated local fallback).
  - Real-time management for all sections (add/edit/delete/reorder).
  - Live table editor utilizing a generic CMS component mapping directly to Supabase tables.
- **Dual-Mode Resilient Database**: Automatically boots in **Mock Sandbox Mode** (using client-side localStorage state) if no Supabase credentials are provided or if they are unreachable. It is fully interactive immediately upon cloning! Once Supabase is configured, it migrates seamlessly to live cloud database tables.

---

## 📋 Prerequisites

Before running the project, make sure you have the following software installed on your machine:

1. **Node.js (LTS version recommended, v18.x or higher)**: [Download Node.js](https://nodejs.org/)
2. **Git**: [Download Git](https://git-scm.com/)
3. **Visual Studio Code (VS Code)**: [Download VS Code](https://code.visualstudio.com/)
4. **npm** (comes packaged with Node.js)

---

## 🛠️ Step-by-Step Installation & Local Run

Follow these exact steps to clone the project and run it in VS Code:

### 1. Clone the Repository
Open your terminal (or VS Code's integrated terminal) and run the following commands:
```bash
git clone <repository-url>
cd react-example
```
*(Replace `<repository-url>` with the actual URL of your cloned Git repository.)*

### 2. Install Dependencies
Install all required npm packages listed in `package.json`:
```bash
npm install
```

### 3. Environment Variable Setup
By default, the application runs in **Mock Sandbox Mode** out-of-the-box. To connect the application to your real-time cloud database, follow these steps:

1. Copy the `.env.example` file to create a `.env` file in the project root:
   - On Linux/macOS:
     ```bash
     cp .env.example .env
     ```
   - On Windows (Command Prompt):
     ```cmd
     copy .env.example .env
     ```
   - On Windows (PowerShell):
     ```powershell
     Copy-Item .env.example .env
     ```

2. Open the `.env` file in VS Code and fill in your Supabase connection parameters:
   ```env
   VITE_SUPABASE_URL=your_actual_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_public_key
   ```

### 4. Start the Local Development Server
Launch the development server to run the application locally:
```bash
npm run dev
```

The application will launch on **http://localhost:3000** (or another port if port 3000 is occupied). Open this URL in your web browser.

---

## 🏗️ Production Build & Verification

To verify that the project is production-ready, compile the TypeScript code and bundle the static assets:

```bash
# Clean previous build artifacts and compile the code
npm run build
```

This runs `vite build`, compiling all static assets, styles, and routes into a highly optimized, production-ready `/dist` folder.

To preview the compiled production build locally, run:
```bash
npm run preview
```

---

## 💾 Database Setup (Supabase)

If you wish to host your own live database backend on Supabase:

1. Log in to your [Supabase Dashboard](https://supabase.com/) and create a new project.
2. Navigate to the **SQL Editor** tab in your Supabase project.
3. Open the `supabase-schema.sql` file located in the root of this project, copy its entire contents, paste it into the Supabase SQL editor, and click **Run**. This will provision all necessary tables, indexes, and trigger functions.
4. Set up row-level security (RLS) policies which are pre-configured inside the SQL schema script.
5. In your Supabase project settings, go to **Project Settings** -> **API** to copy your **Project URL** and **Anon Public Key**.
6. Place those copied keys into your local `.env` file (as shown in Step 3 above).
7. The application will detect the environment variables, verify connection integrity, and transition dynamically from Mock Mode to Live Database Mode!

---

## 🔧 Troubleshooting Guide

### ❓ "Supabase connection is failing or loading indefinitely"
- **Solution**: The application includes a sophisticated auto-detecting watchdog. If your credentials in the `.env` file are incorrect, or if the Supabase server experiences a network timeout (longer than 1.5 seconds), the app safely falls back to **Mock Sandbox Mode** to keep the platform fully interactive.
- You can manually inspect or override the database settings at any time! Log in to the **Admin Portal** on your frontend, navigate to **Admin Overview** -> **Database Config Settings** to check the connection status or switch database modes.

### ❓ "Missing or unreachable module errors during npm install"
- **Solution**: Ensure you are using a modern Node.js version (LTS version 18+). If compilation errors occur, delete your local `node_modules` and lockfile, then run a fresh installation:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### ❓ "Tailwind styles are not loading or look unstyled"
- **Solution**: This project uses the next-generation `@tailwindcss/vite` plugin. The styles are automatically compiled during development and builds. Make sure you run the app using `npm run dev` and not by opening the static HTML files directly.

### ❓ "The admin password is unknown"
- **Solution**: In **Mock Mode**, you can log in with any administrative email (e.g., `admin@zentriya.com`) and any password of your choice. In **Live Supabase Mode**, admin authorization checks the `public.admins` table. Make sure to register an admin user according to the guidelines in the Admin Portal setup instructions.

---

## 📦 Key Development Scripts

Inside `package.json`, you will find the following scripts:

- `npm run dev`: Boots the fast Vite local server with file watching.
- `npm run build`: Compiles and optimizes assets into `/dist` for static hosting.
- `npm run preview`: Locally previews the optimized production build.
- `npm run lint`: Runs the TypeScript compiler to check for static typing issues without emitting files (`tsc --noEmit`).
- `npm run clean`: Cleans previous build folders to keep your repository tidy.
