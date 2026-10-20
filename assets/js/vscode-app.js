/**
 * VS Code Portfolio Application Controller
 * Handles tab navigation, explorer tree, responsive sidebar, terminal CLI,
 * theme management, contact form AJAX, and secure WhatsApp action.
 */
(function () {
  "use strict";

  // Available file views and metadata
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

  // Elements
  const tabsContainer = document.querySelector(".vscode-tabs-bar");
  const breadcrumbFile = document.getElementById("breadcrumb-current-file");
  const statusbarLang = document.getElementById("statusbar-lang");
  const sidebar = document.querySelector(".vscode-sidebar");
  const sidebarBackdrop = document.querySelector(".sidebar-backdrop");
  const terminalPanel = document.querySelector(".vscode-panel");
  const terminalHistory = document.getElementById("terminal-history");
  const terminalInput = document.getElementById("terminal-input");
  const whatsappModal = document.getElementById("whatsapp-config-modal");
  const themeModal = document.getElementById("theme-selector-modal");

  /**
   * Switch the active file / editor view
   */
  function switchFile(filename, pushState = true) {
    if (!FILE_REGISTRY[filename]) return;
    currentFile = filename;
    const fileMeta = FILE_REGISTRY[filename];

    // Update Tabs
    document.querySelectorAll(".editor-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.getAttribute("data-file") === filename);
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
    closeMobileSidebar();

    // Update URL hash
    if (pushState) {
      window.history.replaceState(null, "", "#" + filename);
    }
  }

  /**
   * Animate skill progress bars
   */
  function animateSkillBars() {
    setTimeout(() => {
      document.querySelectorAll(".skill-bar").forEach((bar) => {
        const val = bar.getAttribute("data-value") || "0";
        bar.style.width = val + "%";
      });
    }, 100);
  }

  /**
   * Mobile Sidebar Handlers
   */
  function toggleMobileSidebar() {
    if (!sidebar) return;
    const isOpen = sidebar.classList.toggle("mobile-open");
    if (sidebarBackdrop) {
      sidebarBackdrop.classList.toggle("mobile-open", isOpen);
    }
  }

  function closeMobileSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove("mobile-open");
    if (sidebarBackdrop) {
      sidebarBackdrop.classList.remove("mobile-open");
    }
  }

  function toggleSidebarDesktop() {
    if (!sidebar) return;
    sidebar.classList.toggle("collapsed");
  }

  /**
   * Terminal Drawer Controls
   */
  function toggleTerminal() {
    if (!terminalPanel) return;
    terminalPanel.classList.toggle("collapsed");
    if (!terminalPanel.classList.contains("collapsed") && terminalInput) {
      terminalInput.focus();
    }
  }

  function closeTerminal() {
    if (terminalPanel) {
      terminalPanel.classList.add("collapsed");
    }
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
        switchFile("about.html");
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
        switchFile("skills.json");
        break;

      case "experience":
        appendTerminalText(
          "Work Experience:\n" +
          "  • Part-Time Web Developer at iTech4.com, Mannarkkad (2026 - Present)\n" +
          "    - Built & deployed OLX-style marketplace application using Python, Django, React\n" +
          "  • Freelance Full Stack Developer (Present & Available)\n" +
          "    - Independent full-lifecycle client projects and deployments"
        );
        switchFile("resume.md");
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
        switchFile("services.py");
        break;

      case "contact":
        appendTerminalText("Opening contact view: email habeebdeveloper.india@gmail.com, WhatsApp, or contact form.");
        switchFile("contact.html");
        break;

      case "whatsapp":
        appendTerminalText("Triggering WhatsApp action...");
        window.handleWhatsAppContact();
        break;

      case "clear":
        if (terminalHistory) terminalHistory.textContent = "";
        return;

      case "exit":
        closeTerminal();
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
            setTheme(themeMap[args[1].toLowerCase()]);
            appendTerminalText(`Theme set to ${args[1]}`);
          } else {
            appendTerminalText("Available themes: dark, github, dracula, onedark, light");
          }
        } else {
          openThemeModal();
        }
        break;

      default:
        appendTerminalText(`Command not found: '${command}'. Type 'help' for available commands.`);
    }

    if (terminalPanel) {
      const body = terminalPanel.querySelector(".panel-body");
      if (body) body.scrollTop = body.scrollHeight;
    }
  }

  function appendTerminalText(text) {
    if (!terminalHistory) return;
    terminalHistory.textContent += text + "\n";
  }

  /**
   * Theme Management
   */
  function setTheme(themeName) {
    if (themeName === "dark") {
      document.body.removeAttribute("data-theme");
    } else {
      document.body.setAttribute("data-theme", themeName);
    }
    try {
      localStorage.setItem("vscode_portfolio_theme", themeName);
    } catch (e) {
      // Ignore localStorage failure in sandboxes
    }
    closeThemeModal();
  }

  function loadSavedTheme() {
    try {
      const saved = localStorage.getItem("vscode_portfolio_theme");
      if (saved) {
        setTheme(saved);
      }
    } catch (e) {
      // Ignore
    }
  }

  function openThemeModal() {
    if (themeModal) themeModal.classList.add("active");
  }

  function closeThemeModal() {
    if (themeModal) themeModal.classList.remove("active");
  }

  /**
   * WhatsApp Configuration Modal
   */
  window.showWhatsAppConfigModal = function () {
    if (whatsappModal) {
      whatsappModal.classList.add("active");
    }
  };

  function closeWhatsAppModal() {
    if (whatsappModal) {
      whatsappModal.classList.remove("active");
    }
  }

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
      const action = form.getAttribute("action") || window.PORTFOLIO_CONFIG.formAction;

      try {
        const response = await fetch(action, {
          method: "POST",
          body: formData,
          headers: {
            "Accept": "application/json"
          }
        });

        if (response.ok) {
          if (statusLoading) statusLoading.style.display = "none";
          if (statusSuccess) statusSuccess.style.display = "block";
          form.reset();
        } else {
          throw new Error("Server responded with status " + response.status);
        }
      } catch (err) {
        if (statusLoading) statusLoading.style.display = "none";
        if (statusError) {
          statusError.textContent = "Error sending message. Please email directly at habeebdeveloper.india@gmail.com";
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
          // Tab close clicked: if only 1 tab, don't close, else switch to home
          e.preventDefault();
          e.stopPropagation();
          switchFile("home.py");
          return;
        }
        const file = this.getAttribute("data-file");
        if (file) {
          e.preventDefault();
          switchFile(file);
        }
      });
    });

    // Explorer Item Clicks
    document.querySelectorAll(".explorer-item").forEach((item) => {
      item.addEventListener("click", function (e) {
        const file = this.getAttribute("data-file");
        if (file) {
          e.preventDefault();
          switchFile(file);
        }
      });
    });

    // Mobile Navigation & Sidebar Toggles
    const mobileToggle = document.querySelector(".mobile-menu-toggle");
    if (mobileToggle) {
      mobileToggle.addEventListener("click", toggleMobileSidebar);
    }
    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener("click", closeMobileSidebar);
    }

    // Activity Bar Explorer Icon
    const activityExplorer = document.getElementById("activity-explorer-btn");
    if (activityExplorer) {
      activityExplorer.addEventListener("click", function (e) {
        e.preventDefault();
        if (window.innerWidth <= 768) {
          toggleMobileSidebar();
        } else {
          toggleSidebarDesktop();
        }
      });
    }

    // Activity Bar Terminal Icon
    const activityTerminal = document.getElementById("activity-terminal-btn");
    if (activityTerminal) {
      activityTerminal.addEventListener("click", function (e) {
        e.preventDefault();
        toggleTerminal();
      });
    }

    // Activity Bar Settings / Theme Icon
    const activitySettings = document.getElementById("activity-settings-btn");
    if (activitySettings) {
      activitySettings.addEventListener("click", function (e) {
        e.preventDefault();
        openThemeModal();
      });
    }

    // Terminal Panel Controls
    const terminalCloseBtn = document.getElementById("panel-close-btn");
    if (terminalCloseBtn) {
      terminalCloseBtn.addEventListener("click", closeTerminal);
    }

    const statusbarTerminal = document.getElementById("statusbar-terminal-toggle");
    if (statusbarTerminal) {
      statusbarTerminal.addEventListener("click", toggleTerminal);
    }

    // Terminal Input Enter key
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
        closeWhatsAppModal();
        closeThemeModal();
      });
    });

    // Theme Option Selection
    document.querySelectorAll(".theme-option-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const theme = this.getAttribute("data-theme");
        if (theme) setTheme(theme);
      });
    });

    // Keyboard Shortcuts
    document.addEventListener("keydown", function (e) {
      // ESC closes modals and mobile sidebar
      if (e.key === "Escape") {
        closeWhatsAppModal();
        closeThemeModal();
        closeMobileSidebar();
      }
      // Ctrl + ` (backtick) toggles terminal
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        toggleTerminal();
      }
      // Ctrl + B toggles sidebar
      if (e.ctrlKey && (e.key === "b" || e.key === "B")) {
        e.preventDefault();
        if (window.innerWidth <= 768) {
          toggleMobileSidebar();
        } else {
          toggleSidebarDesktop();
        }
      }
    });

    // Hash change handler for browser back/forward buttons
    window.addEventListener("hashchange", function () {
      const hash = window.location.hash.replace("#", "");
      if (hash && FILE_REGISTRY[hash]) {
        switchFile(hash, false);
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
    if (path.includes("about.html")) return "about.html";
    if (path.includes("resume.html")) return "resume.md";
    if (path.includes("services.html")) return "services.py";
    if (path.includes("contact.html")) return "contact.html";
    if (path.includes("starter-page.html")) return "socials.json";
    return "home.py";
  }

  // Initialize
  document.addEventListener("DOMContentLoaded", function () {
    loadSavedTheme();
    setupContactForm();
    initEventListeners();
    const initialFile = determineInitialFile();
    switchFile(initialFile, false);
  });
})();
