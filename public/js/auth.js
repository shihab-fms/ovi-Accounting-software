import axios from 'axios';
import { showAlert, showModal } from './alart';

export const login = async (email, password) => {
  // console.log(email, password);

  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/api/v1/user/login',
      data: {
        email,
        password,
      },
    });
    // console.log(res.data);

    if (res.data.status === 'success') {
      showAlert('success', 'Log in successfull!....');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:5000/api/v1/user/logout',
    });
    if (res.data.status === 'success')
      showAlert('success', 'Logged out successful');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  } catch (err) {
    console.log(err.response.data.message);
    showAlert('error', 'Your are not logged in! Please try again...');
  }
};

export const updateMe = async () => {
  try {
    const email = document.querySelector('.input_user_email').value;
    const name = document.querySelector('.input_user_name').value;
    const id = document.querySelector('.input_user_name').dataset.userid;
    console.log(email, name, id);
    const res = axios({
      method: 'POST',
      url: `http://127.0.0.1:5000/api/v1/user/updateUser/${id}`,
      data: {
        name,
        email,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'successfully updated!');
      window.setTimeout(() => {
        location.assign('/');
      }, 2000);
    }
  } catch (err) {
    console.log(err.response);
    // showAlert('error', err.response.data.message);
  }
};

export const updatePassChangeWindow = () => {
  const forgot_passwindow = document.querySelector('.forgot_passwindow');
  const btnforgotpasslinks = document.querySelector('.links_forgot_password');

  showModal();
  const cancelModalButton = document.getElementById('cancelModalButton');
  const confirmModalButton = document.getElementById('confirmModalButton');

  // for cancling
  cancelModalButton.addEventListener('click', () => {
    document.getElementById('confirmationModal').style.display = 'none';
  });

  confirmModalButton.addEventListener('click', function () {
    document.getElementById('confirmationModal').style.display = 'none';
    btnforgotpasslinks.style.display = 'none';
    forgot_passwindow.style.display = 'block';
    if (document.querySelector('.form_container'))
      document.querySelector('.form_container').style.display = 'none';

    // const btnupdatePassword = document.querySelector('.update_password_btn');
  });
};

export const updatePassword = () => {
  try {
    const passwordCurrent = document.querySelector(
      '.input_user_pssword_old'
    ).value;
    const password = document.querySelector('.input_user_pssword_new').value;
    const id = document.querySelector('.input_user_name').dataset.userid;

    const res = axios({
      url: `http://127.0.0.1:5000/api/v1/user/updatePass/${id}`,
      method: 'POST',
      data: {
        id,
        password,
        passwordCurrent,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'password successfully updated!');
      window.setTimeout(() => {
        location.assign('/');
      }, 2000);
    }
  } catch (err) {
    console.log(err);
  }
};
