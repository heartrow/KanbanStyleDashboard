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

function addTask(columnId, taskObj) {
    const list = document.querySelector(`#${columnId} ul`);
    const card = createTaskCard(taskObj);

    list.appendChild(card);
    updateCounter();
}

function deleteTask(taskId) {
    const el = document.querySelector(`[data-id='${taskId}']`);
    if(!el) return;

    el.classList.add('fade-out');

    setTimeout(() => {
        el.remove();
        tasks = tasks.filter(t => t.id !== taskId);
        updateCounter();
    }, 300)
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    editingId = taskId;

    document.getElementById('titleInput').value = task.title;
    document.getElementById('descInput').value = task.descriptions;
    document.getElementById('priority').value = task.priority;
    document.getElementById('dateInput').value = task.dueDate;

    document.getElementById('modal').classList.remove('hidden');
}

function updateTask(taskId, updatedData) {
    const task = tasks.find.find(t => t.id === taskId);
    if (!task) return;

    Object.assign(task, updatedData);

    const oldCard = document.querySelector(`[data-id='${taskId}']`);
    const newCard = createTaskCard(task);

    oldCard.replaceWith(newCard);
}

document.querySelectorAll('ul').forEach(list => {
    list.addEventListener('click', function(e) {

        const action = e.target.getAttribute('data-action');
        const id = e.target.getAttribute('data-id');

        if (!action || !id) return;

        const taskId = parseInt(id);

        if (action === 'delete') deleteTask(taskId);
        if(action === 'edit') editTask(taskId);
    });
});

document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentColumn = btn.getAttribute('data-column');
        editingId = null;
        document.getElementById('modal').classList.remove('hidden');
    });
});