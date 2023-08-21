// 'use strict';
import { login, logout } from './login';
import { showAlert, showUnit, modifyDate, searchContent } from './alert';
import * as branch from './branch';
import * as payment from './payment';
import * as ledger from './ledger';
import * as purchase from './purchase';
import * as other from './other';

// Nav var
const menubar = document.querySelector('.navbar');

// DOM Element
//////////////////////////
//////////////////////////

const loginForm = document.querySelector('.form--login');

const btnlogout = document.querySelector('.nav__el--logout');

//Others

const btnUnit = document.querySelector('.units-list');
const btnItem = document.querySelector('.items-list');

// branch
const addBranchForm = document.querySelector('.form--el__addbranch');
const searchbranchForm = document.querySelector('.form__branch--search');
const allbranchForm = document.querySelector('.form_el-allBranch');
const editBranchForm = document.querySelector('.form--el__editbranch');
const viewBranchReport = document.querySelector('.form--branch__view');
const printBranchReport = document.querySelector('.form--branchReport__print');
// payment
const addPaymentForm = document.querySelector('.form__payment--add');
const searchPaymentFrom = document.querySelector('.form--search__payment');
const viewPaymentForm = document.querySelector('.form__payment--view');
const printPaymentForm = document.querySelector('.form--payment__print');

// Purchase

const addPurchseForm = document.querySelector('.form--el__addPurchase');
const allPurchseForm = document.querySelector('.form--search__purchase');
const viewPurchseForm = document.querySelector('.form__purchase--view');
const printPurchseForm = document.querySelector('.form--purchase__print');

//ledger
const addLedgerForm = document.querySelector('.form--el__addledger');
const allLedgerForm = document.querySelector('.form_el-allpayment');
const editLedgerForm = document.querySelector('.form--el__editledger');
const searchLedgerForm = document.querySelector('.form--el__search');
const printLedgerFrom = document.querySelector('.form--ledger__print');

// Value
//////////////////////////
//////////////////////////

// Dropdown manu
if (document.querySelector('.icon--res'))
  document.querySelector('.icon--res').addEventListener('click', function (e) {
    e.preventDefault();
    if (menubar.className === 'navbar') {
      menubar.className += ' responsive';
    } else {
      menubar.className = 'navbar';
    }
  });

// External functionallity

///////////////////////////
///////////////////////////

// Login and log out functionallity

///////////////////////////
///////////////////////////

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });

if (btnlogout) btnlogout.addEventListener('click', logout);

// Others functionallity
///////////////////////////
if (btnUnit)
  btnUnit.addEventListener('click', function (e) {
    e.preventDefault();
    other.showModalItem('unit');
  });

if (btnItem)
  btnItem.addEventListener('click', function (e) {
    e.preventDefault();
    other.showModalItem('item');
  });

///////////////////////////
///////////////////////////
// Branch Manipulation

//      1) Search for branch result

if (searchbranchForm) {
  searchbranchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const branchId = document.querySelector('#branch--id').value;
    const from = document.querySelector('#date--from').value;
    let to = document.querySelector('#date--to').value;

    if (!to) to = new Date(Date.now());
    branch.branchReport(branchId, from, to);
  });
}

//      2) view for branch result

if (viewBranchReport) {
  branch.renderBranchView(document.querySelector('.print--footer'));

  const btnBranchReportPrint = document.querySelector(
    '.btn-print--branchReport'
  );
  // if (btnBranchReportPrint)
  btnBranchReportPrint.addEventListener('click', function (e) {
    e.preventDefault();
    console.log(e);
    showAlert('success', 'Printing report in seconds...');
    window.setTimeout(() => {
      location.assign('/printBranchReport');
    });
  });
}

//      3) print for branch result

if (printBranchReport) {
  branch.renderBranchPrint(printBranchReport);
}

//      3) all branch

if (allbranchForm) {
  // Search on page
  const search = document.querySelector('.myInput');
  search.addEventListener('input', function () {
    searchContent('BL');
  });

  const btnEdit = document.querySelectorAll('.btn-edit');
  const btnDelete = document.querySelectorAll('.btn-delete');

  let branchId;

  // i) Eidt branch Button
  btnEdit.forEach((el) =>
    el.addEventListener('click', function (e) {
      // console.log('hell');
      e.preventDefault();
      branchId = e.target.parentElement.parentElement.dataset.branchid;
      // console.log(e.target.parentElement.parentElement.dataset.branchid);

      branch.editBranch(branchId);
    })
  );

  // ii) Delete branch Button
  btnDelete.forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      branchId = e.target.parentElement.parentElement.dataset.branchid;
      console.log(branchId);

      branch.deleteBranch(branchId);
    });
  });
}

//      4) edit branch

if (editBranchForm) {
  branch.renderEditBranch(editBranchForm);

  const btn_update = document.querySelector('.btn-update');
  const btn_remove = document.querySelectorAll('.btn-remove-employee');
  const btn_add = document.querySelector('.btn-add-employees');

  btn_add.addEventListener('click', function (e) {
    e.preventDefault();
    branch.addEmployee();
  });

  if (btn_remove)
    btn_remove.forEach((el) =>
      el.addEventListener('click', function (e) {
        e.preventDefault();

        e.target.parentElement.remove();
      })
    );

  btn_update.addEventListener('click', function (e) {
    e.preventDefault();
    branch.saveNewPaymentOrUpdate('update');
  });
}

//      5) add branch

if (addBranchForm) {
  const btn_Save = document.querySelector('.btn-save');
  const btn_add_employee = document.querySelectorAll('.btn-add-employees');

  btn_add_employee.forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      branch.addEmployee();
    });
  });

  btn_Save.addEventListener('click', function (e) {
    e.preventDefault();
    branch.saveNewPaymentOrUpdate('new');
  });
}

///////////////////////////
///////////////////////////
// Payment Manipulation

//      1) Add Payment page

if (addPaymentForm) {
  // i) Add new ledger and payment element
  payment.addPaymentLedgerEement();

  // ii) Remove last one Ledger and payment element
  payment.removePaymentLedgerElement();

  // iii) Save data new Payment
  payment.saveNewPaymentOrUpdate('new');
}

//      2) Search Payment page

if (searchPaymentFrom) {
  // Search on page
  const search = document.querySelector('.myInput');
  search.addEventListener('input', searchContent);
  modifyDate();
  const btnPaymentEdit = document.querySelectorAll('.btn-edit');
  const btnPaymentPrint = document.querySelectorAll('.btn-print');
  const btnPaymentDelete = document.querySelectorAll('.btn-delete');

  let paymentId;

  // i) Eidt Payment Button
  btnPaymentEdit.forEach((el) =>
    el.addEventListener('click', function (e) {
      e.preventDefault();
      paymentId = e.target.parentElement.parentElement.dataset.paymentid;

      payment.searchedPaymentToView(paymentId);
    })
  );

  // ii) Delete Payment Button
  btnPaymentDelete.forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      paymentId = e.target.parentElement.parentElement.dataset.paymentid;

      payment.deletePayment(paymentId);
    });
  });

  // iii) Print Button

  btnPaymentPrint.forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      paymentId = e.target.parentElement.parentElement.dataset.paymentid;
      // console.log(paymentId);
      payment.printPayment(paymentId);
    });
  });
}

//      3) View Payment page

if (viewPaymentForm) {
  // i) render Page
  payment.renderViewPage();

  // ii) deletePrevious item
  payment.deleteRenderViewPageEl();

  // iii) Add new ledger and payment element
  payment.addPaymentLedgerEement();

  // iv) Remove last one Ledger and payment element
  payment.removePaymentLedgerElement();

  // v) Update Payment button
  payment.saveNewPaymentOrUpdate('update');
}

//      4) Print Payment page

if (printPaymentForm) {
  payment.renderPrint(printPaymentForm);
}

///////////////////////////
///////////////////////////
// Payment Manipulation

//      1) Add Payment page

if (addPurchseForm) {
  const quantity = document.querySelectorAll('#quantity');
  const rate = document.querySelectorAll('#rate');
  const btnAddItem = document.querySelector('#add--more__item');
  const btnRemoveItem = document.querySelector('#remove--last__item');
  const btnsave = document.querySelector('#add--purchase__submit');

  purchase.autoMultiply(quantity, rate);
  btnAddItem.addEventListener('click', function (e) {
    e.preventDefault();
    purchase.addNewItemEl();
  });

  btnRemoveItem.addEventListener('click', function (e) {
    e.preventDefault();
    purchase.removeLastEl();
  });

  btnsave.addEventListener('click', function (e) {
    e.preventDefault();
    purchase.saveOrUpdate('new');
  });
}

if (allPurchseForm) {
  // Search on page
  const search = document.querySelector('.myInput');
  search.addEventListener('input', searchContent);
  modifyDate();

  const btnEdit = document.querySelectorAll('.btn-edit');
  const btnPrint = document.querySelectorAll('.btn-print');
  const btnDelete = document.querySelectorAll('.btn-delete');

  let purchaseId;

  // i) Eidt purchase Button
  btnEdit.forEach((el) =>
    el.addEventListener('click', function (e) {
      e.preventDefault();
      purchaseId = e.target.parentElement.parentElement.dataset.purchaseid;

      purchase.setViewPageData(purchaseId);
    })
  );

  // ii) Delete purchase Button
  btnDelete.forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      purchaseId = e.target.parentElement.parentElement.dataset.purchaseid;

      purchase.deletePurchase(purchaseId);
    });
  });

  // iii) Print Button

  btnPrint.forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      purchaseId = e.target.parentElement.parentElement.dataset.purchaseid;
      // console.log(purchaseId);
      purchase.printPurchase(purchaseId);
    });
  });
}

if (viewPurchseForm) {
  // i) render Page
  purchase.renderViewPage();

  const quantity = document.querySelectorAll('#quantity');
  const rate = document.querySelectorAll('#rate');
  const btnAddItem = document.querySelector('#add--more__item');
  const btnRemoveItem = document.querySelector('#remove--last__item');
  const btnsave = document.querySelector('#add--purchase__submit');

  purchase.autoMultiply(quantity, rate);

  btnAddItem.addEventListener('click', function (e) {
    e.preventDefault();
    purchase.addNewItemEl();
  });

  btnRemoveItem.addEventListener('click', function (e) {
    e.preventDefault();
    purchase.removeLastEl();
  });

  btnsave.addEventListener('click', function (e) {
    e.preventDefault();
    purchase.saveOrUpdate('update');
  });
  // purchase.removeLastEl();
}

if (printPurchseForm) purchase.renderPrint(printPurchseForm);

///////////////////////////
///////////////////////////
// Party or Ledger Manipulation

//      1) Add Lager page

if (addLedgerForm) {
  const btnaddLedger = document.querySelector('#addledger');
  btnaddLedger.addEventListener('click', function (e) {
    e.preventDefault();

    ledger.createNewOneOrUpdate('new');
  });
}

if (allLedgerForm) {
  // Search on page
  const search = document.querySelector('.myInput');
  search.addEventListener('input', function () {
    searchContent('BL');
  });
  const btnEdit = document.querySelectorAll('.btn-edit');
  const btnSearch = document.querySelectorAll('.btn-search');
  const btnDelete = document.querySelectorAll('.btn-delete');
  let ledgerId;
  // 1) Rendering edit button page
  btnEdit.forEach((el) =>
    el.addEventListener('click', function (e) {
      e.preventDefault();
      ledgerId =
        e.target.parentElement.parentElement.querySelector('#ledger').dataset
          .ledgerid;
      ledger.editLedger(ledgerId);
    })
  );

  // 2) Rendring search button page

  btnSearch.forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      ledgerId =
        e.target.parentElement.parentElement.querySelector('#ledger').dataset
          .ledgerid;
      ledger.searchLedger(ledgerId);
    });
  });

  // Delete Ledger button

  btnDelete.forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();

      ledgerId =
        e.target.parentElement.parentElement.querySelector('#ledger').dataset
          .ledgerid;
      ledger.deleteLedger(ledgerId);
    });
  });
}

if (editLedgerForm) {
  // i) rendering page
  ledger.renderEditPage(editLedgerForm);

  // ii) updating after edit

  const btnUpdate = document.querySelector('.btn-update');
  btnUpdate.addEventListener('click', function (e) {
    e.preventDefault();

    ledger.createNewOneOrUpdate('update');
  });
}

if (searchLedgerForm) {
  const ledgerData = JSON.parse(localStorage.getItem('ledgerData'));
  const heading = document.querySelector('#headertext');
  const btnSearch = document.querySelector('#searchledger');
  if (ledgerData) {
    heading.textContent = ' ';
    const markup = `<h2 class="text-center form-text" id="headertext">Search data about <span style="color:red">${ledgerData.data.name} </span> and fullfill information below</h2>`;
    document
      .querySelector('.form.form__search--ledger')
      .insertAdjacentHTML('afterbegin', markup);
  }

  btnSearch.addEventListener('click', function (e) {
    e.preventDefault();

    ledger.renderSearchLedger();
  });
}

if (printLedgerFrom) {
  ledger.printLedger(printLedgerFrom);
}
