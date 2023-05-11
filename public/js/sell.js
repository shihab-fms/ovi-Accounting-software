import axios from 'axios';
import { showAlert, showModal, autoMultiply } from './alart';

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

//   2) Add button for inputing new product sell Element

export const addsellproductEement = () => {
  const btnAdd = document.querySelector('#add--more__product');
  const parentEl = document.querySelector('.data');

  if (btnAdd)
    btnAdd.addEventListener('click', function (e) {
      e.preventDefault();
      sendSumAmount();

      axios({
        method: 'GET',
        url: 'http://127.0.0.1:5000/api/v1/product/getall',
      })
        .then((res) => {
          const products = res.data.data.data;

          const markup = `
                <div class="sell--content sell--content__body">
                  <label for="" class="mb-0 m-3 form-label text-wrap">1</label>
                  <select
                    style="width: 25%"
                    class="form-select form-control m-3"
                    name="productName"
                    id="productName"
                    required
                  >
                    <option selected>Select a product name</option>
                    ${products.map(
                      (el) => `<option value=${el._id}>
                      ${el.name}
                    </option>`
                    )}
                  </select>
                  <input
                    style="width: 23%"
                    type="text"
                    id="quantity"
                    class="form-control m-3"
                    required
                    placeholder="product quantity"
                  />
                  <input
                    style="width: 23%"
                    type="text"
                    id="price"
                    class="form-control m-3"
                    required
                    placeholder="product price"
                  />
                  <input
                    style="width: 23%"
                    type="number"
                    id="amount"
                    class="form-control m-3"
                    required
                    placeholder="Amount"
                  />
                </div>
        `;

          parentEl.insertAdjacentHTML('beforeend', markup);

          const btnprice = document.querySelectorAll('#price');
          const btnquantity = document.querySelectorAll('#quantity');
          autoMultiply(btnprice, btnquantity);
        })
        .catch((err) => showAlert('error', err.response.data.message));
    });
};

//   3) Removeing last sell items
export const removesellproductElement = () => {
  const btnRemove = document.querySelector('#remove--last__product');
  const sellBodyEl = document.querySelector('.data');
  if (btnRemove)
    btnRemove.addEventListener('click', function (e) {
      e.preventDefault();
      sellBodyEl.lastChild.remove();
      sendSumAmount();
      const btnprice = document.querySelectorAll('#price');
      const btnquantity = document.querySelectorAll('#quantity');
      autoMultiply(btnprice, btnquantity);
    });
};

//   4) Search sell and Send sell to View page and render it
export const searchedsellToView = async (sellId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:5000/api/v1/sell/getOne/${sellId}`,
    });

    if (res.data.status === 'success') {
      localStorage.clear();
      localStorage.setItem('sellData', JSON.stringify(res.data.data));
      showAlert('success', 'we are going in seconds...');
      window.setTimeout(() => {
        location.assign(`/editSell`);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

//   5) Delete sell

export const deletesell = async (sellId) => {
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
        url: `http://127.0.0.1:5000/api/v1/sell/deleteOne/${sellId}`,
      });

      localStorage.clear();
      showAlert('success', 'sell Deleted Successfully');
      location.reload(true);
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  });
};

//   6) Print sell by ID;

export const printsell = async (sellId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:5000/api/v1/sell/getOne/${sellId}`,
    });

    if (res.data.status === 'success') {
      localStorage.clear();
      localStorage.setItem('sellData', JSON.stringify(res.data.data));
      // console.log(res.data.data)
      showAlert('success', 'we are going in seconds...');
      window.setTimeout(() => {
        location.assign(`/printSell`);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    // console.log(err)
  }
};

//   7) Render View sell Page from All sell Page

export const renderViewPage = () => {
  const viewsellForm = document.querySelector('.form__sell--view');
  const sellData = JSON.parse(localStorage.getItem('sellData'));
  const sells = sellData.data.sells;
  const markup = `
          <div class="sell--header" data-sellid="${sellData.data._id}">
              <div class="sell--content">
                <label for="date" class="mb-0 m-3 form-label text-wrap"
                  >From:</label
                >
                <input type="date" value="${
                  sellData.data.date.split('T')[0]
                }" id="date" class="form-control m-3" />
              </div>
            </div>
            <div class="sell--body">
              <div class="sell--content sell--content__header">
                <label class="mb-0 m-3 form-label text-wrap">SL No*</label>
                <label class="mb-0 m-3 form-label text-wrap"
                  >product Name*</label
                >
                <label class="mb-0 m-3 form-label text-wrap">Quantity*</label>
                <label class="mb-0 m-3 form-label text-wrap">Price*</label>
                <label class="mb-0 m-3 form-label text-wrap">Amount*</label>
              </div>
              <div class="data">
                ${sells
                  .map((el, i) => {
                    return `<div class="sell--content sell--content__body">
                  <label for="" class="mb-0 m-3 form-label text-wrap">${
                    i + 1
                  }</label>
                  <label
                    style="width: 25%"
                    id="productName"
                    class="form-control m-3"
                    data-productid="${el.name._id}"
                  >
                  ${el.name.name}
                  </label>
                  <input
                    style="width: 23%"
                    type="text"
                    id="quantity"
                    class="form-control m-3"
                    required
                    value="${el.quantity}"
                    placeholder="product quantity"
                  />
                  <input
                    style="width: 23%"
                    type="text"
                    id="price"
                    class="form-control m-3"
                    required
                    value="${el.rate}"
                    placeholder="product price"
                  />
                  <input
                    style="width: 23%"
                    type="number"
                    id="amount"
                    value="${el.totalAmount}"
                    class="form-control m-3"
                    required
                    placeholder="Amount"
                  />
                  <button class="m-3 btn btn-danger" id="view--sell__delete">Delete</button>
                </div>
                `;
                  })
                  .join(' ')}
              </div>
              <div class="summery--amount"> <label class="amount">
                   <label class="amount mb-0 m-3 from-label text-wrap"></label>
              </div>
            </div>
            <button class="mb-3 mt-3 btn btn-primary" id="add--more__product">Add</button>
            <button class="mb-3 mt-3 btn btn-danger" id="remove--last__product">Remove</button>
            <button class="mb-3 mt-3 btn btn-info" id="add--sell__submit">Update</button>
  `;

  viewsellForm.insertAdjacentHTML('beforeend', markup);

  // i) Auto Summation of total Amount

  sendSumAmount();
};

//   8) Delete Rennderd View Page Delete Button for Deleting unfortunate data
export const deleteRenderViewPageEl = () => {
  const btndeletePreviousItem = document.querySelectorAll(
    '#view--sell__delete'
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
export const saveNewsellOrUpdate = async (type) => {
  const btnSave = document.querySelector('#add--sell__submit');

  if (btnSave)
    btnSave.addEventListener('click', async function (e) {
      e.preventDefault();
      // dom element storing

      const date = document.querySelector('#date').value
        ? document.querySelector('#date').value
        : new Date(Date.now());
      const productName = document.querySelectorAll('#productName');
      const quantity = document.querySelectorAll('#quantity');
      const price = document.querySelectorAll('#price');
      const amount = document.querySelectorAll('#amount');
      const id =
        type === 'update'
          ? document.querySelector('.sell--header').dataset.sellid
          : null;
      const sells = [];

      const url =
        type === 'new'
          ? 'http://127.0.0.1:5000/api/v1/sell/createOne'
          : type === 'update'
          ? `http://127.0.0.1:5000/api/v1/sell/updateOne/${id}`
          : null;

      const method = type === 'new' ? 'POST' : 'PATCH';
      // console.log(method);

      //// Get a subtotal
      sendSumAmount();

      // Menipulating productName

      for (let i = 0; i < productName.length; i++) {
        sells.push({
          // if(productName.nodeName==="LABEL")
          name:
            productName[i].nodeName === 'LABEL'
              ? productName[i].dataset.productid
              : productName[i].value,
          quantity: quantity[i].value * 1,
          rate: price[i].value * 1,
          // totalAmount: amount[i].value * 1,
        });
      }

      // console.log(sells)

      // const summeryAmount = sell.reduce((acc, el) => acc + el.amount * 1, 0);
      const data = type === 'new' ? { sells, date } : { id, sells, date };

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
            `sell ${type === 'new' ? 'Saved' : 'updated'} successfully`
          );
          window.setTimeout(() => {
            location.assign('/searchSell');
          }, 2000);
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
        // console.log(err);
      }
    });
};

//  10) Print sell

export const renderPrint = (printsellFrom) => {
  const sellData = JSON.parse(localStorage.getItem('sellData'));

  const markup = `
    <div class="row align-content-center print--title">
      <div class="col-12 d-flex justify-content-center">
          <h2 class="h2 mt-4">Ovi Shop</h2>
        </div>
      </div>
      <div class="row align-content-center print--address">
        <h4 class="col-12 d-flex justify-content-center h6">
          Modina Market(Third and Forth Floor), Muradpur, Chittagong.
        </h4>
      </div>
      <div class="row align-content-center print--header">
        <h3 class="col-12 d-flex justify-content-center h3 print--type">
          sell Slip
        </h3>
      </div>
      <div class="row mt-2 align-content-center print--voucher">
        <div class="col-2 d-flex justify-content-around">
          <p>Voucher No:</p>
        </div>
        <div class="col-4 d-flex justify-content-around">
          <p class="v--no">${sellData.data._id}</p>
        </div>
        <div class="col-3 d-flex justify-content-around"></div>
        <div class="col-3 d-flex justify-content-around">
          <p>Date:<span class="v--date">${
            sellData.data.date.split('T')[0]
          }</span></p>
        </div>
      </div>
      <div class="row align-content-center print--content--header">
        <div class="col-1 d-flex justify-content-start">
          <label for="Serial--no">SL No</label>
        </div>
        <div class="col-2 d-flex justify-content-start">
          <label for="productName">products</label>
        </div>
        <div class="col-4 d-flex justify-content-start">
          <label for="purpose">Quantity</label>
        </div>
        <div class="col-2 d-flex justify-content-start">
          <label for="price">Price</label>
        </div>
        <div class="col d-flex justify-content-start">
          <label for="amount">Amount</label>
        </div>
      </div>
      ${sellData.data.sells
        .map((el, i) => {
          return `
          <div class="row align-content-center print--content--body">
            <div class="col-1 d-flex justify-content-start">
              <label class="Serial--no">${i + 1}</label>
            </div>
            <div class="col-2 d-flex justify-content-start">
              <label class="productName">${el.name.name}</label>
            </div>
            <div class="col-4 d-flex justify-content-start">
              <label class="quantity">${el.quantity}</label>
            </div>
            <div class="col-2 d-flex justify-content-start">
              <label class="price">${el.rate.toFixed(2)}</label>
            </div>
            <div class="col d-flex justify-content-start">
              <label class="amount">${el.totalAmount.toFixed(2)}</label>
            </div>
          </div>`;
        })
        .join('')}
      <div class="row align-content-center print--content--total">
        <!-- <div class="col-1 d-flex justify-content-start"><label class="Serial--no">1</label></div> -->
        <div class="col-1 d-flex justify-content-start"></div>
        <div class="col-2 d-flex justify-content-start"></div>
        <div class="col-4 d-flex justify-content-start">
          <label></label>
        </div>
        <div class="col-2 d-flex justify-content-start">
          <label class="total">Total</label>
        </div>
        <div class="col d-flex justify-content-start">
          <label class="total-amount">${sellData.data.summeryAmount.toFixed(
            2
          )}</label>
        </div>
      </div>

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

  printsellFrom.insertAdjacentHTML('afterbegin', markup);
};
