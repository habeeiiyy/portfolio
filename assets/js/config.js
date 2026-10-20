/**
 * Portfolio configuration — single source of truth for contact details.
 *
 * TIP: Copy `.env.example` to `.env` and update the values there, then mirror
 * them here. This keeps contact details in one place across every page.
 */
(function () {
  "use strict";

  window.PORTFOLIO_CONFIG = {
    whatsappNumber: "919497844660",        // digits only, with country code
    whatsappLink: "https://wa.me/919497844660",
    contactPhone: "+91 9497844660",
    contactEmail: "habeebdeveloper.india@gmail.com",
    mailtoLink: "mailto:habeebdeveloper.india@gmail.com",
    formAction: "https://formsubmit.co/ajax/habeebdeveloper.india@gmail.com",
    siteName: "Habeeb",
  };

  /**
   * Apply configured contact details to elements marked with data-contact.
   * Supported attributes: data-contact="whatsapp|email|phone"
   * Sets href (and textContent when the element has no inner content).
   */
  function applyContactConfig() {
    const cfg = window.PORTFOLIO_CONFIG;
    document.querySelectorAll('[data-contact]').forEach((el) => {
      const type = el.getAttribute('data-contact');
      if (type === 'whatsapp') {
        el.href = cfg.whatsappLink;
        if (!el.textContent.trim()) el.textContent = cfg.contactPhone;
      } else if (type === 'email') {
        el.href = cfg.mailtoLink;
        if (!el.textContent.trim()) el.textContent = cfg.contactEmail;
      } else if (type === 'phone') {
        el.href = 'tel:' + cfg.whatsappNumber;
        if (!el.textContent.trim()) el.textContent = cfg.contactPhone;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyContactConfig);
  } else {
    applyContactConfig();
  }
})();
