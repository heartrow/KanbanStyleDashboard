let tasks = [];

const noteCounterSpan = document.querySelector('.taskCounter');
const 

function updateTaskCounter() {
    const count = tasks.length;
    noteCounterSpan.textContent = 
        count === 1 ? "1 note" : `${count} notes`;
}

function createTaskCard (taskObj) {
    const li = document.createElement("li");
    li.classList.add("task-card");

    const title = document.createElement("h3");
    title.textContent = taskObj.title;
    li.appendChild(title);

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
    // sepatutnye ade id 
    editBtn.textContent = "Edit";
    btnContainer.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    //sepatutnye ade id
    deleteBtn.textContent = "Delete";
    btnContainer.appendChild(deleteBtn);
    
    li.appendChild(btnContainer);
}

function addTask (columnId, taskObj) {
    
}