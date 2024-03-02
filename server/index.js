getTask();
function getMessage() {
    const inputElement = document.querySelector('.input-box')
    const dateTimeElement = document.querySelector('.add-date-time')
    const inputElementValue = inputElement.value
    const dateTimeElementValue = dateTimeElement.value
    inputElement.value = ''
    dateTimeElement.value = ''
    const json_data = {
        'message': inputElementValue,
        'datetime' : dateTimeElementValue,
        'status': 0
    }
    fetch('/submit_form',{
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json_data)
    })        
    getTask();
}

function getTask(){
    fetch('/submit_form',{
        headers: {
            'Content-Type': 'application/json'
        },
    })  
    .then(response => response.text())
    .then(data => {
        document.getElementById('result').innerHTML = data;
        allEventListeners();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function allEventListeners(){
    const deleteButton = document.querySelectorAll('.delete-button')
    const checkButton = document.querySelectorAll('.check-button')
    const editButton = document.querySelectorAll('.edit-button')
    const doneButton = document.querySelectorAll('.done-button')

    deleteButton.forEach(button => {
        button.addEventListener('click', deleteTask)
    });

    checkButton.forEach(button => {
        button.addEventListener('click', checkTask)
    });

    editButton.forEach(button => {
        button.addEventListener('click', editTask)
    });

    doneButton.forEach(button => {
        button.addEventListener('click', doneEditing)
    });
}

function editTask(event){
    // const editButtonId = event.currentTarget.dataset.editId;
    const editButton = document.querySelector('.edit-button');
    const doneButton = document.querySelector('.done-button');
    const taskCard = document.querySelectorAll('.task-card');
    taskCard.forEach(card => {
        card.setAttribute('contentEditable', 'true');
    });
    doneButton.style.display = 'inline-block';
    editButton.style.display = 'none';
    // console.log("Edit", editButtonId)
    // console.log("Done",doneButton)
    
    // const jsonFormat = {
    //     'message' : editButtonId
    // }
    
    // fetch('/edit-form', {
    //     method : 'POST',
    //     headers : {
    //         'Content-Type' : 'application/json'
    //     },
    //     body : JSON.stringify(jsonFormat)
    // })
    // .then(() => getTask())
    // .catch(error => {
    //     console.error('Error:', error);
    // });
}

function deleteTask(event){
    const deleteButtonId = event.currentTarget.dataset.deleteId;
    const jsonFormat = {
        'message' : deleteButtonId
    }
    fetch('/delete-form', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(jsonFormat)
    })
    .then(() => getTask())
    .catch(error => {
        console.error('Error:', error);
    });
}

function checkTask(event){
    const checkButtonId = event.currentTarget.dataset.checkId;
    const jsonFormat = {
        'message' : checkButtonId
    }
    fetch('/update-status', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(jsonFormat)
    })
    .then(() => getTask())
    .catch( error => {
        console.error('Error 404:', error);
    });
}

function doneEditing(event) {
    const taskId = event.currentTarget.dataset.editId;
    // console.log("task id",  taskIdToEdit);
    const editButton = document.querySelector('.edit-button');
    const doneButton = document.querySelector('.done-button');
    const taskCard = document.querySelector('.task-card');
    doneButton.style.display = 'none';
    editButton.style.dispaly = 'none';
    taskCard.contentEditable  = false;

    const editedTask = taskCard.innerText.trim()
    const jsonFormat = {
        'message' : taskId,
        'key' : editedTask
    }
    
    fetch('/edit-form', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(jsonFormat)
    })
    .then(() => getTask())
    .catch(error => {
        console.error('Error:', error);
    });
}