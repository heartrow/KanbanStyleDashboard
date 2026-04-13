let tasks = [];
let tasksID = 1;

function createTaskCard (taskObj) {
    const li = document.createElement('li');
    li.id = `task-${taskObj.id}`;
    li.classList.add('task-card', `priority-${taskObj.priority.toLowerCase()}`);
    li.dataset.tasksID = taskObj.id;
}