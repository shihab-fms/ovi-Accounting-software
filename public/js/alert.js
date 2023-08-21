import axios from 'axios';

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg) => {
  hideAlert();

  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(() => {
    hideAlert();
  }, 2000);
};

export const massiveError = (type, msg) => {
  alert(msg);
};

export const showModal = () => {
  const markup = `
    <div id="confirmationModal" class="modal">
      <div class="modal-content">
        <p>Are you sure you want to confirm?</p>
        <button class="btn btn-primary m-3" id="confirmModalButton">Confirm</button>
        <button class="btn btn-danger m-3" id="cancelModalButton">Cancel</button>
      </div>
    </div>
  `;
  document.querySelector('body').insertAdjacentHTML('beforeend', markup);
  document.getElementById('confirmationModal').style.display = 'block';
};

export const modifyDate = () => {
  document.querySelectorAll('#date').forEach(
    (el) =>
      (el.textContent = new Date(el.textContent).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }))
  );
};

export const searchContent = (type) => {
  let input, filter, perentEl, chieldEl, a, i, txtValue;
  input = document.querySelector('.myInput');
  filter = input.value.toUpperCase();
  perentEl = document.querySelector('.myperent');
  chieldEl = perentEl.querySelectorAll('.view--data');
  for (i = 0; i < chieldEl.length; i++) {
    a = type === 'BL'
      ? chieldEl[i].getElementsByTagName('label')[1]
      : chieldEl[i].getElementsByTagName('label')[2];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      chieldEl[i].style.display = '';
    } else {
      chieldEl[i].style.display = 'none';
    }
  }
};
