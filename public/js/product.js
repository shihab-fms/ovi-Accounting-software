import axios from 'axios';
import { showAlert, showModal } from './alart';

export const addProductToDB = async (types) => {
  try {
    const name = document.querySelector('#productname').value;
    const typeOf = [document.querySelector('#type').value];

    const id =
      types === 'update'
        ? document.querySelector('.productId').dataset.productid
        : '';

    const method = types === 'new' ? 'POST' : 'PATCH';

    const url =
      types === 'new'
        ? 'http://127.0.0.1:5000/api/v1/product/createOne'
        : `http://127.0.0.1:5000/api/v1/product/updateOne/${id}`;

    const res = await axios({
      method,
      url,
      data: {
        name,
        typeOf,
      },
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        showAlert('success', `${types} product added successfully...`);
        location.assign('/allProduct');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const editProduct = async (id) => {
  try {
    const res = await axios({
      url: `http://127.0.0.1:5000/api/v1/product/getone/${id}`,
      method: 'GET',
    });

    const resType = await axios({
      url: 'http://127.0.0.1:5000/api/v1/typeof/getAll',
      method: 'GET',
    });

    console.log(res.data.status);
    if (res.data.status === 'success') {
      localStorage.clear();
      localStorage.setItem('typeOfData', JSON.stringify(resType.data.data));
      localStorage.setItem('productData', JSON.stringify(res.data.data));

      showAlert('success', `Going for edit Product`);
      window.setTimeout(() => {
        location.assign('/editProduct');
      });
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const renderEditPage = (editproductForm) => {
  const productData = JSON.parse(localStorage.getItem('productData'));
  const typeOfData = JSON.parse(localStorage.getItem('typeOfData'));

  const markup = `
         <form
            action=""
            class="form form__edit--product form-group m-3 px-3 mt-5 b-2 border border-danger"
          >
            <h2 class="text-center form-text">
              Updating Party*: you must need a Name*, Type* of Party and others info.
            </h2>
            <div class="product--info">
              <label for="productname" data-productid="${
                productData.data._id
              }" class="mb-0 m-1 form-label productId text-wrap"
                >Name of Product*:</label
              >
              <input type="text" value="${
                productData.data.name
              }" required id="productname" class="form-control m-1" />

              <label for="type" class="mb-0 m-1 form-label text-wrap"
                >Type of Product*:</label
              >
              <select class="form-select form-control m-1" required id="type">
                <option value="${productData.data.typeOf[0]._id}" selected>${
    productData.data.typeOf[0].slug
  }</option>
                ${typeOfData.data.map(
                  (el) => `<option value="${el._id}">${el.name}</option>`
                )}
                
              </select>
            <button class="m-3 btn btn-update btn-info">Update</button>
          </form> 
  `;

  editproductForm.insertAdjacentHTML('afterbegin', markup);
};

export const searchproduct = async (id) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:5000/api/v1/product/getone/${id}`,
    });
    if (res.data.status === 'success') {
      localStorage.clear();
      localStorage.setItem('productData', JSON.stringify(res.data.data));
      showAlert('success', 'Searching for product');
      window.setTimeout(() => {
        location.assign('/searchproduct');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteproduct = async (id) => {
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
      const res = await axios({
        method: 'DELETE',
        url: `http://127.0.0.1:5000/api/v1/product/deleteOne/${id}`,
      });

      showAlert('success', 'Data deleted successfully');
      window.setTimeout(() => {
        location.assign('/allproduct');
      });
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  });
};

export const renderSearchproduct = async () => {
  const productData = JSON.parse(localStorage.getItem('productData'));
  console.log(productData);
  if (!productData) {
    showAlert('error', 'product not found! Going back to provious page');
    return window.setTimeout(() => {
      location.assign('/allproduct');
    }, 1500);
  }
  const product = productData.data._id;
  const to = document.querySelector('#to').value;
  const from = document.querySelector('#from').value;
  const reqData = {
    to,
    from,
    product: productData.data.name,
  };

  //  http://127.0.0.1:3000/api/v1/payments/productinfo
  // req.body.branch, req.body.product, req.body.from, req.body.to;
  try {
    const res = await axios({
      url: 'http://127.0.0.1:5000/api/v1/product/productInfo',
      method: 'POST',
      data: {
        product,
        from,
        to,
      },
    });

    // console.log(res.data);
    if (res.data.status === 'success') {
      localStorage.clear();
      localStorage.setItem('productDatas', JSON.stringify(res.data.data));
      localStorage.setItem('reqData', JSON.stringify(reqData));
      showAlert('success', 'Print data in seconds...');
      window.setTimeout(() => {
        location.assign('/printproduct');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
  }
};

export const renderPrint = (printsellFrom) => {
  const productData = JSON.parse(localStorage.getItem('productDatas'));
  const product = JSON.parse(localStorage.getItem('reqData'));

  const markup = `
    <div class="container-fluid">
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
      <div class="row align-content-center print--branch">
        <p class="col-12 d-flex justify-content-center h5">Presenting summery of ${
          product.product
        }</p>
      </div>
      <div class="row align-content-center print--header">
        <h3 class="col-12 d-flex justify-content-center h3 print--type">
          Party Payment
        </h3>
      </div>
      <div class="row mt-2 align-content-center print--voucher">
        <div class="col d-flex justify-content-around ">
          <p>
            From:<span class="v--date__from"> ${product.from} </span>To: 
            <span class="v--date__to">${product.to} </span>
          </p>
        </div>
      </div>
      
      <div class="row align-content-center print--content--header">
        <div class="col-1 d-flex justify-content-start">
          <label for="Serial--no">SL No</label>
        </div>
        <div class="col-2 d-flex justify-content-start">
          <label for="ledgerName">Date</label>
        </div>
        <div class="col-2 d-flex justify-content-start">
          <label for="quantity">Quantity</label>
        </div>
        <div class="col-2 d-flex justify-content-start">
          <label for="rate">Rate</label>
        </div>
        <div class="col-2 d-flex justify-content-start">
          <label for="purchase">Purchase Tk.</label>
        </div>
        <div class="col d-flex justify-content-start">
          <label for="sell">Sell Tk.</label>
        </div>
      </div>


      ${(() => {
        let sNo = 1;
        return productData
          .map((el) => {
            return el.purchases
              ? el.purchases.map((cEl) => {
                  const currentSNo = sNo;
                  sNo += 1;
                  return `<div class="row align-content-center print--content--body">
          <div class="col-1 d-flex justify-content-start">
            <label class="Serial--no">${currentSNo}</label>
          </div>
          <div class="col-2 d-flex justify-content-start">
            <label class="date">${el.date.split('T')[0]}</label>
          </div>
          <div class="col-2 d-flex justify-content-start">
            <label class="purchase-quantity">${cEl.quantity.toFixed(2)}</label>
          </div>
          <div class="col-2 d-flex justify-content-start">
            <label class="purchase-rate">${cEl.rate.toFixed(2)}</label>
          </div>
          <div class="col-2 d-flex justify-content-start">
            <label class="purchase-amount">${cEl.totalAmount.toFixed(2)}</label>
          </div>
          <div class="col d-flex justify-content-start">
            <label class="sell-amount">0</label>
          </div>
        </div>`;
                })
              : el.sells.map((cEl) => {
                  const currentSNo = sNo;
                  sNo += 1;
                  return `<div class="row align-content-center print--content--body">
          <div class="col-1 d-flex justify-content-start">
            <label class="Serial--no">${currentSNo}</label>
          </div>
          <div class="col-2 d-flex justify-content-start">
            <label class="date">${el.date.split('T')[0]}</label>
          </div>
          <div class="col-2 d-flex justify-content-start">
            <label class="sell-quantity">${cEl.quantity.toFixed(2)}</label>
          </div>
          <div class="col-2 d-flex justify-content-start">
            <label class="sell-rate">${cEl.rate.toFixed(2)}</label>
          </div>
          <div class="col-2 d-flex justify-content-start">
            <label class="purchase-amount">0</label>
          </div>
          <div class="col d-flex justify-content-start">
            <label class="sell-amount">${cEl.totalAmount.toFixed(2)}</label>
          </div>
        </div>`;
                });
          })
          .flat()
          .join('');
      })()}
               
      <div class="row align-content-center print--content--total">
        <div class="col-3 d-flex justify-content-end">
          <label>Total Purchase Quantity = </label>
        </div>
        <div class="col-3 d-flex justify-content-start">
          <label class="total-purchase-quantity">
          ${productData
            .map((el) =>
              el.purchases
                ? el.purchases.reduce((acc, el) => acc + el.quantity * 1, 0)
                : 0
            )
            .reduce((acc, el) => acc + el, 0)
            .toFixed(2)}
          </label>
        </div>
        <div class="col-3 d-flex justify-content-end">
          <label>Total Purchase Cost =</label>
        </div>
        <div class="col d-flex justify-content-start">
          <label class="total-purchase-cost">
          ${productData
            .map((el) =>
              el.purchases
                ? el.purchases.reduce((acc, el) => acc + el.totalAmount * 1, 0)
                : 0
            )
            .reduce((acc, el) => acc + el, 0)
            .toFixed(2)}
            </label>
        </div>
      </div>

      <div class="row align-content-center print--content--total">
        <div class="col-3 d-flex justify-content-end">
          <label>Total Sell Quantity = </label>
        </div>
        <div class="col-3 d-flex justify-content-start">
          <label class="total-sell-quantity">
          ${productData
            .map((el) =>
              el.sells
                ? el.sells.reduce((acc, el) => acc + el.quantity * 1, 0)
                : 0
            )
            .reduce((acc, el) => acc + el, 0)
            .toFixed(2)}
          </label>
        </div>
        <div class="col-3 d-flex justify-content-end">
          <label>Total Sell Cost =</label>
        </div>
        <div class="col d-flex justify-content-start">
          <label class="total-sell-cost">
          ${productData
            .map((el) =>
              el.sells
                ? el.sells.reduce((acc, el) => acc + el.totalAmount * 1, 0)
                : 0
            )
            .reduce((acc, el) => acc + el, 0)
            .toFixed(2)}
          </label>
        </div>
      </div>
      
      <div class="row align-content-center print--content--total">
                <div class="col-9 d-flex justify-content-end">
          <label>Total Profit ==</label>
        </div>
        <div class="col d-flex justify-content-start">
          <label class="profit">
          ${(
            productData
              .map((el) =>
                el.sells
                  ? el.sells.reduce((acc, el) => acc + el.totalAmount * 1, 0)
                  : 0
              )
              .reduce((acc, el) => acc + el, 0) -
            productData
              .map((el) =>
                el.purchases
                  ? el.purchases.reduce(
                      (acc, el) => acc + el.totalAmount * 1,
                      0
                    )
                  : 0
              )
              .reduce((acc, el) => acc + el, 0)
          ).toFixed(2)}
          </label>
        </div>
      </div>
      

      <div class="row mt-5 align-content-center print--footer">
        <div class="col-3 d-flex justify-content-start">
          <label>
            &nbsp;&nbsp;&nbsp;&nbsp;Prepared By&nbsp;&nbsp;&nbsp;&nbsp;
          </label>
        </div>
        <div class="col-3 d-flex justify-content-start">
          <label
            >&nbsp;&nbsp;&nbsp;&nbsp;Checked By&nbsp;&nbsp;&nbsp;&nbsp;</label
          >
        </div>
        <div class="col-3 d-flex justify-content-start">
          <label
            >&nbsp;&nbsp;&nbsp;&nbsp;Approved By&nbsp;&nbsp;&nbsp;&nbsp;</label
          >
        </div>
      </div>
    </div>
  `;

  printsellFrom.insertAdjacentHTML('afterbegin', markup);
};
