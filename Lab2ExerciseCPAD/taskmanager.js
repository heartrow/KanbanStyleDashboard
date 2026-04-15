/**
 * Global State
 */
let tasks = []; // Array of task objects
let taskCounter = 0;

/**
 * Task 2: createTaskCard(taskObj)
 * Returns a <li> element containing task details and action buttons.
 * Strictly uses DOM API methods.
 */
function createTaskCard(taskObj) {
    const li = document.createElement('li');
    li.setAttribute('data-id', taskObj.id);
    li.classList.add('task-card');

    // Title (Double-click functionality for Task 3)
    const title = document.createElement('h4');
    title.textContent = taskObj.title;
    title.classList.add('task-title-display');

    // Description
    const desc = document.createElement('p');
    desc.textContent = taskObj.description;

    // Priority Badge
    const priority = document.createElement('span');
    priority.textContent = taskObj.priority;
    priority.classList.add('badge', `badge-${taskObj.priority}`);

    // Due Date
    const dueDate = document.createElement('small');
    dueDate.textContent = `Due: ${taskObj.dueDate || 'No date'}`;

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('data-action', 'edit');
    editBtn.setAttribute('data-id', taskObj.id);

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('data-action', 'delete');
    deleteBtn.setAttribute('data-id', taskObj.id);

    // Assembly
    li.appendChild(title);
    li.appendChild(desc);
    li.appendChild(priority);
    li.appendChild(dueDate);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    return li;
}

/**
 * Task 2: addTask(columnId, taskObj)
 * Appends a new card to the target column and updates the counter.
 */
function addTask(columnId, taskObj) {
    const columnList = document.querySelector(`#${columnId} ul`);
    if (!columnList) return;

    // Add to global state
    tasks.push(taskObj);

    // Add to DOM
    const card = createTaskCard(taskObj);
    columnList.appendChild(card);

    // Update Counter
    updateTaskCounter();
}

/**
 * Task 2: deleteTask(taskId)
 * Adds fade-out animation and removes the card after it completes.
 */
function deleteTask(taskId) {
    const card = document.querySelector(`li[data-id="${taskId}"]`);
    if (!card) return;

    // Add CSS class for animation (defined in your CSS)
    card.classList.add('fade-out');

    // Wait for animation to finish before removing from DOM
    card.addEventListener('animationend', () => {
        card.remove();
        // Remove from global array
        tasks = tasks.filter(t => t.id !== taskId);
        updateTaskCounter();
    }, { once: true });
}

/**
 * Task 2: editTask(taskId)
 * Opens the modal and pre-fills it with task data.
 */
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const modal = document.getElementById('task-modal');
    
    // Fill form inputs
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-desc').value = task.description;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-date').value = task.dueDate;
    
    // Store the ID of the task being edited on the modal
    modal.setAttribute('data-editing-id', taskId);
    
    // Show Modal
    modal.classList.remove('is-hidden');
}

/**
 * Task 2: updateTask(taskId, updatedData)
 * Updates the global array and refreshes the card in the DOM.
 */
function updateTask(taskId, updatedData) {
    // Update data in array
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };

    // Update DOM (refreshing card content)
    const oldCard = document.querySelector(`li[data-id="${taskId}"]`);
    if (oldCard) {
        const newCard = createTaskCard(tasks[taskIndex]);
        oldCard.replaceWith(newCard);
    }
}

/**
 * Utility: Update Task Counter Badge
 */
function updateTaskCounter() {
    const counterBadge = document.getElementById('task-counter');
    if (counterBadge) {
        counterBadge.textContent = `Total Tasks: ${tasks.length}`;
    }
}

/**
 * Task 3: Initialization & Event Listeners
 */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('task-modal');
    const taskForm = document.getElementById('task-form');
    const filterSelect = document.getElementById('filter-priority');
    const clearDoneBtn = document.getElementById('clear-done-btn');

    // 1. Open Modal via "Add Task" buttons
    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            taskForm.reset();
            modal.removeAttribute('data-editing-id'); // Reset editing state
            modal.setAttribute('data-target-column', btn.getAttribute('data-column'));
            document.getElementById('modal-title-text').textContent = "Add New Task";
            modal.classList.remove('is-hidden');
        });
    });

    // 2. Modal Cancel Button
    document.getElementById('cancel-btn').addEventListener('click', () => {
        modal.classList.add('is-hidden');
    });

    // 3. Form Submission (Handle both Add and Update)
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const editingId = modal.getAttribute('data-editing-id');
        const updatedData = {
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-desc').value,
            priority: document.getElementById('task-priority').value,
            dueDate: document.getElementById('task-date').value
        };

        if (editingId) {
            updateTask(parseInt(editingId), updatedData);
        } else {
            const newTask = {
                id: Date.now(), // Simple unique ID
                ...updatedData
            };
            const colId = modal.getAttribute('data-target-column');
            addTask(colId, newTask);
        }
        
        modal.classList.add('is-hidden');
    });

    // 4. Event Delegation: Handle Edit/Delete inside <ul>
    const columnIds = ['todo-list', 'inprogress-list', 'done-list'];
    columnIds.forEach(id => {
        const list = document.getElementById(id);
        
        list.addEventListener('click', (event) => {
            const action = event.target.getAttribute('data-action');
            const taskId = parseInt(event.target.getAttribute('data-id'));
            
            if (action === 'delete') deleteTask(taskId);
            if (action === 'edit') editTask(taskId);
        });

        // 5. Inline Editing: Double-click title
        list.addEventListener('dblclick', (event) => {
            if (event.target.classList.contains('task-title-display')) {
                handleInlineEdit(event.target);
            }
        });
    });

    // 6. Priority Filter
    filterSelect.addEventListener('change', (e) => {
        const selectedPriority = e.target.value;
        const allCards = document.querySelectorAll('.task-card');

        allCards.forEach(card => {
            const taskId = parseInt(card.getAttribute('data-id'));
            const task = tasks.find(t => t.id === taskId);
            
            // Toggle visibility based on condition
            const shouldHide = selectedPriority !== 'all' && task.priority !== selectedPriority;
            card.classList.toggle('is-hidden', shouldHide);
        });
    });

    // 7. Clear Done: Staggered Fade-out
    clearDoneBtn.addEventListener('click', () => {
        const doneList = document.getElementById('done-list');
        const doneCards = Array.from(doneList.querySelectorAll('.task-card'));

        doneCards.forEach((card, index) => {
            setTimeout(() => {
                const taskId = parseInt(card.getAttribute('data-id'));
                deleteTask(taskId);
            }, index * 100); // 100ms delay per card
        });
    });
});

/**
 * Task 3 Helper: Inline Editing Logic
 */
function handleInlineEdit(titleElement) {
    const currentText = titleElement.textContent;
    const taskId = parseInt(titleElement.parentElement.getAttribute('data-id'));
    
    // Create input
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.classList.add('inline-edit-input');

    // Replace title with input
    titleElement.replaceWith(input);
    input.focus();

    const commitChange = () => {
        const newTitle = input.value.trim() || currentText;
        updateTask(taskId, { title: newTitle });
        // The UI refreshes via updateTask's replaceWith logic
    };

    input.addEventListener('blur', commitChange);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') commitChange();
    });
}