import axios from 'axios';
import { showAlert, showModal, hideModal } from './alert';

const getAllFromApi = async (apiKey) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/${apiKey}s/all`,
    });

    if (res.data.status === 'success') return res;
  } catch (err) {
    console.log(err);
  }
};

export const createNewOneOrUpdate = async (types) => {
  const name = document.querySelector('#ledgername').value;
  const email = document.querySelector('#email').value;
  const phone = document.querySelector('#phone').value;
  const type = [document.querySelector('#type').value];
  const description = document.querySelector('#descriptions').value;
  const address = document.querySelector('#address').value;

  const id =
    types === 'update'
      ? document.querySelector('.ledgerId').dataset.ledgerid
      : '';

  const method = types === 'new' ? 'POST' : 'PATCH';

  const url =
    types === 'new'
      ? 'http://127.0.0.1:3000/api/v1/ledgers/newOne'
      : `http://127.0.0.1:3000/api/v1/ledgers/update/${id}`;

  console.log(name, email, phone, type, description, address);

  // /api/v1/ledgers/newOne

  //createNewOneOrUpdate

  try {
    const res = await axios({
      method,
      url,
      data: {
        name,
        email,
        phone,
        typeof: type,
        description,
        address,
      },
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        showAlert('success', `${types} Party added successfully...`);
        location.assign('/allLedger');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

//'/single/:id
export const editLedger = async (id) => {
  try {
    const res = await axios({
      url: `http://127.0.0.1:3000/api/v1/ledgers/single/${id}`,
      method: 'GET',
    });

    const resType = await axios({
      url: 'http://127.0.0.1:3000/api/v1/paymentTypes/all',
      method: 'GET',
    });

    console.log(res.data.status);
    if (res.data.status === 'success') {
      localStorage.clear();
      localStorage.setItem('typeOfData', JSON.stringify(resType.data.data));
      localStorage.setItem('ledgerData', JSON.stringify(res.data.data));

      showAlert('success', `Going for edit Party`);
      window.setTimeout(() => {
        location.assign('/editLedger');
      });
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const renderEditPage = (editLedgerForm) => {
  const ledgerData = JSON.parse(localStorage.getItem('ledgerData'));
  const typeOfData = JSON.parse(localStorage.getItem('typeOfData'));

  localStorage.clear();

  const markup = `
         <form
            action=""
            class="form form__edit--ledger form-group m-3 px-3 mt-5 b-2 border border-danger"
          >
            <h2 class="text-center form-text">
              Updating Party*: you must need a Name*, Type* of Party and others info.
            </h2>
            <div class="ledger--info">
              <label for="ledgername" data-ledgerid="${
                ledgerData.data._id
              }" class="mb-0 m-1 form-label ledgerId text-wrap"
                >Name of Party*:</label
              >
              <input type="text" value="${
                ledgerData.data.name
              }" required id="ledgername" class="form-control m-1" />
              <label for="email" class="mb-0 m-1 form-label text-wrap"
                >Email of Party:</label
              >
              <input type="text" value="${
                ledgerData.data.email
              }" id="email" class="form-control m-1" />
              <label for="phone" class="mb-0 m-1 form-label text-wrap"
                >Contact:</label
              >
              <input type="tel" required value="${
                ledgerData.data.phone
              }" id="phone" class="form-control m-1" />
              <label for="address" class="mb-0 m-1 form-label text-wrap"
                >Address:</label
              >
              <input type="text" required value="${
                ledgerData.data.address
              }" id="address" class="form-control m-1" />

              <label for="type" class="mb-0 m-1 form-label text-wrap"
                >Type of Party*:</label
              >
              <select class="form-select form-control m-1" required id="type">
                <option value="${ledgerData.data.typeof[0]._id}" selected>${
    ledgerData.data.typeof[0].slug
  }</option>
                ${typeOfData.data.map(
                  (el) => `<option value="${el._id}">${el.name}</option>`
                )}
                
              </select>

              <label for="descriptions" class="mb-0 m-1 form-label text-wrap"
                >Descriptions:</label
              >
              <textarea
                class="form-control"
                id="descriptions"
                value="${ledgerData.data.description}"
                cols="10"
                rows="3"
              ></textarea>
            </div>
            <button class="m-3 btn btn-update btn-info">Update</button>
          </form>
  `;

  editLedgerForm.insertAdjacentHTML('afterbegin', markup);
};

export const searchLedger = async (id) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/ledgers/single/${id}`,
    });
    if (res.data.status === 'success') {
      localStorage.clear();
      localStorage.setItem('ledgerData', JSON.stringify(res.data.data));
      showAlert('success', 'Searching for party');
      window.setTimeout(() => {
        location.assign('/searchLedger');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteLedger = async (id) => {
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
        url: `http://127.0.0.1:3000/api/v1/ledgers/delete/${id}`,
      });

      showAlert('success', 'Data deleted successfully');
      window.setTimeout(() => {
        location.assign('/allLedger');
      });
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  });
};

export const renderSearchLedger = async () => {
  try {
    const ledgerData = JSON.parse(localStorage.getItem('ledgerData'));
    if (!ledgerData) {
      showAlert('error', 'Ledger not found! Going back to provious page');
      return window.setTimeout(() => {
        location.assign('/allLedger');
      }, 1500);
    }
    const ledger = ledgerData.data._id;
    const branch = document.querySelector('#branchid').value;
    const to = document.querySelector('#to').value;
    const from = document.querySelector('#from').value;
    const data = { ledger };

    // Checking guard state
    if (branch !== 'Select Branch') data.branch = branch;
    if (from) data.from = from;
    if (to) data.to = to;

    // For geting Payment data from DB
    const resPayment = await axios({
      url: 'http://127.0.0.1:3000/api/v1/payments/ledgerinfo',
      method: 'POST',
      data,
    });

    // For geting Purchase data from DB
    const resPurchase = await axios({
      url: 'http://127.0.0.1:3000/api/v1/purchases/ledgerinfo',
      method: 'POST',
      data,
    });

    if (branch !== 'Select Branch') {
      data.branch = { id: branch, have: true };
    } else {
      data.branch = { have: false };
    }

    if (
      resPayment.data.status === 'success' &&
      resPurchase.data.status === 'success'
    ) {
      data.ledger = ledgerData.data;
      localStorage.clear();
      localStorage.setItem('resPayment', JSON.stringify(resPayment.data.data));
      localStorage.setItem(
        'resPurchase',
        JSON.stringify(resPurchase.data.data)
      );
      localStorage.setItem('reqData', JSON.stringify(data));
      showAlert('success', 'Print data in seconds...');
      window.setTimeout(() => {
        location.assign('/printLedger');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', 'somethings wrong data not find🌟🌟');
  }
};

export const printLedger = async (printLedgerFrom) => {
  const reqData = JSON.parse(localStorage.getItem('reqData'));
  const resPayment = JSON.parse(localStorage.getItem('resPayment'));
  const resPurchase = JSON.parse(localStorage.getItem('resPurchase'));

  const itemName = await getAllFromApi('item');
  const unitName = await getAllFromApi('unit');
  const allBranch = await getAllFromApi('branch');

  const purItem = resPurchase.map((el) => {
    return {
      ...el,
      items: el.items.map((cel) => ({
        ...cel,
        itemName: itemName.data.data.data.find(
          (item) => item._id === cel.itemName
        ),
        unit: unitName.data.data.data.find((unit) => unit._id === cel.unit),
      })),
      branch: allBranch.data.data.data.find(
        (branch) => branch._id === el.branch
      ),
    };
  });

  const payItem = resPayment.map((el) => {
    return {
      ...el,
      branch: allBranch.data.data.data.find(
        (branch) => branch._id === el.branch
      ),
    };
  });

  const data = [...payItem, ...purItem];
  data.sort((a, b) => new Date(a.date) - new Date(b.date));

  let branch;
  try {
    if (reqData.branch.have) {
      const resOfBranch = await axios({
        url: `http://127.0.0.1:3000/api/v1/branchs/branch/${reqData.branch.id}`,
        method: 'GET',
      });
      branch = resOfBranch.data.data.data.name;
    } else {
      branch = 'All Branch Data';
    }
  } catch (err) {
    console.log(err);
  }
  if (!reqData.from) reqData.from = 'Start';
  if (!reqData.to) reqData.to = 'End';

  // Menipulating Printing Page HTML
  const markup = `
  <div class="container-fluid">
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
        <p class="col-12 d-flex justify-content-center h5">${branch}</p>
        <p class="col-12 d-flex justify-content-center h5">${
          reqData.ledger.name
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
            From:<span class="v--date__from"> ${reqData.from} </span>To: 
            <span class="v--date__to">${reqData.to} </span>
          </p>
        </div>
      </div>     
      <table class="table">
        <thead>
            <tr>
              <th scope="col">SL No</th>
              <th scope="col">Date</th>
              ${
                branch === 'All Branch Data'
                  ? '<th scope="col">Branch</th>'
                  : ' '
              }
              <th scope="col">Narrations</th>
              <th scope="col">Debit</th>
              <th scope="col">Credit</th>
            </tr>
          </thead>
          <tbody>
          ${(() => {
            let sNo = 1;
            return data
              .map((el) => {
                return el.payments
                  ? el.payments.map((cEl) => {
                      const currentSNo = sNo;
                      sNo += 1;
                      return `
                    <tr>
                      <th scope="row">${currentSNo}</th>
                      <td>${el.date.split('T')[0]}</td>
                      ${
                        branch === 'All Branch Data'
                          ? `<td>${el.branch.name}</td>`
                          : ' '
                      }
                      <td>${cEl.purpose}</td> 
                      <td>${cEl.amount.toFixed(2)}</td>
                      <td>00.00</td>
                    </tr>
                  `;
                    })
                  : el.items.map((cEl) => {
                      const currentSNo = sNo;
                      sNo += 1;
                      return `
                    <tr>
                      <th scope="row">${currentSNo}</th>
                      <td>${el.date.split('T')[0]}</td>
                      ${
                        branch === 'All Branch Data'
                          ? `<td>${el.branch.name}</td>`
                          : ' '
                      }
                      <td>${cEl.itemName.name} ${cEl.quantity}${
                        cEl.unit.name
                      }</td>
                      <td>00.00</td>
                      <td>${cEl.total.toFixed(2)}</td>
                    </tr>
                  `;
                    });
              })
              .flat()
              .join('');
          })()}
          <tr>
            <th></th>
            <th></th>${branch === 'All Branch Data' ? `<th></th>` : ' '}
            <th>Total</th>
            <th>${data
              .reduce(
                (acc, el) => (el.summeryAmount ? acc + el.summeryAmount : acc),
                0
              )
              .toFixed(2)}</th>
            <th>${
              reqData.ledger.typeof[0].slug === 'supplier'
                ? data
                    .reduce((acc, el) => (el.total ? acc + el.total : acc), 0)
                    .toFixed(2)
                : data
                    .reduce(
                      (acc, el) =>
                        el.summeryAmount ? acc + el.summeryAmount : acc,
                      0
                    )
                    .toFixed(2)
            }</th>
          </tr>
          </tbody>
      </table>
      <div class="row align-content-center print--title">
        <div class="col-12 d-flex justify-content-center">
          <p class="h6">Closing balance: ${
            reqData.ledger.typeof[0].slug === 'supplier'
              ? (
                  data.reduce(
                    (acc, el) => (el.total ? acc + el.total : acc),
                    0
                  ) -
                  data.reduce(
                    (acc, el) =>
                      el.summeryAmount ? acc + el.summeryAmount : acc,
                    0
                  )
                ).toFixed(2)
              : '00.00'
          }</p>
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
  printLedgerFrom.insertAdjacentHTML('afterBegin', markup);
};
