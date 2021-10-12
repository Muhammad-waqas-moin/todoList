// console.log(firebase);

let myTable = document.querySelector('#myTable');
let myForm = document.querySelector('#my_form');
let myInputFeild = document.querySelector('#input_task');
let mainAddButton = document.querySelector('#add_btn');
let mainUpdateButton = document.querySelector('#update_btn');
let current_row, current_row_id;
// let addButton = document.getElementById("#add_btn");
// let updateButton = document.getElementById("#update_btn");
let id_counter_for_newRow = 0;

function dynamicallyGenerateID() {
  let setIDToRow = 0;
  let rowSerialNumber = 1;
  let length_Table = document.querySelector('#myTable').rows.length;
  for (let index = 2; index < length_Table; index++) {
    document.querySelector('#myTable').rows[index].id = setIDToRow++;
    document.querySelector('#myTable').rows[index].firstChild.innerText = rowSerialNumber++;
  }
}

firebase
  .database()
  .ref('TODO')
  .on('child_added', function (data) {
    // console.log(data.val());

    // create new row
    let newRow = document.createElement('tr');
    //   newRow.setAttribute("id", id_counter_for_newRow++);
    let td_1 = document.createElement('td');
    let td_2 = document.createElement('td');
    let td_3 = document.createElement('td');

    // // set some attributes to td_1, td_2 and td_3
    td_1.setAttribute('class', 'text-center text-dark display-4');
    td_2.setAttribute('class', 'text-info display-4 ');
    //   td_2.setAttribute("");
    // td_2.innerText = input_value;
    td_2.innerText = data.val().todo_item;
    td_3.setAttribute('class', 'd-flex justify-content-around p-4');

    // // add edit and delete button on td_3
    let edit_button = document.createElement('button');
    edit_button.setAttribute('type', 'button');
    edit_button.setAttribute('class', 'btn btn-outline-info');
    edit_button.setAttribute('value', 'Edit');
    edit_button.setAttribute('id', data.val().key);
    edit_button.setAttribute('onclick', 'edit(this)');

    // // create icon for Edit button
    let edit_icon = document.createElement('i');
    edit_icon.setAttribute('class', 'fas fa-pencil fa-2x');

    // // add edit icon to edit button
    edit_button.appendChild(edit_icon);

    // //add edit button to td_3
    td_3.appendChild(edit_button);

    // // create delete button on td_3
    let delete_button = document.createElement('button');
    delete_button.setAttribute('type', 'button');
    delete_button.setAttribute('class', 'btn btn-outline-danger');
    delete_button.setAttribute('value', 'delete');
    delete_button.setAttribute('id', data.val().key);
    delete_button.setAttribute('onclick', 'delete_record(this)');

    // // create icon for delete button
    let delete_icon = document.createElement('i');
    delete_icon.setAttribute('class', 'fas fa-trash fa-2x');

    // // add delete icon to delete button
    delete_button.appendChild(delete_icon);

    // //add delete button to td_3
    td_3.appendChild(delete_button);

    // // add table data to new row
    newRow.appendChild(td_1);
    newRow.appendChild(td_2);
    newRow.appendChild(td_3);
    console.log(newRow);

    // // add newrow to table
    myTable.appendChild(newRow);
    dynamicallyGenerateID();
    clearInputFeild();
  });

myForm.addEventListener('submit', addNewRowTable);

function addNewRowTable(e) {
  let input_value = document.getElementById('input_task').value;
  let key = firebase.database().ref().push().getKey(); // create key
  // create object for firebase.
  let obj = {
    todo_item: input_value,
    key: key,
  };
  firebase.database().ref(`/TODO/${key}`).set(obj); // create ref and add obj into it.
  // firebase.database().ref(`/TODO`).child(key).set(obj);

  e.preventDefault();
}

function edit(e) {
  mainAddButton.setAttribute('class', 'd-none');
  mainUpdateButton.setAttribute('class', 'd-block  btn btn-outline-info');
  current_row = e.parentNode.parentNode;
  // current_row_id = current_row.id;
  current_row_id = e.id;
  let row_valueForEdit = current_row.childNodes[1].innerText;
  myInputFeild.value = row_valueForEdit;
}

function update_record() {
  let edit_obj = {
    todo_item: myInputFeild.value,
    key: current_row_id,
  };
  firebase.database().ref('TODO').child(current_row_id).set(edit_obj);
  current_row.childNodes[1].innerText = edit_obj.todo_item;
  // current_row.childNodes[1].innerText = myInputFeild.value;
  // console.log(edit_obj);

  // current_row.childNodes[1].innerText = firebase.database().ref();
  mainAddButton.setAttribute('class', 'd-block btn btn-outline-info');
  mainUpdateButton.setAttribute('class', 'd-none  ');
  console.log(current_row_id);

  clearInputFeild();
}

function delete_record(e) {
  console.log(e.id);
  firebase.database().ref('TODO').child(e.id).remove();
  current_row = e.parentNode.parentNode;
  current_row.remove();
  dynamicallyGenerateID();
}
function clearInputFeild() {
  myForm.reset();
}

