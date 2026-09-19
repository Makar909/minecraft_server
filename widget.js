'use strict';

// Швидкі дії: логіка кнопок віяло-меню
(function () {
  // ЗМІНИ ТУТ: реальна IP-адреса сервера та посилання на Discord
  var SERVER_IP = 'play.chetos.lt';
  var DISCORD_URL = '#';

  var TOAST_ID = 'qaToast';
  var TOAST_DURATION_MS = 2200;
  var toastEl = null;
  var toastTimer = null;

  function getToastEl() {
    if (!toastEl) {
      toastEl = document.getElementById(TOAST_ID);
    }
    return toastEl;
  }

  function showToast(message) {
    var toast = getToastEl();
    if (!toast) {
      // Немає елемента для сповіщення — не блокуємо основну дію (копіювання/перехід)
      return;
    }
    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
      toastTimer = null;
    }, TOAST_DURATION_MS);
  }

  // Резервний спосіб копіювання для браузерів без Clipboard API
  // (наприклад, старі браузери або сторінка без HTTPS)
  function legacyCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-1000px';
    textarea.style.left = '-1000px';
    document.body.appendChild(textarea);

    var selection = document.getSelection();
    var originalRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    var succeeded = false;
    try {
      succeeded = document.execCommand('copy');
    } catch (err) {
      succeeded = false;
    }

    document.body.removeChild(textarea);

    if (originalRange && selection) {
      selection.removeAllRanges();
      selection.addRange(originalRange);
    }

    return succeeded;
  }

  window.qaCopyIP = function () {
    if (!SERVER_IP) {
      showToast('IP сервера ще не вказано');
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(SERVER_IP)
        .then(function () {
          showToast('IP скопійовано: ' + SERVER_IP);
        })
        .catch(function () {
          // Clipboard API відмовила (наприклад, немає дозволу) — пробуємо старий спосіб
          if (legacyCopy(SERVER_IP)) {
            showToast('IP скопійовано: ' + SERVER_IP);
          } else {
            showToast('IP сервера: ' + SERVER_IP);
          }
        });
    } else if (legacyCopy(SERVER_IP)) {
      showToast('IP скопійовано: ' + SERVER_IP);
    } else {
      showToast('IP сервера: ' + SERVER_IP);
    }
  };

  window.qaOpenDiscord = function () {
    if (!DISCORD_URL || DISCORD_URL === '#') {
      showToast('Посилання на Discord ще не додано');
      return;
    }
    var win = window.open(DISCORD_URL, '_blank', 'noopener,noreferrer');
    if (!win) {
      // Блокувальник спливаючих вікон — даємо користувачу знати
      showToast('Дозвольте спливаючі вікна, щоб відкрити Discord');
    }
  };
})();
