/* Aivanta Scholar Foundation - contact form (frontend only) */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contact-form");
    var msg = document.getElementById("contact-msg");
    if (!form || !msg) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      msg.textContent =
        "Thank you for reaching out! We have received your message and will reply soon. (Online delivery is coming soon.)";
      msg.classList.remove("hidden");
      msg.scrollIntoView({ behavior: "smooth", block: "center" });
      form.reset();
    });
  });
})();
