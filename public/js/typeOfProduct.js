import axios from 'axios';
import { showAlert, showModal } from './alart';

export const addtypeOfProductToDB = async (types) => {
  try {
    const name = document.querySelector('#typeOfname').value;

    const id =
      types === 'update'
        ? document.querySelector('.typeofid').dataset.typeofid
        : '';
    console.log(id);
    const method = types === 'new' ? 'POST' : 'PATCH';

    const url =
      types === 'new'
        ? 'http://127.0.0.1:5000/api/v1/typeOf/createOne'
        : `http://127.0.0.1:5000/api/v1/typeOf/updateOne/${id}`;

    const res = await axios({
      method,
      url,
      data: {
        name,
      },
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        showAlert('success', `${types} Type of product added successfully...`);
        location.assign('/searchTypeOf');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const edittypeOfProduct = async (id) => {
  console.log(id);
  try {
    const res = await axios({
      url: `http://127.0.0.1:5000/api/v1/typeOf/getone/${id}`,
      method: 'GET',
    });
    if (res.data.status === 'success') {
      localStorage.clear();
      localStorage.setItem('typeOfProductData', JSON.stringify(res.data.data));

      showAlert('success', `Going for edit typeOf`);
      window.setTimeout(() => {
        location.assign('/editTypeOf');
      });
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const renderEditPage = (edittypeOfForm) => {
  const typeOfProdutData = JSON.parse(
    localStorage.getItem('typeOfProductData')
  );

  const markup = `
         <form
            action=""
            class="form form__edit--typeOf form-group m-3 px-3 mt-5 b-2 border border-danger"
          >
            <h2 class="text-center form-text">
              Updating product type *: you must need another Name*.
            </h2>
            <div class="typeOf--info">
              <label for="typeOfname" data-typeOfid="${typeOfProdutData.data._id}" class="mb-0 m-1 form-label typeOfId text-wrap"
                >Name of typeOf*:</label
              >
              <input type="text" value="${typeOfProdutData.data.name}" required id="typeOfname" class="form-control m-1" />
            <button class="m-3 btn btn-update btn-info">Update</button>
          </form> 
  `;

  edittypeOfForm.insertAdjacentHTML('afterbegin', markup);
};

export const deletetypeOf = async (id) => {
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
        url: `http://127.0.0.1:5000/api/v1/typeOf/deleteOne/${id}`,
      });

      showAlert('success', 'Data deleted successfully');
      window.setTimeout(() => {
        location.assign('/searchtypeof');
      });
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  });
};
