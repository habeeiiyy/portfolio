/**
 * VS Code Portfolio Application Controller
 * Optimized for speed, low-bandwidth internet, and responsive UX.
 */
(function () {
  "use strict";

  const FILE_REGISTRY = {
    "home.py": {
      title: "home.py",
      lang: "Python",
      path: "src > home.py",
      tabId: "tab-home",
      viewId: "view-home"
    },
    "about.html": {
      title: "about.html",
      lang: "HTML",
      path: "src > about.html",
      tabId: "tab-about",
      viewId: "view-about"
    },
    "resume.md": {
      title: "resume.md",
      lang: "Markdown",
      path: "src > resume.md",
      tabId: "tab-resume",
      viewId: "view-resume"
    },
    "skills.json": {
      title: "skills.json",
      lang: "JSON",
      path: "src > skills.json",
      tabId: "tab-skills",
      viewId: "view-skills"
    },
    "services.py": {
      title: "services.py",
      lang: "Python",
      path: "src > services.py",
      tabId: "tab-services",
      viewId: "view-services"
    },
    "contact.html": {
      title: "contact.html",
      lang: "HTML",
      path: "src > contact.html",
      tabId: "tab-contact",
      viewId: "view-contact"
    },
    "socials.json": {
      title: "socials.json",
      lang: "JSON",
      path: "src > socials.json",
      tabId: "tab-socials",
      viewId: "view-socials"
    }
  };

  let currentFile = "home.py";

  /**
   * Switch the active file / editor view (globally accessible)
   */
  window.switchFile = function (filename, pushState = true) {
    if (!filename || !FILE_REGISTRY[filename]) return;
    currentFile = filename;
    const fileMeta = FILE_REGISTRY[filename];

    // Update Tabs
    document.querySelectorAll(".editor-tab").forEach((tab) => {
      const match = (tab.getAttribute("data-file") === filename);
      tab.classList.toggle("active", match);
      tab.setAttribute("aria-selected", match ? "true" : "false");
    });

    // Update Explorer items
    document.querySelectorAll(".explorer-item").forEach((item) => {
      item.classList.toggle("active", item.getAttribute("data-file") === filename);
    });

    // Update Views
    document.querySelectorAll(".tab-view").forEach((view) => {
      view.classList.remove("active");
    });

    const targetView = document.getElementById(fileMeta.viewId);
    if (targetView) {
      targetView.classList.add("active");
    }

    // Update Breadcrumbs & Status Bar
    const breadcrumbFile = document.getElementById("breadcrumb-current-file");
    const statusbarLang = document.getElementById("statusbar-lang");
    if (breadcrumbFile) breadcrumbFile.textContent = fileMeta.title;
    if (statusbarLang) statusbarLang.textContent = fileMeta.lang;

    // Trigger skills bar animation if opening skills
    if (filename === "skills.json") {
      animateSkillBars();
    }

    // Scroll editor content to top
    const editorScroll = document.querySelector(".vscode-content-scroll");
    if (editorScroll) {
      editorScroll.scrollTop = 0;
    }

    // Close mobile sidebar if open
    window.closeMobileSidebar();

    // Update URL hash
    if (pushState) {
      try {
        window.history.replaceState(null, "", "#" + filename);
      } catch (e) {
        window.location.hash = filename;
      }
    }
  };

  /**
   * Animate skill progress bars
   */
  function animateSkillBars() {
    requestAnimationFrame(() => {
      document.querySelectorAll(".skill-bar").forEach((bar) => {
        const val = bar.getAttribute("data-value") || "0";
        bar.style.width = val + "%";
      });
    });
  }

  /**
   * Mobile Sidebar Handlers
   */
  window.toggleMobileSidebar = function () {
    const sidebar = document.querySelector(".vscode-sidebar");
    const backdrop = document.querySelector(".sidebar-backdrop");
    if (!sidebar) return;
    const isOpen = sidebar.classList.toggle("mobile-open");
    if (backdrop) {
      backdrop.classList.toggle("mobile-open", isOpen);
    }
  };

  window.closeMobileSidebar = function () {
    const sidebar = document.querySelector(".vscode-sidebar");
    const backdrop = document.querySelector(".sidebar-backdrop");
    if (sidebar) sidebar.classList.remove("mobile-open");
    if (backdrop) backdrop.classList.remove("mobile-open");
  };

  window.toggleSidebarDesktop = function () {
    const sidebar = document.querySelector(".vscode-sidebar");
    if (sidebar) sidebar.classList.toggle("collapsed");
  };

  /**
   * Terminal Drawer Controls
   */
  window.toggleTerminal = function () {
    const panel = document.querySelector(".vscode-panel");
    const input = document.getElementById("terminal-input");
    if (!panel) return;
    panel.classList.toggle("collapsed");
    if (!panel.classList.contains("collapsed") && input) {
      setTimeout(() => input.focus(), 50);
    }
  };

  window.closeTerminal = function () {
    const panel = document.querySelector(".vscode-panel");
    if (panel) panel.classList.add("collapsed");
  };

  function appendTerminalText(text) {
    const history = document.getElementById("terminal-history");
    if (!history) return;
    history.textContent += text + "\n";
  }

  function handleTerminalCommand(cmd) {
    const raw = cmd.trim();
    if (!raw) return;

    appendTerminalText(`habeeb@portfolio:~$ ${raw}`);
    const args = raw.split(/\s+/);
    const command = args[0].toLowerCase();

    switch (command) {
      case "help":
        appendTerminalText(
          "Available commands:\n" +
          "  help           - Show this help menu\n" +
          "  about          - Overview of Habeeb P\n" +
          "  skills         - List technical skills (Python, Django, React, PgSQL, Redis, Docker...)\n" +
          "  smashup        - View ongoing project SmashUp details and GitHub repository\n" +
          "  experience     - Show career and education details\n" +
          "  services       - List development and scalability services\n" +
          "  contact        - Open contact options (WhatsApp / Email)\n" +
          "  whatsapp       - Open WhatsApp chat\n" +
          "  email          - Open mail client\n" +
          "  theme [name]   - Switch theme (dark, github, dracula, onedark, light)\n" +
          "  clear          - Clear terminal output\n" +
          "  exit           - Minimize terminal drawer"
        );
        break;

      case "about":
        appendTerminalText(
          "Habeeb P - Full Stack Developer\n" +
          "Location: Palakkad, Kerala\n" +
          "Stack: Django, Python, React, JavaScript, HTML, CSS, PgSQL, Docker, Celery, Redis, REST API, RabbitMQ.\n" +
          "Building scalable, high-performance web applications and backend architectures."
        );
        window.switchFile("about.html");
        break;

      case "skills":
        appendTerminalText(
          "Core Technical Stack:\n" +
          "  • Python (90%)\n" +
          "  • Django (85%)\n" +
          "  • React (75%)\n" +
          "  • JavaScript (75%)\n" +
          "  • PostgreSQL / PgSQL (85%)\n" +
          "  • Redis (80%)\n" +
          "  • Celery & RabbitMQ (80%)\n" +
          "  • Docker (75%)"
        );
        window.switchFile("skills.json");
        break;

      case "smashup":
      case "project":
      case "projects":
        appendTerminalText(
          "SmashUp (Ongoing Project):\n" +
          "  Repository: https://github.com/habeeiiyy/SmashUp\n" +
          "  Stack: Django, Python, PostgreSQL, REST APIs, Celery, Redis, Docker, AI Triage\n" +
          "  Overview: A backend-focused project management and issue tracking system built with Django, featuring AI-powered issue triage.\n" +
          "  Key Features:\n" +
          "    • Full project management and issue lifecycle tracking\n" +
          "    • AI-powered triage: auto-classifying priority, category, and suggested assignees\n" +
          "    • Background task workers with Celery and caching via Redis"
        );
        window.open("https://github.com/habeeiiyy/SmashUp", "_blank", "noopener,noreferrer");
        break;

      case "experience":
        appendTerminalText(
          "Work Experience:\n" +
          "  • Part-Time Web Developer at iTech4.com, Mannarkkad (2026 - Present)\n" +
          "    - Built & deployed OLX-style marketplace application using Python, Django, React\n" +
          "  • Freelance Full Stack Developer (Present & Available)\n" +
          "    - Independent full-lifecycle client projects and deployments"
        );
        window.switchFile("resume.md");
        break;

      case "services":
        appendTerminalText(
          "Services:\n" +
          "  1. Full-Stack Web Development\n" +
          "  2. Django Backend & REST APIs\n" +
          "  3. Responsive UI/UX Design\n" +
          "  4. Deployment & Hosting\n" +
          "  5. Maintenance & Optimization\n" +
          "  6. Scalability & Optimization (PgSQL, Redis, Celery, RabbitMQ)"
        );
        window.switchFile("services.py");
        break;

      case "contact":
        appendTerminalText("Opening contact view: WhatsApp and Email.");
        window.switchFile("contact.html");
        break;

      case "whatsapp":
        appendTerminalText("Opening WhatsApp directly...");
        window.handleWhatsAppContact();
        break;

      case "email":
        window.location.href = "mailto:habeebdeveloper.india@gmail.com";
        break;

      case "clear":
        const hist = document.getElementById("terminal-history");
        if (hist) hist.textContent = "";
        return;

      case "exit":
        window.closeTerminal();
        break;

      case "theme":
        if (args[1]) {
          const themeMap = {
            dark: "dark",
            github: "github-dark",
            dracula: "dracula",
            onedark: "one-dark",
            light: "light"
          };
          if (themeMap[args[1].toLowerCase()]) {
            window.setTheme(themeMap[args[1].toLowerCase()]);
            appendTerminalText(`Theme set to ${args[1]}`);
          } else {
            appendTerminalText("Available themes: dark, github, dracula, onedark, light");
          }
        } else {
          window.showThemeModal();
        }
        break;

      default:
        appendTerminalText(`Command not found: '${command}'. Type 'help' for available commands.`);
    }

    const panel = document.querySelector(".vscode-panel");
    if (panel) {
      const body = panel.querySelector(".panel-body");
      if (body) body.scrollTop = body.scrollHeight;
    }
  }

  /**
   * Theme Management
   */
  window.setTheme = function (themeName) {
    if (themeName === "dark") {
      document.body.removeAttribute("data-theme");
    } else {
      document.body.setAttribute("data-theme", themeName);
    }
    try {
      localStorage.setItem("vscode_portfolio_theme", themeName);
    } catch (e) {}
    window.closeThemeModal();
  };

  function loadSavedTheme() {
    try {
      const saved = localStorage.getItem("vscode_portfolio_theme");
      if (saved) {
        window.setTheme(saved);
      }
    } catch (e) {}
  }

  window.showThemeModal = function () {
    const modal = document.getElementById("theme-selector-modal");
    if (modal) modal.classList.add("active");
  };

  window.closeThemeModal = function () {
    const modal = document.getElementById("theme-selector-modal");
    if (modal) modal.classList.remove("active");
  };

  /**
   * Direct Copy Email helper
   */
  window.copyEmailAddress = function () {
    const email = "habeebdeveloper.india@gmail.com";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        alert("Copied email address: " + email);
      }).catch(() => {
        window.location.href = "mailto:" + email;
      });
    } else {
      window.location.href = "mailto:" + email;
    }
  };

  /**
   * Event Listeners Setup
   */
  function initEventListeners() {
    // Tab Clicks
    document.querySelectorAll(".editor-tab").forEach((tab) => {
      tab.addEventListener("click", function (e) {
        if (e.target.closest(".tab-close")) {
          e.preventDefault();
          e.stopPropagation();
          window.switchFile("home.py");
          return;
        }
        const file = this.getAttribute("data-file");
        if (file) {
          e.preventDefault();
          window.switchFile(file);
        }
      });
    });

    // Explorer Item Clicks
    document.querySelectorAll(".explorer-item").forEach((item) => {
      item.addEventListener("click", function (e) {
        const file = this.getAttribute("data-file");
        if (file) {
          e.preventDefault();
          window.switchFile(file);
        }
      });
    });

    // Mobile Navigation & Sidebar Toggles
    const mobileToggle = document.querySelector(".mobile-menu-toggle");
    if (mobileToggle) {
      mobileToggle.addEventListener("click", window.toggleMobileSidebar);
    }
    const backdrop = document.querySelector(".sidebar-backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", window.closeMobileSidebar);
    }

    // Activity Bar Explorer Icon
    const activityExplorer = document.getElementById("activity-explorer-btn");
    if (activityExplorer) {
      activityExplorer.addEventListener("click", function (e) {
        e.preventDefault();
        if (window.innerWidth <= 768) {
          window.toggleMobileSidebar();
        } else {
          window.toggleSidebarDesktop();
        }
      });
    }

    // Activity Bar Terminal Icon
    const activityTerminal = document.getElementById("activity-terminal-btn");
    if (activityTerminal) {
      activityTerminal.addEventListener("click", function (e) {
        e.preventDefault();
        window.toggleTerminal();
      });
    }

    // Activity Bar Settings / Theme Icon
    const activitySettings = document.getElementById("activity-settings-btn");
    if (activitySettings) {
      activitySettings.addEventListener("click", function (e) {
        e.preventDefault();
        window.showThemeModal();
      });
    }

    // Terminal Panel Close
    const terminalCloseBtn = document.getElementById("panel-close-btn");
    if (terminalCloseBtn) {
      terminalCloseBtn.addEventListener("click", window.closeTerminal);
    }

    const statusbarTerminal = document.getElementById("statusbar-terminal-toggle");
    if (statusbarTerminal) {
      statusbarTerminal.addEventListener("click", window.toggleTerminal);
    }

    // Terminal Input
    const terminalInput = document.getElementById("terminal-input");
    if (terminalInput) {
      terminalInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          handleTerminalCommand(this.value);
          this.value = "";
        }
      });
    }

    // Modal Close Handlers
    document.querySelectorAll(".modal-close-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        window.closeThemeModal();
      });
    });

    // Theme Option Selection
    document.querySelectorAll(".theme-option-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const theme = this.getAttribute("data-theme");
        if (theme) window.setTheme(theme);
      });
    });

    // Keyboard Shortcuts
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        window.closeThemeModal();
        window.closeMobileSidebar();
      }
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        window.toggleTerminal();
      }
      if (e.ctrlKey && (e.key === "b" || e.key === "B")) {
        e.preventDefault();
        if (window.innerWidth <= 768) {
          window.toggleMobileSidebar();
        } else {
          window.toggleSidebarDesktop();
        }
      }
    });

    // Hash change handler for browser back/forward buttons
    window.addEventListener("hashchange", function () {
      const hash = window.location.hash.replace("#", "");
      if (hash && FILE_REGISTRY[hash]) {
        window.switchFile(hash, false);
      }
    });
  }

  /**
   * Determine initial file based on URL or hash
   */
  function determineInitialFile() {
    const hash = window.location.hash.replace("#", "");
    if (hash && FILE_REGISTRY[hash]) {
      return hash;
    }
    const path = window.location.pathname;
    if (path.endsWith("about.html")) return "about.html";
    if (path.endsWith("resume.html")) return "resume.md";
    if (path.endsWith("services.html")) return "services.py";
    if (path.endsWith("contact.html")) return "contact.html";
    if (path.endsWith("starter-page.html")) return "socials.json";
    return "home.py";
  }

  function init() {
    loadSavedTheme();
    initEventListeners();
    const initialFile = determineInitialFile();
    window.switchFile(initialFile, false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
