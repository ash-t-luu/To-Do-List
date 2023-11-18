import { addTaskApi, getTaskApi, deleteTaskApi, editTaskApi } from './api';

const list = document.querySelector('.list');
const parentContainer = document.querySelector('.todo-container');

const addBtn = document.querySelector('#add-task');

export async function fetchData() {
    const response = await getTaskApi();
    console.log(response, 'response');
    for (let i = 0; i < response.length; i++) {
        let li1 = document.createElement('li');
        li1.classList.add('task-name');

        const editTask1 = document.createElement('button');
        const deleteTask1 = document.createElement('button');

        deleteTask1.innerHTML = 'Delete';
        deleteTask1.classList.add('delete-task');
        deleteTask1.dataset.id = response[i].task_id;
        deleteTask1.addEventListener('click', handleDelete);

        editTask1.innerHTML = 'Edit';
        editTask1.classList.add('edit-task');
        // editTask.setAttribute('display', 'block');
        editTask1.dataset.id = response[i].task_id;
        editTask1.addEventListener('click', handleEdit);

        li1.textContent = response[i].task_name;
        li1.appendChild(editTask1);
        li1.appendChild(deleteTask1);
        list.appendChild(li1);
        parentContainer.style.display = 'block';
    }
}

// add functionalilty
async function addTask(e) {
    e.preventDefault();
    const input = document.getElementById('input-box');
    try {
        if (input.value === '') {
            alert('Empty Field!');
        } else {
            const response = await addTaskApi(input.value);
            let li = document.createElement('li');
            li.setAttribute('id', 'list-item');
            li.classList.add('task-name');
            const editTask = document.createElement('button');
            const deleteTask = document.createElement('button');

            editTask.setAttribute('id', 'list-item');
            // editTask.setAttribute('display', 'block');
            deleteTask.setAttribute('id', 'list-item');

            deleteTask.innerHTML = 'Delete';
            deleteTask.classList.add('delete-task');
            deleteTask.dataset.id = response[0].task_id;
            deleteTask.addEventListener('click', handleDelete);

            editTask.innerHTML = 'Edit';
            editTask.classList.add('edit-task');
            editTask.dataset.id = response[0].task_id;
            editTask.addEventListener('click', handleEdit);

            li.textContent = response[0].task_name;
            li.appendChild(editTask);
            li.appendChild(deleteTask);
            list.appendChild(li);
        }
    } catch (error) {
        console.error('Error:', error);
    }
    input.value = '';
};

// update functionality
export async function handleEdit(e) {
    if (e.target.classList.contains('edit-task')) {
        const selectedRow = e.target.parentElement;
        const row = selectedRow.firstElementChild.textContent;
        console.log('row', row);

        if (selectedRow) {
            let labelTxt = '';
            for (let i = 0; i < selectedRow.childNodes.length; i++) {
                const node = selectedRow.childNodes[i];
                if (node.nodeName === '#text') {
                    labelTxt += node.textContent.trim();
                }
            }
            console.log(labelTxt, 'lbltext');
            console.log(selectedRow, 'label');

            const taskId = e.target.nextElementSibling.dataset.id;

            const editInput = document.createElement('input');
            editInput.setAttribute('type', 'text');
            editInput.value = labelTxt;

            // labelTxt.style.display = 'none';
            e.target.style.display = 'none';
            selectedRow.appendChild(editInput);

            const saveButton = document.createElement('button');
            saveButton.innerHTML = 'Save';
            selectedRow.appendChild(saveButton);

            saveButton.addEventListener('click', async () => {
                const newTaskName = editInput.value;
                try {
                    await editTaskApi(taskId, newTaskName);
                    labelTxt.textContent = newTaskName;
                    e.target.style.display = 'block';
                    labelTxt.style.display = 'block';
                } catch (error) {
                    console.error('Error editing task: ', error);
                    labelTxt.style.display = 'block';
                    e.target.style.display = 'block';
                }
            });
        }
    } else {
        console.error("Label not found");
    }
};

// delete functionality
export async function handleDelete(e) {
    if (e.target.classList.contains('delete-task')) {
        const liEle = e.target.closest('li');
        if (liEle) {
            const taskId = e.target.dataset.id;
            await deleteTaskApi(taskId);
            liEle.remove();
        }
    }
};

addBtn.addEventListener('click', addTask);
