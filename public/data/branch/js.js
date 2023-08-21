// function merge_Arrays(left_sub_array, right_sub_array) {
//   let array = [];
//   while (left_sub_array.length && right_sub_array.length) {
//     if (left_sub_array[0] < right_sub_array[0]) {
//       array.push(left_sub_array.shift());
//       console.log(left_sub_array.shift());
//     } else {
//       array.push(right_sub_array.shift());
//     }
//   }
//   return [...array, ...left_sub_array, ...right_sub_array];
// }

// function merge_sort(unsorted_Array) {
//   const middle_index = unsorted_Array.length / 2;
//   if (unsorted_Array.length < 2) {
//     return unsorted_Array;
//   }
//   const left_sub_array = unsorted_Array.splice(0, middle_index);
//   return merge_Arrays(merge_sort(left_sub_array), merge_sort(unsorted_Array));
// }
// unsorted_Array = [5, 4, 32, 2, 245, 2123, 3, 31, 3, 5, 1, 1, 1];;
// console.log(merge_sort(unsorted_Array));
/*

const merge = (left, right) => {
  let arr = [];
  while (left.length && right.length) {
    if (left[0] < right[0]) {
      arr.push(left.shift());
    } else {
      arr.push(right.shift());
    }
  }

  return [...arr, ...left, ...right];
};

const devide = (arr) => {
  let midIndex = arr.length / 2;
  if (arr.length < 2) return arr;

  let left = arr.splice(0, midIndex);

  return merge(devide(left), devide(arr));
};

const array = [5, 4, 32, 2, 245, 2123, 3, 31, 3, 5, 1, 1, 1];
console.log(devide(array));



const noteCounter = (amount) => {
  let notes = [1000, 500, 100, 50, 10, 5, 2, 1];
  let notesCount = [0, 0, 0, 0, 0, 0, 0, 0];

  for (let i = 0; i < notesCount.length; i++) {
    if (amount >= notes[i]) {
      notesCount[i] = Math.floor(amount / notes[i]);
      amount = amount - notesCount[i] * notes[i];
    }
  }
  return notesCount;
};


const amount = prompt('Enter Amount: ');

const notes = noteCounter(amount);

console.log(1868);

console.log('Currency count\n');

console.log(`1000 ${notes[0]}`);
console.log(`500 ${notes[1]}`);
console.log(`100 ${notes[2]}`);
console.log(`50 ${notes[3]}`);
console.log(`10 ${notes[4]}`);
console.log(`5 ${notes[5]}`);
console.log(`2 ${notes[6]}`);
console.log(`1 ${notes[7]}`);


const arr = [1, '2', 3, 'a'];

if (Array.isArray(arr)) {
  console.log('This is an Array');
} else {
  console.log('This is not an Array');
}
*/

const baseNumber = baseNumber=> {
  return function (n) {
    return baseNumber + n
  }
}

const addNumber = baseNumber(10);

console.log(addNumber(2))
console.log(addNumber(22))


const confirmButton = document.getElementById('confirmButton');
const confirmationModal = document.getElementById('confirmationModal');
const confirmModalButton = document.getElementById('confirmModalButton');
const cancelModalButton = document.getElementById('cancelModalButton');

confirmButton.addEventListener('click', () => {
  confirmationModal.style.display = 'block';
});

cancelModalButton.addEventListener('click', () => {
  confirmationModal.style.display = 'none';
});

confirmModalButton.addEventListener('click', () => {
  // do something when the user confirms
  confirmationModal.style.display = 'none';
});
