/**
 * Portfolio Configuration & Contact Privacy
 *
 * Single source of truth for public contact details.
 * Personal phone numbers are intentionally excluded to protect privacy.
 *
 * WHATSAPP CONFIGURATION & PRIVACY TRADE-OFF:
 * A direct WhatsApp chat link (https://wa.me/<number>) inherently includes
 * the recipient's phone number in its URL. This means any visitor can see
 * the number in the browser status bar or by inspecting page source.
 *
 * - To enable direct WhatsApp chat: Set `whatsappLink` below to your
 *   WhatsApp Business link or https://wa.me/<your-business-number>.
 * - To keep your personal number private: Leave `whatsappLink` as an empty string ("").
 *   When empty, the animated WhatsApp button opens an informative dialog
 *   guiding visitors to use the contact form or email instead.
 */
(function () {
  "use strict";

  window.PORTFOLIO_CONFIG = {
    // Leave empty to protect privacy, or supply your WhatsApp link (e.g., "https://wa.me/...")
    whatsappLink: "",
    contactEmail: "habeebdeveloper.india@gmail.com",
    mailtoLink: "mailto:habeebdeveloper.india@gmail.com",
    formAction: "https://formsubmit.co/ajax/habeebdeveloper.india@gmail.com",
    siteName: "Habeeb P",
    siteUrl: "https://habeeiiyy.in",
    githubUrl: "https://github.com/habeeiiyy",
    linkedinUrl: "https://www.linkedin.com/in/habeeiiyy",
    twitterUrl: "https://twitter.com/habeeiiyy",
    location: "Palakkad, Kerala"
  };

  /**
   * Safe WhatsApp trigger function
   * Opens the configured link if valid, or displays the privacy configuration modal.
   */
  window.handleWhatsAppContact = function (event) {
    if (event) event.preventDefault();
    const cfg = window.PORTFOLIO_CONFIG;
    if (cfg.whatsappLink && cfg.whatsappLink.trim() !== "") {
      window.open(cfg.whatsappLink, "_blank", "noopener,noreferrer");
    } else {
      if (typeof window.showWhatsAppConfigModal === "function") {
        window.showWhatsAppConfigModal();
      } else {
        alert(
          "WhatsApp direct messaging is currently in privacy configuration mode.\n\n" +
          "Please use the contact form or email directly at: " + cfg.contactEmail
        );
      }
    }
  };

  /**
   * Apply configured contact details to elements with data-contact
   */
  function applyContactConfig() {
    const cfg = window.PORTFOLIO_CONFIG;
    document.querySelectorAll("[data-contact]").forEach((el) => {
      const type = el.getAttribute("data-contact");
      if (type === "whatsapp") {
        el.addEventListener("click", window.handleWhatsAppContact);
      } else if (type === "email") {
        el.href = cfg.mailtoLink;
        if (!el.textContent.trim()) el.textContent = cfg.contactEmail;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyContactConfig);
  } else {
    applyContactConfig();
  }
})();
