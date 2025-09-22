// script.js - navigation toggle + simple form validation + Formspree integration

document.addEventListener('DOMContentLoaded', function () {
  // Toggle nav (works for multiple toggles on different pages)
  document.querySelectorAll('.nav-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var nav = btn.nextElementSibling || document.getElementById('site-nav') || document.querySelector('.nav');
      if (nav) nav.classList.toggle('show');
    });
  });

  // Set current year(s)
  var ys = document.querySelectorAll('#year, #year-2, #year-3, #year-4');
  var y = new Date().getFullYear();
  ys.forEach(function(el){ if (el) el.textContent = y; });

  // Contact form validation + Formspree send
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var valid = true;

      // inputs
      var name = document.getElementById('name');
      var email = document.getElementById('email');
      var message = document.getElementById('message');

      // reset messages
      document.getElementById('name-error').textContent = '';
      document.getElementById('email-error').textContent = '';
      document.getElementById('message-error').textContent = '';
      document.getElementById('form-success').textContent = '';
      var errorBox = document.getElementById('form-error');
      if (errorBox) errorBox.textContent = '';

      // name
      if (!name.value.trim()) {
        document.getElementById('name-error').textContent = 'Please enter your name.';
        valid = false;
      }

      // email basic check
      if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email.';
        valid = false;
      }

      // message
      if (!message.value.trim() || message.value.trim().length < 10) {
        document.getElementById('message-error').textContent = 'Message must be at least 10 characters.';
        valid = false;
      }

      if (!valid) return;

      // ✅ Send via Formspree
      fetch("https://formspree.io/f/meorjzdy", {
        method: "POST",
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
      .then(function(response) {
        if (response.ok) {
          document.getElementById('form-success').textContent = '✅ Thanks! Your message was sent successfully.';
          form.reset();
        } else {
          return response.json().then(function(data) {
            if (data && data.errors) {
              errorBox.textContent = data.errors.map(function(err){ return err.message; }).join(", ");
            } else {
              errorBox.textContent = '❌ Oops! Something went wrong. Please try again later.';
            }
          });
        }
      })
      .catch(function(error) {
        if (errorBox) errorBox.textContent = '❌ Network error. Please try again.';
        console.error("Formspree error:", error);
      });
    });
  }
});

