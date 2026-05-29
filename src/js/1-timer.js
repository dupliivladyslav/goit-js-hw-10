import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let selectedDate = null;
const btn = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');

btn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] > new Date()) {
      selectedDate = selectedDates[0];
      btn.disabled = false;
    } else {
      selectedDate = null;
      btn.disabled = true;
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
    }
  },
};

flatpickr('#datetime-picker', options);

btn.addEventListener('click', () => {
  btn.disabled = true;
  input.disabled = true;

  const interval = setInterval(() => {
    const remaining = selectedDate - Date.now();

    if (remaining <= 0) {
      clearInterval(interval);
      updateDisplay(0, 0, 0, 0);
      input.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(remaining);
    updateDisplay(days, hours, minutes, seconds);
  }, 1000);
});

function convertMs(ms) {
  const s = 1000,
    m = s * 60,
    h = m * 60,
    d = h * 24;
  return {
    days: Math.floor(ms / d),
    hours: Math.floor((ms % d) / h),
    minutes: Math.floor((ms % h) / m),
    seconds: Math.floor((ms % m) / s),
  };
}

function updateDisplay(days, hours, minutes, seconds) {
  document.querySelector('[data-days]').textContent = String(days).padStart(
    2,
    '0'
  );
  document.querySelector('[data-hours]').textContent = String(hours).padStart(
    2,
    '0'
  );
  document.querySelector('[data-minutes]').textContent = String(
    minutes
  ).padStart(2, '0');
  document.querySelector('[data-seconds]').textContent = String(
    seconds
  ).padStart(2, '0');
}
