(function () {
  const passwordInput = document.getElementById('clave');
  const toggleButton = document.getElementById('togglePassword');
  const registerAlert = document.getElementById('registerAlert');
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');

  function showAlert(message) {
    if (!registerAlert) {
      return;
    }

    registerAlert.textContent = message;
    registerAlert.classList.add('visible');
  }

  if (toggleButton && passwordInput) {
    toggleButton.addEventListener('click', function () {
      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    });
  }

  function applyPageMessages() {
    if (error === 'duplicado') {
      showAlert('Ese nombre de usuario ya existe.');
    } else if (error === 'db') {
      showAlert('No se pudo guardar la cuenta en la base de datos.');
    } else if (error === 'datos') {
      showAlert('Completa todos los datos obligatorios.');
    }
  }

  fetch('session_status.php', { credentials: 'same-origin' })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('No se pudo verificar la sesion');
      }

      return response.json();
    })
    .then(function (data) {
      if (data.authenticated) {
        window.location.replace('inicio.html');
        return;
      }

      applyPageMessages();
    })
    .catch(function () {
      applyPageMessages();
    });
})();
