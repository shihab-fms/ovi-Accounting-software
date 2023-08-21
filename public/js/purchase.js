import axios from 'axios';
import { showAlert, showModal } from './alert';

const data_DB = async (typeURL) => {
  try {
    const res = await axios({
      url: `http://127.0.0.1:3000/api/v1/${typeURL}`,
    });
    return res.data;
  } catch (err) {
    throw err.response.data.message;
  }
};

const autoSum = () => {
  const amounts = document.querySelectorAll('#amount');
  const summeryamount = document.querySelector('.amount');
  summeryamount.textContent = ' ';
  let sum = 0;
  amounts.forEach((el) => (sum = sum + el.value * 1));
  summeryamount.textContent = `Tk. ${sum.toFixed(2)}`;
};

export const autoMultiply = (btnquantity, btnrate) => {
  btnquantity.forEach((el) => {
    el.addEventListener('input', function () {
      const rate = this.parentElement.querySelector('#rate').value;
      const quantity = this.value;
      this.parentElement.querySelector('#amount').value = quantity * rate * 1;
    });
  });

  btnrate.forEach((el) => {
    el.addEventListener('input', function () {
      const quantity = this.parentElement.querySelector('#quantity').value;
      const rate = this.value;
      this.parentElement.querySelector('#amount').value = quantity * rate * 1;
    });
  });
};

export const addNewItemEl = async () => {
  try {
    const body = document.querySelector('.data');
    autoSum();

    const items = await data_DB('items/all');
    const units = await data_DB('units/all');
    if (items.status === 'success' && items.status === 'success') {
      let i = document.querySelectorAll('.sl');
      // console.log(i[i.length-1].textContent);
      const markup = `
        <div class="purchase--content purchase--content__body">
          <label class="mb-0 m-1 mb-3 sl form-label text-wrap" for="">${
            i[i.length - 1].textContent * 1 + 1
          }</label>
          <select
            class="form-select form-control m-1 mb-3"
            id="itemName"
            style="width: 20%"
            name="ledgerName"
            required=""
          >
            <option selected="">Select Item</option>
            ${items.data.data.map(
              (el) => `<option value="${el._id}">${el.name}</option>`
            )}.join()
            
          </select>
          <select
            class="form-select form-control m-1 mb-3"
            id="unitName"
            style="width: 15%"
            name="ledgerName"
            required=""
          >
            <option selected="">Select Unit</option>
            ${units.data.data.map(
              (el) => `<option value="${el._id}">${el.name}</option>`
            )}.join()
          </select>      
          <input
              class="form-control m-1 mb-3"
              id="narration"
              style="width: 28%"
              type="text"
              required=""
              placeholder="Comments"
            /><input
              class="form-control m-1 mb-3"
              id="quantity"
              style="width: 10%"
              type="number"
              required=""
              placeholder="Quantity"
            /><input
              class="form-control m-1 mb-3"
              id="rate"
              style="width: 10%"
              type="number"
              required=""
              placeholder="Rate"
            /><input
              class="ledger__amount form-control m-1 mb-3"
              id="amount"
              style="width: 15%"
              type="number"
              required=""
              placeholder="Amount"
            />
        </div>
    `;

      body.insertAdjacentHTML('beforeend', markup);
      const quantity = document.querySelectorAll('#quantity');
      const rate = document.querySelectorAll('#rate');
      autoMultiply(quantity, rate);
    }
    // console.log(items.data, units.data);
  } catch (err) {
    console.log(err);
  }
};

export const removeLastEl = () => {
  const body = document.querySelector('.data');
  if (body.childElementCount > 1) {
    body.lastChild.remove();
    autoSum();
  } else {
    showAlert('error', 'Already you in last entry');
  }
};

export const saveOrUpdate = async (type) => {
  try {
    autoSum();
    const id =
      type === 'update'
        ? document.querySelector('.purchase--header').dataset.purchaseid
        : ' ';
    const method = type === 'new' ? 'POST' : 'PATCH';
    const url =
      type === 'new'
        ? `http://127.0.0.1:3000/api/v1/purchases/newOne`
        : `http://127.0.0.1:3000/api/v1/purchases/update/${id}`;

    const branch = document.querySelector('#branch').value;
    const ladgerName = document.querySelector('#ledger').value;
    const date = document.querySelector('#date').value;
    const items = [];
    const itemName = document.querySelectorAll('#itemName');
    const unitName = document.querySelectorAll('#unitName');
    const narration = document.querySelectorAll('#narration');
    const quantity = document.querySelectorAll('#quantity');
    const rate = document.querySelectorAll('#rate');
    // const amount = document.querySelectorAll('#amount');
    console.log(branch, ladgerName);

    for (let i = 0; i < itemName.length; i++) {
      items.push({
        itemName: itemName[i].value,
        unit: unitName[i].value,
        narration: narration[i].value,
        quantity: quantity[i].value,
        rate: rate[i].value,
      });
    }

    const data = {
      branch,
      ladgerName,
      date,
      items,
    };

    const res = await axios({
      method,
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type} purchase successful`);
      window.setTimeout(() => {
        location.assign('/searchPurchase');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

export const setViewPageData = async (purchaseId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/purchases/single/${purchaseId}`,
    });

    if (res.data.status === 'success') {
      localStorage.clear();
      localStorage.setItem('purchaseData', JSON.stringify(res.data.data));
      showAlert('success', 'we are going in seconds...');
      window.setTimeout(() => {
        location.assign(`/viewPurchase`);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deletePurchase = async (purchaseId) => {
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
        url: `http://127.0.0.1:3000/api/v1/purchases/delete/${purchaseId}`,
      });

      localStorage.clear();
      showAlert('success', 'Purchase Deleted Successfully');
      location.reload(true);
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  });
};

export const printPurchase = async (purchaseId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/purchases/single/${purchaseId}`,
    });

    if (res.data.status === 'success') {
      localStorage.clear();
      localStorage.setItem('purchaseData', JSON.stringify(res.data.data));
      // console.log(res.data.data)
      showAlert('success', 'we are going in seconds...');
      window.setTimeout(() => {
        location.assign(`/printPurchase`);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    // console.log(err)
  }
};

export const renderViewPage = () => {
  const viewPurchaseForm = document.querySelector('.form__purchase--view');
  const purchaseData = JSON.parse(localStorage.getItem('purchaseData'));
  const purchases = purchaseData.data.items;
  console.log(purchases);
  const markup = `
    <div class="purchase--header" data-purchaseid="${purchaseData.data._id}">
      <div class="purchase--content">
        <label class="mb-0 m-3 form-label text-wrap" for="date">Date:</label>
        <input class="form-control m-3" value="${
          purchaseData.data.date.split('T')[0]
        }" id="date" type="date" required="" />
      </div>
      <div class="purchase--content">
        <label class="mb-0 m-3 form-label text-wrap" for="branch">Branch*</label
        ><select class="form-select form-control m-3" id="branch" name="branch">
          <option value="${purchaseData.data.branch._id}" selected="">${
    purchaseData.data.branch.name
  }</option>
        </select>
      </div>
      <div class="purchase--content">
        <label class="mb-0 m-3 form-label text-wrap" for="ledger">ledger*</label
        ><select class="form-select form-control m-3" id="ledger" name="ledger">
          <option value="${purchaseData.data.ladgerName._id}" selected="">${
    purchaseData.data.ladgerName.name
  }</option>
        </select>
      </div>
    </div>
     <div class="purchase--body">
      <div class="purchase--content purchase--content__header">
        <label class="mb-0 m-1 form-label text-wrap">SL No* </label
        ><label class="mb-0 m-1 form-label text-wrap">Item Name*</label
        ><label class="mb-0 m-1 form-label text-wrap">Unit*</label
        ><label class="mb-0 m-1 form-label text-wrap">Narration*</label
        ><label class="mb-0 m-1 form-label text-wrap">Quantity*</label
        ><label class="mb-0 m-1 form-label text-wrap">Rate* </label
        ><label class="mb-0 m-1 form-label text-wrap">Total*</label>
      </div>
    </div>
    <div class="data">

    ${purchases
      .map((el, i) => {
        return `
          <div class="purchase--content purchase--content__body">
            <label class="mb-0 m-1 mb-3 sl form-label text-wrap" for="">${
              i + 1
            }</label>
            <select
              class="form-select form-control m-1 mb-3"
              id="itemName"
              style="width: 20%"
              name="itemName"
              required=""
            >
              <option value="${el.itemName._id}" selected="">${
          el.itemName.name
        }</option>
            </select>
            <select
              class="form-select form-control m-1 mb-3"
              id="unitName"
              style="width: 20%"
              name="unitName"
              required=""
            >
              <option value="${el.unit._id}" selected="">${
          el.unit.name
        }</option>
            </select>
            <input
              class="form-control m-1 mb-3"
              id="narration"
              style="width: 28%"
              type="text"
              required=""
              placeholder="Comments"
              value="${el.narration}"
            /><input
              class="form-control m-1 mb-3"
              id="quantity"
              style="width: 10%"
              type="number"
              required=""
              placeholder="Quantity"
              value="${el.quantity}"
            /><input
              class="form-control m-1 mb-3"
              id="rate"
              style="width: 10%"
              type="number"
              required=""
              placeholder="Rate"
              value="${el.rate}"
            /><input
              class="ledger__amount form-control m-1 mb-3"
              id="amount"
              style="width: 15%"
              type="number"
              required=""
              placeholder="Amount"
              value="${el.total}"
            />
          </div>
        `;
      })
      .join(' ')}
      
    </div>
    <div class="summery--amount">
      <label class="amount mb-0 m-3 from-label text-wrap">Tk. 00000.00</label>
    </div>
    <button class="m-3 btn btn-primary" id="add--more__item">Add</button>
    <button class="m-3 btn btn-danger" id="remove--last__item">Remove</button>
    <button class="m-3 btn btn-info" id="add--purchase__submit">Update</button>
  `;

  viewPurchaseForm.insertAdjacentHTML('beforeend', markup);

  // i) Auto Summation of total Amount

  autoSum();
};

export const renderPrint = (printPurchaseFrom) => {
  const purchaseData = JSON.parse(localStorage.getItem('purchaseData'));
  // console.log(purchaseData);
  const markup = `
    <div class="row align-content-center print--title">
      <div class="col-12 d-flex justify-content-center">
          <h2 class="h2 mt-4">Alif Enterprise</h2>
        </div>
      </div>
      <div class="row align-content-center print--address">
        <h4 class="col-12 d-flex justify-content-center h6">
          Modina Market(Third and Forth Floor), Muradpur, Chittagong.
        </h4>
      </div>
      <div class="row align-content-center print--branch">
        <p class="col-12 d-flex justify-content-center h6">${
          purchaseData.data.branch.name
        }</p>
        <p class="col-12 d-flex justify-content-center h6">${
          purchaseData.data.branch.address === undefined
            ? ''
            : purchaseData.data.branch.address
        }</p>
      </div>
      <div class="row align-content-center print--ladgerName">
        <p class="col-12 d-flex justify-content-center h4">${
          purchaseData.data.ladgerName.name
        }</p>
      </div>
      <div class="row align-content-center print--header">
        <h3 class="col-12 d-flex justify-content-center h3 print--type">
          Purchase Slip
        </h3>
      </div>
      <div class="row mt-2 align-content-center print--voucher">
        <div class="col d-flex justify-content-around">
          <p class="v--no">Voucher No:${purchaseData.data._id}</p>
        </div>
        <div class="col d-flex justify-content-around">
          <p>Date:<span class="v--date">${
            purchaseData.data.date.split('T')[0]
            
          }</span></p>
        </div>
      </div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">SL No</th>
              <th scope="col">Item</th>
              <th scope="col">Narrations</th>
              <th scope="col">Unit</th>
              <th scope="col">Quantity</th>
              <th scope="col">Rate</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            ${purchaseData.data.items
              .map((el, i) => {
                return `
                    <tr>
                      <th scope="row">${i + 1}</th>
                      <td>${el.itemName.name}</td>
                      <td>${el.narration}</td>
                      <td>${el.unit.name}</td>
                      <td>${el.quantity.toFixed(2)}</td>
                      <td>${el.rate.toFixed(2)}</td>
                      <td>${el.total.toFixed(2)}</td>
                    </tr>
                  `;
              })
              .join(' ')}

              <tr>
                <th scope="row"></th>
                <th scope="row"></th>
                <th scope="row"></th>
                <th scope="row"></th>
                <th scope="row"></th>
                <th scope="row">Total</th>
                <th scope="row">${purchaseData.data.summeryAmount.toFixed(
                  2
                )}</th>
              </tr>

          </tbody>
        </table>
      <div class="row mt-5 align-content-center print--footer">
        <div class="col-3 d-flex justify-content-start">
          <label> &nbsp;&nbsp;&nbsp;&nbsp;Prepared By&nbsp;&nbsp;&nbsp;&nbsp; </label>
        </div>
        <div class="col-3 d-flex justify-content-start">
          <label>&nbsp;&nbsp;&nbsp;&nbsp;Checked By&nbsp;&nbsp;&nbsp;&nbsp;</label>
        </div>
        <div class="col-3 d-flex justify-content-start">
          <label>&nbsp;&nbsp;&nbsp;&nbsp;Approved By&nbsp;&nbsp;&nbsp;&nbsp;</label>
        </div>
      </div>
    </div>
  `;

  printPurchaseFrom.insertAdjacentHTML('afterbegin', markup);
};
