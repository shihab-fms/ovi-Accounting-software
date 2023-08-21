// 'use strict';
import axios from 'axios';
import { showAlert, showModal, massiveError } from './alert';

const btnAddBranchEmployees = document.querySelectorAll('#addEmployee');
const btnAddmoreBranchEmployees = document.querySelectorAll('#anotherEmployee');

// Functionality

export const addEmployee = async () => {
  // e.preventDefault();
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/getall',
    });

    if ((res.data.status = 'success')) {
      const employees = document.querySelector('.employees');
      const markup = `<select
                class="form-select form-control m-1" required id="employee"
              >
                <option selected>Select employees</option>
                ${res.data.data.data.map((el) => {
                  return `<option value=${el._id}>${el.name}</option>`;
                })}
              </select>`;
      employees.insertAdjacentHTML('beforeend', markup);
    }
  } catch (err) {
    console.log(err);
  }
};

// if (btnAddBranchEmployees)
//   btnAddBranchEmployees.forEach((el) =>
//     el.addEventListener('click', addEmployee)
//   );

// if (btnAddmoreBranchEmployees)
//   btnAddmoreBranchEmployees.forEach((el) =>
//     el.addEventListener('click', addEmployee)
//   );

////////////////////////////////
////////////////////////////////
////////////////////////////////
// API Work started from here

const getLedger = async () => {
  const res = await axios({
    method: 'GET',
    url: 'http://127.0.0.1:3000/api/v1/ledgers/all',
  });

  return res.data.data.data;
};

export const saveNewPaymentOrUpdate = async (type) => {
  try {
    console.log(document.querySelector('#branchname').dataset.branchid);
    const id =
      type === 'update'
        ? document.querySelector('#branchname').dataset.branchid
        : '';
    const method = type === 'new' ? 'POST' : 'PATCH';
    const url =
      type === 'new'
        ? 'http://127.0.0.1:3000/api/v1/branchs/newOne'
        : `http://127.0.0.1:3000/api/v1/branchs/update/${id}`;

    const name = document.querySelector('#branchname').value;
    const address = document.querySelector('#address').value;
    const description = document.querySelector('#descriptions').value;
    const employeesEl = document.querySelectorAll('#employee');
    const employees = [];

    for (let i = 0; i < employeesEl.length; i++) {
      if (employeesEl[i].value !== 'Select employees')
        employees.push(employeesEl[i].value);
    }
    // console.log(employees);
    const res = await axios({
      method,
      url,
      data: {
        name,
        address,
        description,
        employees,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type} branch implimention successfully`);
      window.setTimeout(() => {
        location.assign('/allBranch');
      }, 1500);
    }
  } catch (err) {
    // console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const branchReport = async (branchId, from, to) => {
  try {
    const ledgers = await getLedger();
    const pay = [];

    await Promise.all(
      ledgers.map(async (el) => {
        let res = await axios({
          method: 'POST',
          url: 'http://127.0.0.1:3000/api/v1/branchs/branchReport',
          data: {
            branchId,
            ledgerId: el._id,
            from,
            to,
          },
        });

        if (res.data.data.length !== 0) {
          pay.push(res.data.data);
        }
      })
    );
    const infoOfBranch = {
      branchId,
      from,
      to,
    };
    localStorage.clear();
    localStorage.setItem('branchReport', JSON.stringify(pay));
    localStorage.setItem('infoOfBranch', JSON.stringify(infoOfBranch));
    showAlert('success', 'Viewing branch report in seconds....');
    window.setTimeout(() => {
      location.assign('/viewBranchReport');
    }, 1500);
  } catch (err) {
    console.log(err);
  }
};

export const renderBranchView = async (printbody) => {
  try {
    const branchData = JSON.parse(localStorage.getItem('branchReport'));
    const infoOfBranch = JSON.parse(localStorage.getItem('infoOfBranch'));

    // Getting Sum Of Total Branch Cost Report
    const sumOf = branchData
      .map((el) => el.reduce((acc, el) => acc + el.summeryAmount, 0))
      .reduce((acc, el) => acc + el, 0);

    // Geting out Name of Branch from DB via ID from LocalStorage info
    const resOfBranch = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/branchs/branch/${infoOfBranch.branchId}`,
    });

    // Getting Ledger Serially from DB using ID from branchData
    const ledgerId = branchData.map((el) => el[0].payments[0].ledgerName);
    let ledgers = await Promise.all(
      ledgerId.map(async (el) => {
        const resOfLedgers = await axios({
          method: 'GET',
          url: `http://127.0.0.1:3000/api/v1/ledgers/single/${el}`,
        });
        return resOfLedgers.data.data.data.name;
      })
    );

    const markup = `
      <div class="mt-3 row align-content-center print--address">
        <h4 class="col-12 d-flex justify-content-center h6">
          Branch report of
        </h4>
      </div>
      <div class="row align-content-center print--branch">
        <p class="col-12 d-flex justify-content-center h5">${
          resOfBranch.data.data.data.name
        }</p>
      </div>
      <div class="row mt-2 align-content-center print--voucher">
        <div class="col d-flex justify-content-around ">
          <p>
            From:<span class="v--date__from"> ${
              infoOfBranch.from.split('T')[0]
            } </span>To:
            <span class="v--date__to"> ${infoOfBranch.to.split('T')[0]} </span>
          </p>
        </div>
      </div>
      <table class="table">
        <thead>
            <tr>
              <th scope="col">SL No</th>
              <th scope="col">Name</th>
              <th scope="col">Debit</th>
              <th scope="col">Credit</th>
            </tr>
        </thead>
        <tbody>
            ${branchData
              .map((el, i) => {
                return `
                    <tr>
                      <th>${i + 1}</th>
                      <td>${ledgers[i]}</td>
                      <td>${el.reduce(
                        (acc, el) => acc + el.summeryAmount,
                        0
                      )}</td>
                      <td>${el.reduce(
                        (acc, el) => acc + el.summeryAmount,
                        0
                      )}</td>
                    </tr>
                  `;
              })
              .join(' ')}
              <tr>
                <th></th>
                <th>Total:</th>
                <th>${sumOf}</th>
                <th>${sumOf}</th>
              </tr>
        </tbody>
      </table> 
    `;

    // Rendering to Font End
    printbody.insertAdjacentHTML('beforebegin', markup);
  } catch (err) {
    // showAlert('error', err.response.message);
    console.log(err);
  }
};

export const renderBranchPrint = async (printbody) => {
  try {
    const branchData = JSON.parse(localStorage.getItem('branchReport'));
    const infoOfBranch = JSON.parse(localStorage.getItem('infoOfBranch'));

    // Getting Sum Of Total Branch Cost Report
    const sumOf = branchData
      .map((el) => el.reduce((acc, el) => acc + el.summeryAmount, 0))
      .reduce((acc, el) => acc + el, 0);

    // Geting out Name of Branch from DB via ID from LocalStorage info
    const resOfBranch = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/branchs/branch/${infoOfBranch.branchId}`,
    });

    // Getting Ledger Serially from DB using ID from branchData
    const ledgerId = branchData.map((el) => el[0].payments[0].ledgerName);
    let ledgers = await Promise.all(
      ledgerId.map(async (el) => {
        const resOfLedgers = await axios({
          method: 'GET',
          url: `http://127.0.0.1:3000/api/v1/ledgers/single/${el}`,
        });
        return resOfLedgers.data.data.data.name;
      })
    );

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
            <p class="col-12 d-flex justify-content-center h5">${
              resOfBranch.data.data.data.name
            }</p>
          </div>
          <div class="row align-content-center print--header">
            <h3 class="col-12 d-flex justify-content-center h5 print--type">
              Branch Report
            </h3>
          </div>
          <div class="row mt-2 align-content-center print--voucher">
            <div class="col d-flex justify-content-around ">
              <p>
                From:<span class="v--date__from"> ${
                  infoOfBranch.from.split('T')[0]
                } </span>To:
                <span class="v--date__to"> ${
                  infoOfBranch.to.split('T')[0]
                } </span>
              </p>
            </div>
          </div>
          <table class="table">
        <thead>
            <tr>
              <th scope="col">SL No</th>
              <th scope="col">Name</th>
              <th scope="col">Debit</th>
              <th scope="col">Credit</th>
            </tr>
        </thead>
        <tbody>
            ${branchData
              .map((el, i) => {
                return `
                    <tr>
                      <th>${i + 1}</th>
                      <td>${ledgers[i]}</td>
                      <td>${el.reduce(
                        (acc, el) => acc + el.summeryAmount,
                        0
                      )}</td>
                      <td>${el.reduce(
                        (acc, el) => acc + el.summeryAmount,
                        0
                      )}</td>
                    </tr>
                  `;
              })
              .join(' ')}
              <tr>
                <th></th>
                <th>Total:</th>
                <th>${sumOf}</th>
                <th>${sumOf}</th>
              </tr>
        </tbody>
      </table>
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
        `;

    printbody.insertAdjacentHTML('afterbegin', markup);
  } catch (err) {
    // showAlert('error', err.response.message);
    console.log(err);
  }
};

export const editBranch = async (id) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/branchs/branch/${id}`,
    });
    if (res.data.status === 'success') {
      localStorage.clear();
      localStorage.setItem('branchData', JSON.stringify(res.data.data));
      showAlert('success', 'Searching for branch');
      window.setTimeout(() => {
        location.assign('/editBranch');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const renderEditBranch = (editBranchForm) => {
  const branchData = JSON.parse(localStorage.getItem('branchData'));
  // const typeOfData = JSON.parse(localStorage.getItem('typeOfData'));

  // localStorage.clear();

  const markup = `
          <form
            action=""
            class="form form__add--branch form-group m-3 px-3 mt-5 b-2 border border-danger"
          >
            <h2 class="text-center form-text">
              Update Branch*: you must need a Name*, Type* of Party and others
              info.
            </h2>
            <div class="branch--info">
              <label for="branchname" class="mb-0 m-1 form-label text-wrap"
                >Name of Branch*:</label
              >
              <input data-branchid="${branchData.data._id}"
                type="text"
                required
                id="branchname"
                class="form-control m-1"
                value="${branchData.data.name}"
              />
              <label for="address" class="mb-0 m-1 form-label text-wrap"
                >Address of Branch*:</label
              >
              <input type="text" id="address" class="form-control m-1" value="${
                branchData.data.address
              }" />
              <label for="type" class="mb-0 m-1 form-label text-wrap"
                >Enlisted employees of Branch*:</label
              >
              <div class="row employees">

              ${branchData.data.employees
                .map((el) => {
                  return `
                  <div class="row enlisted-employee mb-2">
                    <select readonly class="form-select form-control m-1" required id="employee">
                      <option readonly value="${el._id}">${el.name}</option>
                    </select>
                    <button class="btn btn-secondary btn-remove-employee">Remove</button>
                  </div>
                  
                `;
                })
                .join(' ')}
                <button class="btn btn-danger btn-add-employees">Enlist another</button>
              </div>

              <label for="descriptions" class="mb-0 m-1 form-label text-wrap"
                >Descriptions:</label
              >
              <textarea
                class="form-control"
                id="descriptions"
                cols="10"
                rows="3"
                
              >${branchData.data.description}</textarea>
            </div>
            <button class="m-3 btn btn-info btn-update">Update</button>
          </form>
        `;

  editBranchForm.insertAdjacentHTML('afterbegin', markup);
};

export const deleteBranch = (id) => {
  showModal();
  const cancelModalButton = document.getElementById('cancelModalButton');
  const confirmModalButton = document.getElementById('confirmModalButton');

  cancelModalButton.addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('confirmationModal').style.display = 'none';
  });

  confirmModalButton.addEventListener('click', async () => {
    document.getElementById('confirmationModal').style.display = 'none';

    try {
      const res = await axios({
        method: 'DELETE',
        url: `http://127.0.0.1:3000/api/v1/branchs/delete/${id}`,
      });

      showAlert('success', 'Branch deleted successfully');

      window.setTimeout(() => {
        location.reload();
      }, 1500);
    } catch (err) {
      console.log(err);
      if (
        err.response.data.message ===
        'You do not have permission to perform this action'
      )
        // massiveError();
        alert('Hey! Who the heal are you tring to do bod 😠🌟🌟🌟');
      showAlert('error', err.response.data.message);
    }
  });
};
