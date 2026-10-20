/**
 * VS Code Portfolio Application Controller
 * Optimized for speed, modularity, low-bandwidth networks, and seamless PJAX navigation.
 */
(function () {
  "use strict";

  const FILE_REGISTRY = {
    "home.py": {
      title: "home.py",
      url: "index.html",
      lang: "Python",
      path: "src > home.py",
      tabId: "tab-home",
      viewId: "view-home"
    },
    "about.html": {
      title: "about.html",
      url: "about.html",
      lang: "HTML",
      path: "src > about.html",
      tabId: "tab-about",
      viewId: "view-about"
    },
    "resume.md": {
      title: "resume.md",
      url: "resume.html",
      lang: "Markdown",
      path: "src > resume.md",
      tabId: "tab-resume",
      viewId: "view-resume"
    },
    "skills.json": {
      title: "skills.json",
      url: "skills.html",
      lang: "JSON",
      path: "src > skills.json",
      tabId: "tab-skills",
      viewId: "view-skills"
    },
    "services.py": {
      title: "services.py",
      url: "services.html",
      lang: "Python",
      path: "src > services.py",
      tabId: "tab-services",
      viewId: "view-services"
    },
    "contact.html": {
      title: "contact.html",
      url: "contact.html",
      lang: "HTML",
      path: "src > contact.html",
      tabId: "tab-contact",
      viewId: "view-contact"
    },
    "socials.json": {
      title: "socials.json",
      url: "socials.html",
      lang: "JSON",
      path: "src > socials.json",
      tabId: "tab-socials",
      viewId: "view-socials"
    }
  };

  const URL_TO_FILE = {};
  Object.keys(FILE_REGISTRY).forEach((filename) => {
    URL_TO_FILE[FILE_REGISTRY[filename].url] = filename;
  });

  const pageCache = new Map();
  let currentFile = "home.py";

  function getCurrentUrlFilename() {
    const raw = window.location.pathname.split("/").pop() || "index.html";
    return raw.split("#")[0] || "index.html";
  }

  /**
   * Seamless in-memory PJAX page loader
   */
  async function loadPage(targetUrl, pushState = true) {
    if (!targetUrl) return;
    const urlFilename = targetUrl.split("/").pop().split("#")[0] || "index.html";
    const currentFilename = getCurrentUrlFilename();

    const targetFile = URL_TO_FILE[urlFilename] || "home.py";

    // If already on the page, just scroll editor to top
    if (urlFilename === currentFilename && !pushState) {
      const editorScroll = document.querySelector(".vscode-content-scroll");
      if (editorScroll) editorScroll.scrollTop = 0;
      if (targetFile === "skills.json") animateSkillBars();
      return;
    }

    try {
      let htmlText = pageCache.get(urlFilename);
      if (!htmlText) {
        const response = await fetch(urlFilename);
        if (!response.ok) {
          window.location.href = urlFilename;
          return;
        }
        htmlText = await response.text();
        pageCache.set(urlFilename, htmlText);
      }

      const parser = new DOMParser();
      const newDoc = parser.parseFromString(htmlText, "text/html");

      // Replace title
      document.title = newDoc.title;

      // Replace editor body
      const currentEditor = document.querySelector(".vscode-editor-body");
      const newEditor = newDoc.querySelector(".vscode-editor-body");
      if (currentEditor && newEditor) {
        currentEditor.innerHTML = newEditor.innerHTML;
        const scrollElem = currentEditor.querySelector(".vscode-content-scroll");
        if (scrollElem) scrollElem.scrollTop = 0;
      }

      // Replace tabs bar
      const currentTabs = document.querySelector(".vscode-tabs-bar");
      const newTabs = newDoc.querySelector(".vscode-tabs-bar");
      if (currentTabs && newTabs) {
        currentTabs.innerHTML = newTabs.innerHTML;
      }

      // Replace breadcrumbs
      const currentBreadcrumbs = document.querySelector(".vscode-breadcrumbs");
      const newBreadcrumbs = newDoc.querySelector(".vscode-breadcrumbs");
      if (currentBreadcrumbs && newBreadcrumbs) {
        currentBreadcrumbs.innerHTML = newBreadcrumbs.innerHTML;
      }

      // Replace explorer
      const currentExplorer = document.querySelector(".explorer-list");
      const newExplorer = newDoc.querySelector(".explorer-list");
      if (currentExplorer && newExplorer) {
        currentExplorer.innerHTML = newExplorer.innerHTML;
      }

      // Replace search box text
      const currentSearchBox = document.querySelector(".titlebar-search-box span");
      const newSearchBox = newDoc.querySelector(".titlebar-search-box span");
      if (currentSearchBox && newSearchBox) {
        currentSearchBox.innerHTML = newSearchBox.innerHTML;
      }

      // Replace status bar language
      const currentLang = document.getElementById("statusbar-lang");
      const newLang = newDoc.getElementById("statusbar-lang");
      if (currentLang && newLang) {
        currentLang.textContent = newLang.textContent;
      }

      currentFile = targetFile;

      // Animate skills if opening skills page
      if (targetFile === "skills.json") {
        animateSkillBars();
      }

      window.closeMobileSidebar();

      if (pushState) {
        window.history.pushState({ url: urlFilename, file: targetFile }, "", urlFilename);
      }
    } catch (e) {
      window.location.href = urlFilename;
    }
  }

  /**
   * Switch the active file / editor view (globally accessible)
   */
  window.switchFile = function (filename, pushState = true) {
    if (!filename) return;
    const meta = FILE_REGISTRY[filename];
    if (meta && meta.url) {
      loadPage(meta.url, pushState);
    } else {
      loadPage(filename, pushState);
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
    history.scrollTop = history.scrollHeight;
  }

  function handleTerminalCommand(cmd) {
    const raw = cmd.trim();
    if (!raw) return;

    appendTerminalText("habeeb@portfolio:~$ " + raw);
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
          "  whatsapp       - Open WhatsApp direct chat with Habeeb\n" +
          "  theme          - Change editor theme (dark, light, monokai, high-contrast)\n" +
          "  clear          - Clear terminal output"
        );
        break;

      case "about":
        appendTerminalText(
          "Habeeb P - Full Stack Developer (Palakkad, Kerala)\n" +
          "Stack: Python, Django, React, PostgreSQL, Docker, Celery, Redis, RabbitMQ"
        );
        window.switchFile("about.html");
        break;

      case "skills":
        appendTerminalText(
          "Core Engineering Competencies:\n" +
          "  • Development (95%)\n" +
          "  • Scalability (90%)\n" +
          "  • Bug Fixing (92%)\n" +
          "  • Deployment (85%)\n" +
          "Stack: Python, Django, React, PostgreSQL, Redis, Celery, RabbitMQ, Docker"
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
          "  1. Backend Architecture & REST APIs (Python, Django)\n" +
          "  2. Scalability & Optimization (PgSQL, Redis, Celery, RabbitMQ)\n" +
          "  3. Full Stack Synergy (Django + React)\n" +
          "  4. Database Performance & Relational Modeling (PostgreSQL)"
        );
        window.switchFile("services.py");
        break;

      case "contact":
        appendTerminalText(
          "Contact Options:\n" +
          "  • WhatsApp: https://wa.me/919497844660\n" +
          "  • Email: habeebdeveloper.india@gmail.com"
        );
        window.switchFile("contact.html");
        break;

      case "whatsapp":
        appendTerminalText("Opening WhatsApp direct chat (https://wa.me/919497844660)...");
        if (window.handleWhatsAppContact) {
          window.handleWhatsAppContact();
        } else {
          window.open("https://wa.me/919497844660", "_blank", "noopener,noreferrer");
        }
        break;

      case "theme":
        if (args[1]) {
          const themeName = args[1].toLowerCase();
          const validThemes = ["dark", "light", "monokai", "high-contrast"];
          if (validThemes.includes(themeName)) {
            window.setTheme(themeName);
            appendTerminalText("Theme set to: " + themeName);
          } else {
            appendTerminalText("Invalid theme. Available: " + validThemes.join(", "));
          }
        } else {
          window.showThemeModal();
        }
        break;

      case "clear":
      case "cls":
        const hist = document.getElementById("terminal-history");
        if (hist) hist.textContent = "";
        break;

      default:
        appendTerminalText("Command not recognized: '" + command + "'. Type 'help' for available commands.");
        break;
    }
  }

  /**
   * Theme Management
   */
  const THEME_KEY = "vscode_portfolio_theme";

  window.setTheme = function (themeName) {
    const validThemes = ["dark", "light", "monokai", "high-contrast"];
    if (!validThemes.includes(themeName)) return;

    if (themeName === "dark") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", themeName);
    }

    try {
      localStorage.setItem(THEME_KEY, themeName);
    } catch (e) {}

    document.querySelectorAll(".theme-option-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-theme") === themeName);
    });

    const statusbarTheme = document.getElementById("statusbar-theme");
    if (statusbarTheme) {
      statusbarTheme.textContent = themeName.charAt(0).toUpperCase() + themeName.slice(1);
    }

    window.closeThemeModal();
  };

  function loadSavedTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) window.setTheme(saved);
    } catch (e) {}
  }

  window.showThemeModal = function () {
    const modal = document.getElementById("theme-modal");
    if (modal) {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    }
  };

  window.closeThemeModal = function () {
    const modal = document.getElementById("theme-modal");
    if (modal) {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    }
  };

  /**
   * 1-Click Copy Email Helper
   */
  window.copyEmailAddress = function (event) {
    if (event) event.preventDefault();
    const email = (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.contactEmail) || "habeebdeveloper.india@gmail.com";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        showCopyNotification();
      }).catch(() => {
        fallbackCopyText(email);
      });
    } else {
      fallbackCopyText(email);
    }
  };

  function fallbackCopyText(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showCopyNotification();
    } catch (err) {}
    document.body.removeChild(ta);
  }

  function showCopyNotification() {
    const btn = document.getElementById("copy-email-btn");
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check-lg" aria-hidden="true"></i> <span>Email Copied!</span>';
      setTimeout(() => {
        btn.innerHTML = orig;
      }, 2200);
    }
  }

  /**
   * Event Listeners Initialization
   */
  function initEventListeners() {
    // Intercept clicks on tabs, explorer, and menu links for instant PJAX swap
    document.addEventListener("click", function (e) {
      const link = e.target.closest("a.editor-tab, a.explorer-item, a.titlebar-menu-item, a.hero-nav-btn");
      if (link) {
        const href = link.getAttribute("href");
        if (href && !href.startsWith("http") && !href.startsWith("mailto:") && !href.startsWith("tel:") && !href.startsWith("#") && !link.getAttribute("target")) {
          e.preventDefault();
          loadPage(href, true);
        }
      }
    });

    // Browser back / forward buttons
    window.addEventListener("popstate", function (e) {
      const targetUrl = (e.state && e.state.url) || getCurrentUrlFilename();
      loadPage(targetUrl, false);
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
  }

  // Background prefetch for instant 0ms switching
  function prefetchPages() {
    const cur = getCurrentUrlFilename();
    Object.values(FILE_REGISTRY).forEach((item) => {
      if (item.url !== cur && !pageCache.has(item.url)) {
        fetch(item.url)
          .then((r) => r.text())
          .then((html) => pageCache.set(item.url, html))
          .catch(() => {});
      }
    });
  }

  function init() {
    loadSavedTheme();
    initEventListeners();
    const cur = getCurrentUrlFilename();
    currentFile = URL_TO_FILE[cur] || "home.py";
    pageCache.set(cur, document.documentElement.outerHTML);

    if (currentFile === "skills.json") {
      animateSkillBars();
    }

    setTimeout(prefetchPages, 300);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
