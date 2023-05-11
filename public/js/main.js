import * as auth from './auth';
import * as product from './product';
import * as purchase from './purchase';
import * as sell from './sell';
import * as typeOfProduct from './typeOfProduct';
import { showAlert, showModal, autoMultiply } from './alart';

const loginForm = document.querySelector('.user_card_login');
const btnLogout = document.querySelector('.nav__el--logout');

const formUpdateMe = document.querySelector('.update-user-settings');

// Purchase form
const formAddPurchase = document.querySelector('.form--el__addpurchase');
const formSearchPurchase = document.querySelector('.form--search__purchase');
const formEditPurchase = document.querySelector('.form--el__editpurchase');
const formPrintPurchase = document.querySelector('.form--purchase__print');

// Sell form
const formAddSell = document.querySelector('.form--el__addsell');
const formSearchSell = document.querySelector('.form--search__sell');
const formEditSell = document.querySelector('.form--el__editsell');
const formPrintSell = document.querySelector('.form--sell__print');

// Product form
const formAddProduct = document.querySelector('.form--el__addproduct');
const formAllProduct = document.querySelector('.form_el-allProduct');
const formEditProduct = document.querySelector('.form--el__editProduct');
const formSearchProduct = document.querySelector('.form__search--product');
const formPrintProduct = document.querySelector('.form--product__print');

// product typs form
const formAddTypeOf = document.querySelector('.form--el__addtypeOf');
const formSearchTypeOf = document.querySelector('.form--search__typeOf');
const formEditTypeOf = document.querySelector('.form--el__edittypeOf');

// navbar
const menubar = document.querySelector('.navbar');
if (document.querySelector('.icon--res'))
  document.querySelector('.icon--res').addEventListener('click', function (e) {
    e.preventDefault();
    if (menubar.className === 'navbar') {
      menubar.className += ' responsive';
    } else {
      menubar.className = 'navbar';
    }
  });

//login Form

if (loginForm) {
  const btnLogin = document.querySelector('.login_btn');
  btnLogin.addEventListener('click', function (e) {
    e.preventDefault();

    const email = document.querySelector('.input_user_email').value;
    const password = document.querySelector('.input_password').value;
    auth.login(email, password);
  });
}

if (btnLogout) btnLogout.addEventListener('click', auth.logout);

if (formUpdateMe) {
  const forgot_passwindow = document.querySelector('.forgot_passwindow');
  const btnupdate = document.querySelector('.updateme_btn');
  const btnforgotpasslinks = document.querySelector('.links_forgot_password');
  const btnupdatePassword = document.querySelector('.update_password_btn');

  forgot_passwindow.style.display = 'none';

  btnupdate.addEventListener('click', function (e) {
    e.preventDefault();
    auth.updateMe();
  });

  btnforgotpasslinks.addEventListener('click', function (e) {
    e.preventDefault();
    auth.updatePassChangeWindow();
  });
  // auth;

  if (btnupdatePassword)
    btnupdatePassword.addEventListener('click', function (e) {
      e.preventDefault();
      auth.updatePassword();
    });
}

// Purchase
if (formAddPurchase) {
  // for auto amout sum
  const btnprice = document.querySelectorAll('#price');
  const btnquantity = document.querySelectorAll('#quantity');

  autoMultiply(btnprice, btnquantity);

  // i) Add new ledger and purchase element
  purchase.addpurchaseproductEement();

  // ii) Remove last one Ledger and purchase element
  purchase.removepurchaseproductElement();

  // iii) Save data new purchase
  purchase.saveNewpurchaseOrUpdate('new');
}

if (formSearchPurchase) {
  document.querySelectorAll('#date').forEach(
    (el) =>
      (el.textContent = new Date(el.textContent).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }))
  );

  const btnpurchaseEdit = document.querySelectorAll('.btn-edit');
  const btnpurchasePrint = document.querySelectorAll('.btn-print');
  const btnpurchaseDelete = document.querySelectorAll('.btn-delete');

  let purchaseId;

  // i) Eidt purchase Button
  btnpurchaseEdit.forEach((el) =>
    el.addEventListener('click', function (e) {
      e.preventDefault();
      purchaseId = e.target.parentElement.parentElement.dataset.purchaseid;

      purchase.searchedpurchaseToView(purchaseId);
    })
  );

  // ii) Delete Payment Button
  btnpurchaseDelete.forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      purchaseId = e.target.parentElement.parentElement.dataset.purchaseid;

      purchase.deletepurchase(purchaseId);
    });
  });

  // iii) Print Button

  btnpurchasePrint.forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      purchaseId = e.target.parentElement.parentElement.dataset.purchaseid;
      // console.log(purchaseId);
      purchase.printpurchase(purchaseId);
    });
  });
}

if (formEditPurchase) {
  // i) render Page
  purchase.renderViewPage();
  const btnprice = document.querySelectorAll('#price');
  const btnquantity = document.querySelectorAll('#quantity');

  autoMultiply(btnprice, btnquantity);

  // ii) deletePrevious item
  purchase.deleteRenderViewPageEl();

  // iii) Add new ledger and purchase element
  purchase.addpurchaseproductEement();

  // iv) Remove last one Ledger and purchase element
  purchase.removepurchaseproductElement();

  // v) Update purchase button
  purchase.saveNewpurchaseOrUpdate('update');
}

if (formPrintPurchase) purchase.renderPrint(formPrintPurchase);

// Sell
if (formAddSell) {
  // for auto amout sum
  const btnprice = document.querySelectorAll('#price');
  const btnquantity = document.querySelectorAll('#quantity');

  autoMultiply(btnprice, btnquantity);

  // i) Add new ledger and sell element
  sell.addsellproductEement();

  // ii) Remove last one Ledger and sell element
  sell.removesellproductElement();

  // iii) Save data new sell
  sell.saveNewsellOrUpdate('new');
}

if (formSearchSell) {
  document.querySelectorAll('#date').forEach(
    (el) =>
      (el.textContent = new Date(el.textContent).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }))
  );

  const btnsellEdit = document.querySelectorAll('.btn-edit');
  const btnsellPrint = document.querySelectorAll('.btn-print');
  const btnsellDelete = document.querySelectorAll('.btn-delete');

  let sellId;

  // i) Eidt sell Button
  btnsellEdit.forEach((el) =>
    el.addEventListener('click', function (e) {
      e.preventDefault();
      sellId = e.target.parentElement.parentElement.dataset.sellid;

      sell.searchedsellToView(sellId);
    })
  );

  // ii) Delete Payment Button
  btnsellDelete.forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      sellId = e.target.parentElement.parentElement.dataset.sellid;

      sell.deletesell(sellId);
    });
  });

  // iii) Print Button

  btnsellPrint.forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      sellId = e.target.parentElement.parentElement.dataset.sellid;
      // console.log(sellId);
      sell.printsell(sellId);
    });
  });
}

if (formEditSell) {
  // i) render Page
  sell.renderViewPage();
  const btnprice = document.querySelectorAll('#price');
  const btnquantity = document.querySelectorAll('#quantity');

  autoMultiply(btnprice, btnquantity);

  // ii) deletePrevious item
  sell.deleteRenderViewPageEl();

  // iii) Add new ledger and sell element
  sell.addsellproductEement();

  // iv) Remove last one Ledger and sell element
  sell.removesellproductElement();

  // v) Update sell button
  sell.saveNewsellOrUpdate('update');
}

if (formPrintSell) sell.renderPrint(formPrintSell);

//Product
if (formAddProduct) {
  const btnAdd = document.querySelector('#addproduct');
  btnAdd.addEventListener('click', function (e) {
    e.preventDefault();
    product.addProductToDB('new');
  });
}

if (formAllProduct) {
  const btnEdit = document.querySelectorAll('.btn-edit');
  const btnSearch = document.querySelectorAll('.btn-search');
  const btnDelete = document.querySelectorAll('.btn-delete');
  let productId;
  // 1) Rendering edit button page
  btnEdit.forEach((el) =>
    el.addEventListener('click', function (e) {
      e.preventDefault();
      productId =
        e.target.parentElement.parentElement.querySelector('#product').dataset
          .productid;
      product.editProduct(productId);
    })
  );

  // 2) Rendring search button page

  btnSearch.forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      productId =
        e.target.parentElement.parentElement.querySelector('#product').dataset
          .productid;
      product.searchproduct(productId);
    });
  });

  // Delete product button

  btnDelete.forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();

      productId =
        e.target.parentElement.parentElement.querySelector('#product').dataset
          .productid;
      product.deleteproduct(productId);
    });
  });
}

if (formEditProduct) {
  // i) rendering page
  product.renderEditPage(formEditProdut);

  // ii) updating after edit

  const btnUpdate = document.querySelector('.btn-update');
  btnUpdate.addEventListener('click', function (e) {
    e.preventDefault();

    product.addProductToDB('update');
  });
}

if (formSearchProduct) {
  const productData = JSON.parse(localStorage.getItem('productData'));
  const heading = document.querySelector('#headertext');
  const btnSearch = document.querySelector('#searchproduct');
  if (productData)
    heading.textContent = `Search data about ${productData.data.name} and fullfill information below`;

  btnSearch.addEventListener('click', function (e) {
    e.preventDefault();

    product.renderSearchproduct();
  });
}

if (formPrintProduct) product.renderPrint(formPrintProduct);

// Type Of product
if (formAddTypeOf) {
  const btnAdd = document.querySelector('#addtypeOf');
  btnAdd.addEventListener('click', function (e) {
    e.preventDefault();
    typeOfProduct.addtypeOfProductToDB('new');
  });
}

if (formSearchTypeOf) {
  const btnEdit = document.querySelectorAll('.btn-edit');
  const btnDelete = document.querySelectorAll('.btn-delete');
  let typeOfId;
  // 1) Rendering edit button page
  btnEdit.forEach((el) =>
    el.addEventListener('click', function (e) {
      e.preventDefault();
      typeOfId =
        e.target.parentElement.parentElement.querySelector('#typeof').dataset
          .typeofid;

      console.log(e.target.parentElement.parentElement);
      typeOfProduct.edittypeOfProduct(typeOfId);
    })
  );

  // Delete typeOf button

  btnDelete.forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();

      typeOfId =
        e.target.parentElement.parentElement.querySelector('#typeof').dataset
          .typeofid;
      typeOfProduct.deletetypeOf(typeOfId);
    });
  });
}

if (formEditTypeOf) {
  // i) rendering page
  typeOfProduct.renderEditPage(formEditTypeOf);

  // ii) updating after edit

  const btnUpdate = document.querySelector('.btn-update');
  btnUpdate.addEventListener('click', function (e) {
    e.preventDefault();

    typeOfProduct.addtypeOfProductToDB('update');
  });
}
