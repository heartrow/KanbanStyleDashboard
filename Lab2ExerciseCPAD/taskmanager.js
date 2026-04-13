let tasks = [];
let tasksID = 0;
let editingId = null;
let currentColumn = null;

function createTaskCard (taskObj) {
    const li = document.createElement('li');
    li.setAttribute('data-id', taskObj.id);
    li.classList.add('task-card');
    li.setAttribute('data-priority', taskObj.priority);

    const title = document.createElement('span');
    titletextContent = taskObj.title;
    title.classList.add('task-title');

    title.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.value = taskObj.title;

        input.addEventListener('blur', () => {
            taskObj.title = input.value;
            title.textContent = taskObj.title;
            li.replaceChild(title, input);
        });

        input.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') input.blur();
        });

        li.replaceChild(input, title);
    });

    const desc = document.createElement('p');
    desc.textContent = taskObj.description;

    const priority = document.createElement('span');
    priority.textContent = taskObj.priority;

    const date = document.createElement('small');
    date.textContent = taskObj.dueDate;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('data-action', 'edit');
    editBtn.setAttribute('data-id', taskObj.id);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('data-action', 'delete');
    deleteBtn.setAttribute('data-id', taskObj.id);

    li.appendChild(title);
    li.appendChild(desc);
    li.appendChild(priority);
    li.appendChild(date);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    return li;
}

function addTask(columnId, task) {
    const list = document.querySelector(`#${columnId} ul`);
    const card = createTaskCard(task);

    list.appendChild(card);
    updateCounter();
}