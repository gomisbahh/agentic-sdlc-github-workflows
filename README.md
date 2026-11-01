# Task Manager Web App (Mock Frontend Prototype)

A lightweight, zero-dependency, pure HTML5 wireframe mockup web application designed to demonstrate task management. This project serves as a clean, minimal baseline prototype to demo future SDLC workflows, agentic automation, and feature enhancements.

---

## 🎨 Design Philosophy

- **Mockup / Wireframe UI**: Styled to mimic a clean low-fidelity wireframe prototype (blueprint borders, clear visual hierarchy, monospace and system accents).
- **Frontend Only**: 100% client-side HTML5, CSS3, and Vanilla JavaScript. No backend server or external API requirements.
- **Secure DOM Handling**: Implements framework-native DOM construction methods (`textContent`, `createElement`, `replaceChildren`) adhering to safe web practices without `innerHTML` sinks.
- **Local Persistence**: Tasks persist across refreshes via browser `localStorage` (with graceful fallback to default sample data).

---

## 🚀 Features

- **Dashboard Metrics**: Real-time counter of total, pending, and completed tasks.
- **Task Management**:
  - Add tasks with title validation, priority selection (Low, Medium, High), and category tags.
  - Toggle completion status with status badges and checkboxes.
  - Delete tasks.
- **Status Filtering**: Filter view by `All`, `Pending`, or `Completed` tasks.
- **Non-blocking Feedback**: In-page notification banner for user feedback without thread-blocking `alert()` dialogs.

---

## 💻 How to Run

Because this is a pure HTML5 frontend, there are no build steps or dependencies to install.

### Option 1: Direct File Opening
Simply double-click [`index.html`](file:///Users/misbahh/work/github/agentic-sdlc-github-workflows/index.html) or open it directly in your web browser.

### Option 2: Local Static Web Server (Optional)
Using Python:
```bash
python3 -m http.server 8000
```
Then navigate to: `http://localhost:8000`

Using Node (if available):
```bash
npx serve .
```

---

## 📁 Project Structure

```text
agentic-sdlc-github-workflows/
├── index.html       # Semantic HTML5 mock page structure & CSP headers
├── styles.css       # Wireframe / mockup stylesheet
├── app.js           # Vanilla JS state, safe DOM rendering, and event handlers
└── README.md        # Project overview and instructions
```

---

## 🔮 Future Enhancement Ideas for SDLC Demos

This baseline app provides ideal canvas targets for automated workflows:
1. **GitHub Actions Workflows**: Automated linting (HTMLHint, Stylelint, ESLint) and testing.
2. **Component Upgrades**: Transitioning from wireframe mock CSS to modern UI design systems (Tailwind / CSS Modules / React).
3. **Advanced Features**: Search, task editing, drag-and-drop reordering, due date reminders.
4. **Backend Integration**: Progressive enhancement to connect REST or GraphQL APIs.
