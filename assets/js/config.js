/**
 * Portfolio Configuration & Contact Details
 */
(function () {
  "use strict";

  window.PORTFOLIO_CONFIG = {
    whatsappLink: "https://wa.me/919497844660",
    contactEmail: "habeebdeveloper.india@gmail.com",
    mailtoLink: "mailto:habeebdeveloper.india@gmail.com",
    siteName: "Habeeb P",
    siteUrl: "https://habeeiiyy.in",
    githubUrl: "https://github.com/habeeiiyy",
    smashUpRepo: "https://github.com/habeeiiyy/SmashUp",
    linkedinUrl: "https://www.linkedin.com/in/habeeiiyy",
    twitterUrl: "https://twitter.com/habeeiiyy",
    location: "Palakkad, Kerala"
  };

  /**
   * Direct WhatsApp contact handler
   */
  window.handleWhatsAppContact = function (event) {
    if (event) event.preventDefault();
    const link = window.PORTFOLIO_CONFIG.whatsappLink;
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };
})();
