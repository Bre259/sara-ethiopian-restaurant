(function () {
  "use strict";

  // ----- Header scroll state -----
  var header = document.getElementById("header");
  if (header) {
    function onScroll() {
      header.classList.toggle("scrolled", window.scrollY > 60);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ----- Mobile nav toggle -----
  var toggle = document.querySelector(".nav-toggle");
  var navList = document.querySelector(".nav-list");
  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      navList.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", navList.classList.contains("is-open"));
    });
    navList.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navList.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ----- Footer year -----
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- Form: Contact -----
  var formContact = document.getElementById("form-contact");
  var contactFeedback = document.getElementById("contact-feedback");
  if (formContact && contactFeedback) {
    formContact.addEventListener("submit", function (e) {
      e.preventDefault();
      contactFeedback.textContent = "";
      contactFeedback.className = "form-feedback";
      var btn = formContact.querySelector('button[type="submit"]');
      var orig = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending…";
      fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formContact.name.value.trim(),
          email: formContact.email.value.trim(),
          message: formContact.message.value.trim(),
        }),
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            contactFeedback.textContent = "Thank you. We'll be in touch soon.";
            contactFeedback.className = "form-feedback is-success";
            formContact.reset();
          } else {
            contactFeedback.textContent = data.error || "Something went wrong. Please try again.";
            contactFeedback.className = "form-feedback is-error";
          }
        })
        .catch(function () {
          contactFeedback.textContent = "Network error. Please check your connection and try again.";
          contactFeedback.className = "form-feedback is-error";
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = orig;
        });
    });
  }

  // ----- Form: Reservation -----
  var formRes = document.getElementById("form-reservation");
  var resFeedback = document.getElementById("reservation-feedback");
  if (formRes && resFeedback) {
    formRes.addEventListener("submit", function (e) {
      e.preventDefault();
      resFeedback.textContent = "";
      resFeedback.className = "form-feedback";
      var btn = formRes.querySelector('button[type="submit"]');
      var orig = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending…";
      fetch("/.netlify/functions/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formRes.name.value.trim(),
          email: formRes.email.value.trim(),
          phone: formRes.phone.value.trim(),
          date: formRes.date.value.trim(),
          time: formRes.time.value.trim(),
          guests: formRes.guests.value.trim(),
          note: formRes.note.value.trim(),
        }),
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            resFeedback.textContent = "Request received. We'll confirm your reservation soon.";
            resFeedback.className = "form-feedback is-success";
            formRes.reset();
            if (formRes.guests) formRes.guests.value = "2";
          } else {
            resFeedback.textContent = data.error || "Something went wrong. Please try again.";
            resFeedback.className = "form-feedback is-error";
          }
        })
        .catch(function () {
          resFeedback.textContent = "Network error. Please check your connection and try again.";
          resFeedback.className = "form-feedback is-error";
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = orig;
        });
    });
  }
})();
