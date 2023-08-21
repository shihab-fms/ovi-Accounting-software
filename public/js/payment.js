import axios from 'axios';
import { showAlert, showModal } from './alert';

//  1) Send Grand Total Amount to User Interface

export const sendSumAmount = () => {
  const amountEL = document.querySelector('.amount');
  const amount = [];
  const el = document
    .querySelectorAll('#amount')
    .forEach((el) => amount.push(+el.value));

  amountEL.innerHTML = `Total Amount Tk.= ${amount.reduce(
    (acc, el) => acc + el,
    0
  )}/-`;
};

//   2) Add button for inputing new Ledger payment Element

export const addPaymentLedgerEement = () => {
  const btnAdd = document.querySelector('#add--more__ledger');
  const parentEl = document.querySelector('.data');

  btnAdd.addEventListener('click', function (e) {
    e.preventDefault();
    sendSumAmount();
    axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/ledgers/all',
    })
      .then((res) => {
        const ledgers = res.data.data.data;

        const markup = `
              <div class="payment--content payment--content__body">
                <label for="" class="mb-0 m-3 form-label text-wrap slNo">${
                  document.querySelectorAll('.slNo').length + 1
                }</label>
                <select
                  style="width: 30%"
                  class="form-select form-control m-3"
                  name="ledgerName"
                  id="ledgerName"
                  required
                >
                  <option selected>Select a ledger name</option>
                  ${ledgers.map(
                    (el) => `<option value=${el._id}>
                    ${el.name}
                  </option>`
                  )}
                </select>
                <input
                  style="width: 32%"
                  type="text"
                  id="purpose"
                  class="form-control m-3"
                  required
                  placeholder="put some comments"
                />
                <input
                  style="width: 32%"
                  type="number"
                  id="amount"
                  class="form-control m-3"
                  required
                  placeholder="Amount"
                />
              </div>
      `;

        parentEl.insertAdjacentHTML('beforeend', markup);
      })
      .catch((err) => showAlert('error', err.response.data.message));
  });
};

//   3) Removeing last Payment items
export const removePaymentLedgerElement = () => {
  const btnRemove = document.querySelector('#remove--last__ledger');
  const paymentBodyEl = document.querySelector('.data');
  btnRemove.addEventListener('click', function (e) {
    e.preventDefault();
    paymentBodyEl.lastChild.remove();
    sendSumAmount();
  });
};

//   4) Search Payment and Send Payment to View page and render it
export const searchedPaymentToView = async (paymentId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/payments/single/${paymentId}`,
    });

    if (res.data.status === 'success') {
      localStorage.clear();
      localStorage.setItem('paymentData', JSON.stringify(res.data.data));
      showAlert('success', 'we are going in seconds...');
      window.setTimeout(() => {
        location.assign(`/viewPayment`);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

//   5) Delete Payment

export const deletePayment = async (paymentId) => {
  showModal();
  const cancelModalButton = document.getElementById('cancelModalButton');
  const confirmModalButton = document.getElementById('confirmModalButton');

  // for cancling
  cancelModalButton.addEventListener('click', () => {
    document.getElementById('confirmationModal').style.display = 'none';
  });

  // for confirm deleting
  confirmModalButton.addEventListener('click', async () => {
    document.getElementById('confirmationModal').style.display = 'none';
    try {
      // delete/63e7bc517e0b696d41bbb468
      const res = await axios({
        method: 'DELETE',
        url: `http://127.0.0.1:3000/api/v1/payments/delete/${paymentId}`,
      });

      localStorage.clear();
      showAlert('success', 'Payment Deleted Successfully');
      location.reload(true);
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  });
};

//   6) Print Payment by ID;

export const printPayment = async (paymentId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/payments/single/${paymentId}`,
    });

    if (res.data.status === 'success') {
      localStorage.clear();
      localStorage.setItem('paymentData', JSON.stringify(res.data.data));
      // console.log(res.data.data)
      showAlert('success', 'we are going in seconds...');
      window.setTimeout(() => {
        location.assign(`/printPayment`);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    // console.log(err)
  }
};

//   7) Render View Payment Page from All Payment Page

export const renderViewPage = () => {
  const viewPaymentForm = document.querySelector('.form__payment--view');
  const paymentData = JSON.parse(localStorage.getItem('paymentData'));
  const payments = paymentData.data.payment;
  const markup = `
          <div class="payment--header" data-paymentid="${paymentData.data._id}">
              <div class="payment--content">
                <label for="branch" class="mb-0 m-3 form-label text-wrap"
                  >Branch*</label
                >
                <input type="texy" id="branch"  value="${
                  paymentData.data.branch.name
                }" readonly class="form-control m-3" />
              </div>
              <div class="payment--content">
                <label for="date" class="mb-0 m-3 form-label text-wrap"
                  >From:</label
                >
                <input type="date" value="${
                  paymentData.data.date.split('T')[0]
                }" id="date" class="form-control m-3" />
              </div>
            </div>
            <div class="payment--body">
              <div class="payment--content payment--content__header">
                <label class="mb-0 m-3 form-label text-wrap">SL No*</label>
                <label class="mb-0 m-3 form-label text-wrap"
                  >Ledger Name*</label
                >
                <label class="mb-0 m-3 form-label text-wrap">Narrations*</label>
                <label class="mb-0 m-3 form-label text-wrap">Amount*</label>
              </div>
              <div class="data">
                ${payments.map((el, i) => {
                  return `<div class="payment--content payment--content__body">
                  <label for="" class="mb-0 m-3 form-label text-wrap">${
                    i + 1
                  }</label>
                  <label
                    style="width: 32%"
                    id="ledgerName"
                    class="form-control m-3"
                    data-ledgerid="${el.ledgerName._id}"
                  >
                  ${el.ledgerName.name}
                  </label>
                  <input
                    style="width: 32%"
                    type="text"
                    id="purpose"
                    class="form-control m-3"
                    required
                    value="${el.purpose}"
                    placeholder="put some comments"
                  />
                  <input
                    style="width: 32%"
                    type="number"
                    id="amount"
                    value="${el.amount}"
                    class="form-control m-3"
                    required
                    placeholder="Amount"
                  />
                  <button class="m-3 btn btn-danger btn-sm" id="view--payment__delete">Delete</button>
                </div>
                `;
                })}
              </div>
              <div class="summery--amount"> <label class="amount">
                   <label class="amount mb-0 m-3 from-label text-wrap"></label>
              </div>
            </div>
            <button class="mb-3 mt-3 btn btn-primary btn-sm" id="add--more__ledger">Add</button>
            <button class="mb-3 mt-3 btn btn-danger btn-sm" id="remove--last__ledger">Remove</button>
            <button class="mb-3 mt-3 btn btn-info btn-sm" id="add--payment__submit">Update</button>
  `;

  viewPaymentForm.insertAdjacentHTML('beforeend', markup);

  // i) Auto Summation of total Amount

  sendSumAmount();
};

//   8) Delete Rennderd View Page Delete Button for Deleting unfortunate data
export const deleteRenderViewPageEl = () => {
  const btndeletePreviousItem = document.querySelectorAll(
    '#view--payment__delete'
  );

  btndeletePreviousItem.forEach((el) =>
    el.addEventListener('click', function (e) {
      e.preventDefault();
      e.target.parentElement.remove();
      sendSumAmount();
    })
  );
};

//  9) Save and Update data to Database using Axios request
export const saveNewPaymentOrUpdate = async (type) => {
  const btnSave = document.querySelector('#add--payment__submit');

  btnSave.addEventListener('click', async function (e) {
    e.preventDefault();
    // dom element storing

    const date = document.querySelector('#date').value;
    const branch =
      type === 'new' ? document.querySelector('#branch').value : null;
    const ledgerName = document.querySelectorAll('#ledgerName');
    const purpose = document.querySelectorAll('#purpose');
    const amount = document.querySelectorAll('#amount');
    const payment = [];

    const url =
      type === 'new'
        ? 'http://127.0.0.1:3000/api/v1/payments/newOne'
        : type === 'update'
        ? 'http://127.0.0.1:3000/api/v1/payments/updatePayment'
        : null;

    const method = type === 'new' ? 'POST' : 'PATCH';
    // console.log(method);

    const id =
      type === 'update'
        ? document.querySelector('.payment--header').dataset.paymentid
        : null;

    //// Get a subtotal
    sendSumAmount();

    // Menipulating ledgerName

    for (let i = 0; i < ledgerName.length; i++) {
      payment.push({
        // if(ledgerName.nodeName==="LABEL")
        ledgerName:
          ledgerName[i].nodeName === 'LABEL'
            ? ledgerName[i].dataset.ledgerid
            : ledgerName[i].value,
        purpose: purpose[i].value,
        amount: amount[i].value * 1,
      });
    }

    const summeryAmount = payment.reduce((acc, el) => acc + el.amount, 0);
    const data =
      type === 'new'
        ? { branch, payment, date }
        : { branch, id, payment, date, summeryAmount };

    //// Calling axiot api request for saveing new data
    try {
      const res = await axios({
        method,
        url,
        data,
      });

      if (res.data.status === 'success') {
        showAlert(
          'success',
          `Payment ${type === 'new' ? 'Saved' : 'updated'} successfully`
        );
        window.setTimeout(() => {
          location.assign('/searchPayment');
        }, 2000);
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  });
};

//  10) Print Payment

export const renderPrint = (printPaymentFrom) => {
  const paymentData = JSON.parse(localStorage.getItem('paymentData'));

  const markup = `
    <div class="row align-content-center print--title">
      <div class="col-12 d-flex justify-content-center">
          <h2 class="h2 heading mt-4">Alif Enterprise</h2>
        </div>
      </div>
      <div class="row align-content-center print--address">
        <h4 class="sub-heading col-12 d-flex justify-content-center h6">
          Modina Market(Third and Forth Floor), Muradpur, Chittagong.
        </h4>
      </div>
      <div class="row align-content-center print--branch">
        <p class="col-12 d-flex justify-content-center h4">${
          paymentData.data.branch.name
        }</p>
        <p class="col-12 d-flex justify-content-center h6">${
          paymentData.data.branch.address === undefined
            ? ''
            : paymentData.data.branch.address
        }</p>
      </div>
      <div class="row align-content-center print--header">
        <h3 class="col-12 d-flex justify-content-center h3 print--type">
          Payment Slip
        </h3>
      </div>
      <div class="row mt-2 align-content-center print--voucher">
        <div class="col-8 align-content-center">
          <p>Voucher No: ${paymentData.data._id}</p>
        </div>
        <div class="col align-content-center">
          <p>Date:<span class="v--date">${
            paymentData.data.date.split('T')[0]
          }</span></p>
        </div>
      </div>
      <div class="row">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">SL No</th>
              <th scope="col">Ledger</th>
              <th scope="col">Narrations</th>
              <th scope="col">Debit</th>
              <th scope="col">Credit</th>
            </tr>
          </thead>
          <tbody>
            ${paymentData.data.payment.map((el, i) => {
              return `
                <tr>
                  <th scope="row">${i + 1}</th>
                  <td>${el.ledgerName.name}</td>
                  <td>${el.purpose}</td>
                  <td>${el.amount}</td>
                  <td>00.00</td>
                </tr>
              `;
            })}
            <tr>
              <th scope="row"></th>
              <td></td>
              <th>Total=</th>
              <th>${paymentData.data.summeryAmount.toFixed(2)}</th>
              <th>${paymentData.data.summeryAmount.toFixed(2)}</th>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="row mt-5 align-content-center print--footer">
        <div class="col-3 d-flex justify-content-start">
          <label class="h6"> &nbsp;&nbsp;&nbsp;&nbsp;Prepared By&nbsp;&nbsp;&nbsp;&nbsp; </label>
        </div>
        <div class="col-3 d-flex justify-content-start">
          <label class="h6">&nbsp;&nbsp;&nbsp;&nbsp;Checked By&nbsp;&nbsp;&nbsp;&nbsp;</label>
        </div>
        <div class="col-3 d-flex justify-content-start">
          <label class="h6">&nbsp;&nbsp;&nbsp;&nbsp;Approved By&nbsp;&nbsp;&nbsp;&nbsp;</label>
        </div>
      </div>
    </div>
  `;

  printPaymentFrom.insertAdjacentHTML('afterbegin', markup);
};

/* 
<div class="col-1 d-flex justify-content-start">
          <label class="h6" for="Serial--no">SL No</label>
        </div>
        <div class="col-2 d-flex justify-content-start">
          <label class="h6" for="ledgerName">Ledgers</label>
        </div>
        <div class="col-4 d-flex justify-content-start">
          <label class="h6" for="purpose">Narrations</label>
        </div>
        <div class="col-2 d-flex justify-content-start">
          <label class="h6" for="amount">Debit</label>
        </div>
        <div class="col d-flex justify-content-start">
          <label class="h6" for="amount">Credit</label>
        </div>
**/
