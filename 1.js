document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const tasksList = document.getElementById('tasksList');
    const tasksCount = document.getElementById('tasksCount');
    
    let tasks = [];
    
    // Загрузка задач из localStorage при загрузке страницы
    loadTasks();
    
    // Обработчик отправки формы
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Проверка валидности формы
        if (!taskTitle.value.trim()) {
            alert('Пожалуйста, введите название задачи');
            taskTitle.focus();
            return;
        }
        
        // Создание новой задачи
        const newTask = {
            id: Date.now(),
            title: taskTitle.value.trim(),
            description: taskDescription.value.trim(),
            date: new Date().toLocaleDateString('ru-RU')
        };
        
        // Добавление задачи в массив
        tasks.push(newTask);
        
        // Сохранение в localStorage
        saveTasks();
        
        // Обновление интерфейса
        renderTasks();
        
        // Сброс формы
        taskForm.reset();
        taskTitle.focus();
    });
    
    // Функция рендеринга задач
    function renderTasks() {
        if (tasks.length === 0) {
            tasksList.innerHTML = `
                <div class="empty-state">
                    <p>У вас пока нет задач</p>
                    <p>Добавьте первую задачу с помощью формы выше</p>
                </div>
            `;
            tasksCount.textContent = '0 задач';
            return;
        }
        
        tasksList.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-card';
            taskElement.innerHTML = `
                <div class="task-header">
                    <h3 class="task-title">${task.title}</h3>
                    <div class="task-actions">
                        <button class="btn-delete" data-id="${task.id}">×</button>
                    </div>
                </div>
                ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                <div style="margin-top: 10px; font-size: 0.8rem; color: #888;">Добавлено: ${task.date}</div>
            `;
            tasksList.appendChild(taskElement);
        });
        
        // Обновление счетчика задач
        updateTasksCount();
        
        // Добавление обработчиков для кнопок удаления
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function() {
                const taskId = parseInt(this.getAttribute('data-id'));
                deleteTask(taskId);
            });
        });
    }
    
    // Функция удаления задачи
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
    
    // Функция обновления счетчика задач
    function updateTasksCount() {
        const count = tasks.length;
        let text = '0 задач';
        
        if (count === 1) {
            text = '1 задача';
        } else if (count > 1 && count < 5) {
            text = `${count} задачи`;
        } else if (count >= 5) {
            text = `${count} задач`;
        }
        
        tasksCount.textContent = text;
    }
    
    // Функция сохранения задач в localStorage
    function saveTasks() {
        localStorage.setItem('dailyPlannerTasks', JSON.stringify(tasks));
    }
    
    // Функция загрузки задач из localStorage
    function loadTasks() {
        const savedTasks = localStorage.getItem('dailyPlannerTasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            renderTasks();
        }
    }
});