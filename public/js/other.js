import axios from 'axios';
import { showAlert, showModal } from './alert';

// Others Nav bars functionalilly
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////

// i) get data for view modal windows
const getAll = async (apiKey) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/${apiKey}s/all`,
    });
    if (res.data.status === 'success') {
      return res.data.data;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// ii) for creating new item or unit in DB modal windows

const saveNewOrUpdate = async (apiKey, type) => {
  try {
    const method = type === 'new' ? 'POST' : 'PATCH';
    const url =
      type === 'new'
        ? `http://127.0.0.1:3000/api/v1/${apiKey}s/newOne`
        : `http://127.0.0.1:3000/api/v1/${apiKey}s/update`;
    const name = document.getElementById(`name--${apiKey}`).value;
    const res = await axios({
      method,
      url,
      data: {
        name,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type} ${apiKey} seccessfully`);
      viewModal(apiKey);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

/*
const hoverAndEdit = (nameModal) => {
  const items = document.querySelectorAll(`#name--${nameModal}`);
  items.forEach((el) => {
    el.addEventListener('mouseover', function (e) {
      // if (document.querySelectorAll('.edit--option').length < 1) {
      // }
      document.querySelectorAll('.edit--option').forEach((el) => el.remove());
      const markup = `
        <div class="edit--option">
          <btton class="btn btn-info" id="btn-edit-panal">Edit</btton>
          <btton class="btn btn-dark btn-delete-panal">Delete</btton>
        </div>
      `;

      e.target.insertAdjacentHTML('afterend', markup);
    });
  });
};

const editPanel = (nameModal) => {
  if (document.querySelectorAll('.edit--option')) {
    const btnEdits = document.querySelectorAll(`.btn-delete-panal`);
    // console.log(btnEdits);
    btnEdits.forEach((el) => {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        const id = this.parentElement;
        console.log(id);
      });
    });
  }
};

*/

// iii)for vewing items or unit from DB
const viewModal = async (nameModal) => {
  const data = await getAll(nameModal);
  const bodyNewEl = document.querySelector('.modal-content');
  if (document.querySelector('.form-modal'))
    document.querySelector('.form-modal').remove();
  if (document.querySelectorAll('.form-modal').length <= 1) {
    const viewMarkup = `
        <div class="view form--table" style="width: 95%;">
          <div class="row align-content-center">
            <div class="col-md d-flex justify-content-center" >
              <form
                action=""
                class="form form-modal form-group m-3 px-3 mt-5 b-2 border border-danger"
              >
                <p>View ${nameModal}</p>
                ${data.data
                  .map(
                    (el) =>
                      `<input type="text" data-${nameModal}id="${el._id}" value="${el.name}" readonly placeholder="name" required id="name--${nameModal}" class="form-control m-1" />`
                  )
                  .join(' ')}                
              </form>
            </div>
          </div>
        </div> 
    `;

    bodyNewEl.insertAdjacentHTML('beforeend', viewMarkup);

    // hoverAndEdit(nameModal);

    // editPanel(nameModal);
  }
};

// iv) for saving or updating
const newModal = (nameModal) => {
  const bodyNewEl = document.querySelector('.modal-content');
  if (document.querySelector('.form-modal'))
    document.querySelector('.form-modal').remove();
  if (document.querySelectorAll('.form-modal').length <= 1) {
    const createMarkup = `
      <div class="form-modal create form--table" style="width: 95%;">
        <div class="row align-content-center">
          <div class="col-md d-flex justify-content-center" >
            <form
              action=""
              class="form form-group m-3 px-3 mt-5 b-2 border border-danger"
            >
              <div class="ledger--info">
                <label for="ledgername"  class="mb-0 m-1 form-label text-wrap"
                  >Create New ${nameModal}*:</label
                >
                <input type="text" placeholder="name" required id="name--${nameModal}" class="form-control m-1" />
                <button class="m-3 btn btn-info btn-save">Save</button>
            </form>
          </div>
        </div>
      </div> 
      `;
    bodyNewEl.insertAdjacentHTML('beforeend', createMarkup);

    const btnSave = document.querySelector('.btn-save');
    btnSave.addEventListener('click', function (e) {
      e.preventDefault();
      saveNewOrUpdate(nameModal, 'new');
    });
  }
};

// v) for items of Nav Bar
export const showModalItem = (modalItem) => {
  const markup = `
    <div id="confirmationModal" class="modal">
      <div class="modal-content">
        <div class="row">
          <button style="width: auto" class="btn btn-danger m-3" id="cancelModalButton">Cancel Window ❌</button>
        </div>
        <div class="row">
          <p>${modalItem} Pannel</p>
        </div>
        <div class="row">
          <button class="col btn btn-primary m-3" id="btn-create">Create</button>
          <button class="col btn btn-danger m-3" id="btn-view">View</button>
        </div>
      </div>
    </div>
  `;
  document.querySelector('body').insertAdjacentHTML('beforeend', markup);
  document.getElementById('confirmationModal').style.display = 'block';

  const btnCreate = document.getElementById('btn-create');
  const btnView = document.getElementById('btn-view');
  const cancelModalButton = document.getElementById('cancelModalButton');

  // close modal
  // console.log(cancelModalButton);
  cancelModalButton.addEventListener('click', function () {
    // console.log(document.querySelector('.modal'));
    document.getElementById('confirmationModal').remove();
  });
  // Creating new item in this Modal
  btnCreate.addEventListener('click', function (e) {
    e.preventDefault();
    newModal(modalItem);
  });

  // view item in this modal
  btnView.addEventListener('click', function (e) {
    e.preventDefault();
    viewModal(modalItem);
  });
};

// <div class="btn-close-modal" id="cancelModalButton"><button>X</button></div>
