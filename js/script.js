
const modal = document.getElementById('downloadModal');
const openButton = document.querySelector('[data-open-modal]');
const closeButton = modal?.querySelector('.modal-close');
const form = document.getElementById('downloadForm');
const successBox = document.getElementById('formSuccess');
const nicknameInput = document.getElementById('nickname');
const emailInput = document.getElementById('email');
const redirectUrl = 'download.html';


function openModal() {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  nicknameInput.focus();
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

openButton?.addEventListener('click', (event) => {
  event.preventDefault();
  openModal();
});

closeButton?.addEventListener('click', closeModal);

modal?.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) {
    closeModal();
  }
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nickname = nicknameInput.value.trim();
  const email = emailInput.value.trim();

  if (!nickname || !email) {
    successBox.hidden = false;
    successBox.innerHTML = '<strong>Completa ambos campos para continuar.</strong>';
    return;
  }

  const nicknameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,20}$/;

  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  if (!nicknameRegex.test(nickname)) {
    successBox.hidden = false;
    successBox.innerHTML = '<strong>El nombre debe contener solo letras y tener entre 3 y 20 caracteres.</strong>';
    return;
  }

  if (!emailRegex.test(email)) {
    successBox.hidden = false;
    successBox.innerHTML = '<strong>Ingresa un correo válido.</strong>';
    return;
  }

  // El payload contiene fecha de llenado, se envía a base de datos
  const payload = {
    nickname,
    email,
    submittedAt: new Date().toISOString(),
  };

  fetch('http://localhost:3000/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));



  form.hidden = true;
  successBox.hidden = false;
  successBox.innerHTML = `
    <strong>¡Gracias, ${nickname}!</strong>
    <p>Tu información quedó registrada y te estamos enviando el contenido de descarga.</p>
  `;
  window.setTimeout(() => {
      window.location.assign(redirectUrl);
    }, 900);

  
  /*

  try {
    localStorage.setItem('operaGXLead', JSON.stringify(payload));

    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    form.hidden = true;
    successBox.hidden = false;
    successBox.innerHTML = `
      <strong>¡Gracias, ${nickname}!</strong>
      <p>Tu información quedó registrada y te estamos enviando el contenido de descarga.</p>
    `;

    window.setTimeout(() => {
      window.location.assign(redirectUrl);
    }, 900);
  } catch (error) {
    console.error(error);
    form.hidden = true;
    successBox.hidden = false;
    successBox.innerHTML = '<strong>No se pudo completar el envío, pero te redirigimos de todas formas.</strong>';

    window.setTimeout(() => {
      window.location.assign(redirectUrl);
    }, 900);
  }
  */
});

