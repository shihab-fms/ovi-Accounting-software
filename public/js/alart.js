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


export const autoMultiply = (btnprice, btnquantity) => {
  btnprice.forEach((el) => {
    el.addEventListener('input', function () {
      const quantity = this.parentElement.querySelector('#quantity').value;
      const price = this.value;
      const sum = quantity * price * 1;
      this.parentElement.querySelector('#amount').value = sum;
      // console.log(quantity, price);
    });
  });

  btnquantity.forEach((el) => {
    el.addEventListener('input', function () {
      const price = this.parentElement.querySelector('#price').value;
      const quantity = this.value;
      const sum = quantity * price * 1;
      this.parentElement.querySelector('#amount').value = sum;
      // console.log(quantity, price);
    });
  });
};