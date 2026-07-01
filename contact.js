// Contact Form Validation and Success Toast alerting controller

document.addEventListener('DOMContentLoaded', () => {
  setupFormValidation();
});

function setupFormValidation() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const phoneInput = document.getElementById('user-phone');
  const messageInput = document.getElementById('user-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');
  const messageError = document.getElementById('message-error');
  const summaryContainer = document.getElementById('submission-summary');
  const fromNameHidden = document.getElementById('from-name-hidden');
  const replyToHidden = document.getElementById('reply-to-hidden');
  const userEmailHidden = document.getElementById('user-email-hidden');
  const senderMessageHidden = document.getElementById('sender-message-hidden');
  let summaryTimer = null;

  // Regex validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const digitsOnlyRegex = /^\d+$/;

  // Real-time input checking to clear error styling as user types
  const bindClearError = (input, errorLabel) => {
    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        input.classList.remove('error');
        errorLabel.style.display = 'none';
      }
    });
  };

  bindClearError(nameInput, nameError);
  bindClearError(emailInput, emailError);
  bindClearError(phoneInput, phoneError);
  bindClearError(messageInput, messageError);

  // Form submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    clearSubmissionSummary();
    let isValid = true;

    // 1. Name Check
    if (nameInput.value.trim() === '') {
      setErrorState(nameInput, nameError, "Name cannot be left empty.");
      isValid = false;
    } else {
      setSuccessState(nameInput, nameError);
    }

    // 2. Email Check
    const emailVal = emailInput.value.trim();
    if (emailVal === '') {
      setErrorState(emailInput, emailError, "Email cannot be left empty.");
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      setErrorState(emailInput, emailError, "Please enter a valid email address (e.g. user@domain.com).");
      isValid = false;
    } else {
      setSuccessState(emailInput, emailError);
    }

    // 3. Phone Check
    const phoneVal = phoneInput.value.trim();
    if (phoneVal === '') {
      setErrorState(phoneInput, phoneError, "Phone number cannot be left empty.");
      isValid = false;
    } else if (!digitsOnlyRegex.test(phoneVal)) {
      setErrorState(phoneInput, phoneError, "Phone number must contain numeric digits only (no spaces, dashes, or letters).");
      isValid = false;
    } else {
      setSuccessState(phoneInput, phoneError);
    }

    // 4. Message Check
    if (messageInput.value.trim() === '') {
      setErrorState(messageInput, messageError, "Message cannot be left empty.");
      isValid = false;
    } else {
      setSuccessState(messageInput, messageError);
    }

    if (!isValid) {
      return;
    }

    const submittedData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      message: messageInput.value.trim(),
    };

    const handleSuccess = () => {
      showSuccessToast(submittedData.name);
      showSubmissionSummary(submittedData);
      form.reset();
      [nameInput, emailInput, phoneInput, messageInput].forEach(inp => {
        inp.classList.remove('success');
      });
    };

    const templateParams = {
      from_name: submittedData.name,
      sender_name: submittedData.name,
      user_name: submittedData.name,
      name: submittedData.name,
      reply_to: submittedData.email,
      user_email: submittedData.email,
      email: submittedData.email,
      from_email: submittedData.email,
      phone: submittedData.phone,
      phone_number: submittedData.phone,
      contact_phone: submittedData.phone,
      message: submittedData.message,
      sender_message: `Message: ${submittedData.message}\nPhone: ${submittedData.phone}`,
      sender_phone: submittedData.phone,
    };

    if (window.emailjs && typeof emailjs.send === 'function') {
      emailjs.send(
        'service_w2qh78g',
        'template_z0mx9d6',
        templateParams
      ).then(handleSuccess)
      .catch((error) => {
        showErrorToast();
        console.error('EmailJS send failed:', error);
      });
    } else if (window.emailjs && typeof emailjs.sendForm === 'function') {
      if (fromNameHidden) fromNameHidden.value = submittedData.name;
      if (replyToHidden) replyToHidden.value = submittedData.email;
      if (userEmailHidden) userEmailHidden.value = submittedData.email;
      if (senderMessageHidden) senderMessageHidden.value = `Message: ${submittedData.message}\nPhone: ${submittedData.phone}`;

      emailjs.sendForm(
        'service_w2qh78g',
        'template_z0mx9d6',
        form
      ).then(handleSuccess)
      .catch((error) => {
        showErrorToast();
        console.error('EmailJS sendForm failed:', error);
      });
    } else {
      handleSuccess();
    }
  });

  function showSubmissionSummary({ name, email, phone }) {
    if (!summaryContainer) return;
    if (summaryTimer) {
      clearTimeout(summaryTimer);
      summaryTimer = null;
    }

    summaryContainer.innerHTML = `
      <div class="submission-summary-card">
        <h3>Message Sent By</h3>
        <p><strong>Name:</strong> ${escapeHTML(name)}</p>
        <p><strong>Email:</strong> ${escapeHTML(email)}</p>
        <p><strong>Phone:</strong> ${escapeHTML(phone)}</p>
      </div>
    `;
    summaryContainer.style.display = 'block';

    summaryTimer = setTimeout(() => {
      clearSubmissionSummary();
    }, 4000);
  }

  function clearSubmissionSummary() {
    if (!summaryContainer) return;
    summaryContainer.innerHTML = '';
    summaryContainer.style.display = 'none';
  }

  // Helpers to set styles
  function setErrorState(input, errorLabel, message) {
    input.classList.add('error');
    input.classList.remove('success');
    errorLabel.textContent = message;
    errorLabel.style.display = 'block';
  }

  function setSuccessState(input, errorLabel) {
    input.classList.remove('error');
    input.classList.add('success');
    errorLabel.style.display = 'none';
  }
}

// Display floating Toast alerts on valid submission
function showSuccessToast(userName) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-alert toast-success';
  
  toast.innerHTML = `
    <div class="toast-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
    <div class="toast-content">
      <h4>Transmission Successful</h4>
      <p>Thank you, <strong>${escapeHTML(userName)}</strong>! Message validated and simulated sent.</p>
    </div>
  `;

  container.appendChild(toast);

  // Auto trigger slideOut transition before removal
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}

// Escape helper to prevent cross-site HTML script injection
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

function showErrorToast() {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-alert toast-error';

  toast.innerHTML = `
    <div class="toast-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </div>
    <div class="toast-content">
      <h4>Transmission Failed</h4>
      <p>Please check your fields and try again.</p>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}
