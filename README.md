# NextGenX AI - DSA Practice Platform

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A dedicated Data Structures and Algorithms (DSA) practice platform built for the **NextGenX AI** upcoming college club event. This platform features a proctored exam environment, real-time code execution simulation, and an interactive leaderboard to foster a competitive coding atmosphere.

## 🚀 Features

- **Proctored Exam Environment**: Built-in anti-cheat detection that warns students when they switch tabs or exit fullscreen mode.
- **Code Execution Engine**: Supports multiple programming languages (C++, Java, Python, JavaScript) with a versatile code editor (Monaco Editor).
  > *Note: Currently uses a mock execution engine for demonstration purposes.*
- **Real-time Leaderboard**: dynamic ranking system to track participant progress during the event.
- **Admin Dashboard**: Specialized view for event organizers to monitor questions and standings.
- **Modern UI/UX**: Designed with strict dark mode aesthetics using Tailwind CSS for a premium feel.

## 🛠 Tech Stack

- **Frontend Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + `clsx` & `tailwind-merge`
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Code Editor**: `@monaco-editor/react`
- **Real-time**: [Pusher JS](https://pusher.com/) (Integration ready)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**

## 💻 Installation & Setup

Follow these steps to get the project running locally for development and collaboration.

### 1. Clone the Repository
Open your terminal and run:
```bash
git clone https://github.com/Arsh-pixel-cmd/DSA-Practice__club-event-.git
cd DSA-Practice__club-event-
```

### 2. Install Dependencies
Install the required node modules:
```bash
npm install
```

### 3. Start Development Server
Run the local development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## 📂 Project Structure

```bash
src/
├── components/
│   ├── exam/       # Exam workspace types, editor, result views
│   ├── layout/     # Navbar and shared layout components
│   └── views/      # Main page views (Landing, Admin, etc.)
├── hooks/          # Custom hooks (e.g., useAntiCheat)
├── lib/            # Utilities, constants, and mock actions
└── App.jsx         # Main application entry and routing logic
```

## 🤝 Contribution Guidelines

We welcome contributions from other club members!

1.  **Fork** the repository.
2.  Create a new **branch** feature (`git checkout -b feature/AmazingFeature`).
3.  **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4.  **Push** to the branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

## 📝 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Preview the production build locally.

---

**NextGenX AI** - *Empowering the next generation of AI innovators.*
