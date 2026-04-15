let tasks = [];
let currentEditId = null;

const noteCounterSpan = document.querySelector('.taskCounter');
const taskCard = document.getElementById(taskId);

function updateTaskCounter() {
    const count = tasks.length;
    noteCounterSpan.textContent = 
        count === 1 ? "1 note" : `${count} notes`;
}

function createTaskCard (taskObj) {
    const li = document.createElement("li");
    li.setAttribute('data-id', taskObj.id);
    li.classList.add("task-card");

    const title = document.createElement("h3");
    title.textContent = taskObj.title;
    li.appendChild(title);

    title.addEventListener("dblclick", function() {
        const currentText = title.textContent;

        const input = document.createElement("input");
        input.type = "text";
        input.value = currentText;
        input.classList.add("edit-input");

        title.replaceWith(input);
        input.focus();

        const saveInlineEdit = () => {
            const newTitle = input.value.trim();
            if (newTitle) {
                title.textContent = newTitle;

                const task = tasks.find(t => t.id === taskObj.id);
                if(task) task.title = newTitle;
            }
            input.replaceWith(title);
        };

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") saveInlineEdit();
        });

        input.addEventListener("blur", saveInlineEdit);
    });

    const desc = document.createElement("p");
    desc.textContent = taskObj.desc;
    li.appendChild(desc);

    const priority = document.createElement("span");
    priority.classList.add("badge");
    priority.classList.add("priority-" + taskObj.priority.toLowerCase());
    priority.textContent = taskObj.priority;
    li.appendChild(priority);

    const due = document.createElement("p");
    due.classList.add("due-date");
    due.textContent = "Due: " + taskObj.due;
    li.appendChild(due);

    //button container for styling
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("task-actions");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-button");
    editBtn.setAttribute('data-action', 'edit');
    editBtn.setAttribute('data-id', taskObj.id);
    editBtn.textContent = "Edit";
    btnContainer.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.setAttribute('data-action', 'delete');
    deleteBtn.setAttribute('data-id', taskObj.id)
    deleteBtn.textContent = "Delete";
    btnContainer.appendChild(deleteBtn);
    
    li.appendChild(btnContainer);
    return li;
}

function addTask (columnId, taskObj) {
    const column = document.getElementById(columnId);

    const taskList = column.querySelector("ul");

    const taskCard = createTaskCard(taskObj);

    taskList.appendChild(taskCard);

    updateTaskCounter();
}

function deleteTask (taskId) {
    const taskCard = document.querySelector(`[data-id="${taskId}"]`);

    if (!taskCard) return;

    taskCard.classList.add("fade-out");

    taskCard.addEventListener("animationend", function () {
        taskCard.remove();

        updateTaskCounter();
    });
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskDesc").value = task.desc;
    document.getElementById("priority").value = task.priority;
    document.getElementById("date").value = task.due;

    currentEditId = taskId;

    const modal = document.getElementById("modal");
    modal.classList.remove("hidden");
}

function updateTask(taskId, updatedData) {
    const taskIndex = tasks.find(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = {...tasks[taskIndex], ...updatedData}; //this start wiht the old tasks then overlay wiht new data (if have new attribute it will add the attribute)
    }

    const taskCard = document.querySelector(`[data-id]="${taskId}"`);
    if (!taskCard) return;

    taskCard.querySelector("h3").textContent = updatedData.title;
    taskCard.querySelector("p").textContent = updatedData.desc;

    const badge = taskCard.querySelector(".badge");
    badge.textContent = updatedData.priority;

    badge.className = "badge priority-" + updatedData.priority.toLowerCase();

    taskCard.querySelector(".due-date").textContent = "Due: " + updatedData.due;

    closeModal();
    currentEditId = null;
}

//Event Delegation
const todoList = document.querySelector('#todo ul');

todoList.addEventListener('click', function(event) {
    const target = event.target;

    const action = target.getAttribute('data-action');
    const taskId = target.getAttribute('data-id');

    if (!action || !taskId) return;

    if (action === 'delete') {
        deleteTask(taskId);
    } else if (action === 'edit') {
        editTask(taskId);
    }
});

