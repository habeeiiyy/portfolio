/**
 * VS Code Portfolio Application Controller
 * Optimized for lightning-fast performance, low-bandwidth internet, and responsive UX.
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
      tab.classList.toggle("active", tab.getAttribute("data-file") === filename);
      tab.setAttribute("aria-selected", tab.getAttribute("data-file") === filename ? "true" : "false");
    });

    // Update Explorer items
    document.querySelectorAll(".explorer-item").forEach((item) => {
      item.classList.toggle("active", item.getAttribute("data-file") === filename);
    });

    // Update Views
    const allViews = document.querySelectorAll(".tab-view");
    allViews.forEach((view) => {
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
        // Fallback
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
          "  skills         - List technical skills\n" +
          "  experience     - Show career and education details\n" +
          "  services       - List professional development services\n" +
          "  contact        - Open contact form and details\n" +
          "  whatsapp       - Trigger WhatsApp contact action\n" +
          "  theme [name]   - Switch theme (dark, github, dracula, onedark, light)\n" +
          "  repo           - Visit GitHub portfolio repository\n" +
          "  clear          - Clear terminal output\n" +
          "  exit           - Minimize terminal drawer"
        );
        break;

      case "about":
        appendTerminalText(
          "Habeeb P - Python Django & React Full Stack Developer\n" +
          "Location: Palakkad, Kerala\n" +
          "Education: Higher Secondary in Computer Science; Brototype Full Stack Training\n" +
          "Building scalable, high-performance web applications with Python, Django, and React."
        );
        window.switchFile("about.html");
        break;

      case "skills":
        appendTerminalText(
          "Core Technical Stack:\n" +
          "  • Python (90%)\n" +
          "  • Django (85%)\n" +
          "  • React (70%)\n" +
          "  • JavaScript (75%)\n" +
          "  • HTML5 (100%)\n" +
          "  • CSS3 (90%)"
        );
        window.switchFile("skills.json");
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
          "  6. Project Planning & Support"
        );
        window.switchFile("services.py");
        break;

      case "contact":
        appendTerminalText("Opening contact view.");
        window.switchFile("contact.html");
        break;

      case "whatsapp":
        appendTerminalText("Triggering WhatsApp action...");
        if (typeof window.handleWhatsAppContact === "function") {
          window.handleWhatsAppContact();
        }
        break;

      case "clear":
        const hist = document.getElementById("terminal-history");
        if (hist) hist.textContent = "";
        return;

      case "exit":
        window.closeTerminal();
        break;

      case "repo":
        appendTerminalText("Opening repository: https://github.com/habeeiiyy/portfolio");
        window.open("https://github.com/habeeiiyy/portfolio", "_blank", "noopener,noreferrer");
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
   * WhatsApp Configuration Modal
   */
  window.showWhatsAppConfigModal = function () {
    const modal = document.getElementById("whatsapp-config-modal");
    if (modal) modal.classList.add("active");
  };

  window.closeWhatsAppModal = function () {
    const modal = document.getElementById("whatsapp-config-modal");
    if (modal) modal.classList.remove("active");
  };

  /**
   * Contact Form AJAX Handling
   */
  function setupContactForm() {
    const form = document.getElementById("vscode-contact-form");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const statusLoading = form.querySelector(".form-status-loading");
      const statusSuccess = form.querySelector(".form-status-success");
      const statusError = form.querySelector(".form-status-error");
      const submitBtn = form.querySelector("button[type='submit']");

      if (statusLoading) statusLoading.style.display = "block";
      if (statusSuccess) statusSuccess.style.display = "none";
      if (statusError) statusError.style.display = "none";
      if (submitBtn) submitBtn.disabled = true;

      const formData = new FormData(form);
      const action = form.getAttribute("action") || (window.PORTFOLIO_CONFIG && window.PORTFOLIO_CONFIG.formAction);

      try {
        const response = await fetch(action, {
          method: "POST",
          body: formData,
          headers: { "Accept": "application/json" }
        });

        if (response.ok) {
          if (statusLoading) statusLoading.style.display = "none";
          if (statusSuccess) statusSuccess.style.display = "block";
          form.reset();
        } else {
          throw new Error("HTTP " + response.status);
        }
      } catch (err) {
        if (statusLoading) statusLoading.style.display = "none";
        if (statusError) {
          statusError.textContent = "Unable to send right now. Please email directly to: habeebdeveloper.india@gmail.com";
          statusError.style.display = "block";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

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
        window.closeWhatsAppModal();
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
        window.closeWhatsAppModal();
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

  // Initialize immediately or on DOM ready
  function init() {
    loadSavedTheme();
    setupContactForm();
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
