/* LOST&FOUND 2.0 — Main interactions */
(function() {
  const onReady = (fn) => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  };

  onReady(() => {
    // IntersectionObserver for reveal animations
    const revealTargets = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-show');
            obs.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

      revealTargets.forEach((el) => io.observe(el));
    } else {
      // Fallback: show all
      revealTargets.forEach((el) => el.classList.add('reveal-show'));
    }

    // Avatars: fill initials
    document.querySelectorAll('.avatar[data-initials]').forEach((el) => {
      const t = (el.getAttribute('data-initials') || '').trim();
      if (t && !el.textContent) el.textContent = t;
    });

    // Navbar active link highlighting based on sections
    const navLinks = Array.from(document.querySelectorAll('.lf-navbar .nav-link'));
    const byHref = (hash) => navLinks.find((l) => l.getAttribute('href') === hash);
    const sections = Array.from(document.querySelectorAll('section[id]'));
    if ('IntersectionObserver' in window) {
      const so = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const link = byHref(`#${e.target.id}`);
            if (link) {
              navLinks.forEach((l) => l.classList.remove('active'));
              link.classList.add('active');
            }
          }
        });
      }, { threshold: 0.4 });
      sections.forEach((s) => so.observe(s));
    }

    // Buttons set topic and scroll to form
    const topicField = document.getElementById('topicField');
    const setTopic = (topic) => { if (topicField) topicField.value = topic; };
    const btnLost = document.getElementById('btnReportLost');
    const btnFound = document.getElementById('btnFoundSomething');
    btnLost && btnLost.addEventListener('click', () => setTopic('lost'));
    btnFound && btnFound.addEventListener('click', () => setTopic('found'));

    // Contact form validation + fake submit
    const form = document.getElementById('contactForm');
    const formMessages = document.getElementById('formMessages');
    const submitBtn = document.getElementById('submitBtn');

    form && form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }
      // Simulate submit
      submitBtn && (submitBtn.disabled = true);
      const topic = topicField && topicField.value ? topicField.value : 'general';
      const payload = {
        topic,
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
      };
      // Here you can POST payload to your backend
      setTimeout(() => {
        form.reset();
        form.classList.remove('was-validated');
        submitBtn && (submitBtn.disabled = false);
        if (formMessages) {
          formMessages.innerHTML = '<div class="alert alert-success rounded-4 mb-0"><i class="bi bi-check-circle me-2"></i>Сообщение отправлено! Мы свяжемся с вами в ближайшее время.</div>';
        }
      }, 800);
    });
  });
})();
