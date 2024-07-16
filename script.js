
        document.addEventListener('DOMContentLoaded', () => {
            loadTasks();
            setupAddToHomeScreen();
        });

        const addTaskButton = document.getElementById('add-task-button');
        const taskList = document.getElementById('task-list');
        const newTaskInput = document.getElementById('new-task');
        const addToHomeScreenButton = document.getElementById('add-to-home-screen-button');

        addTaskButton.addEventListener('click', addTask);
        newTaskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });

        function addTask() {
            const taskText = newTaskInput.value.trim();
            if (taskText === '') return;

            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <span>${taskText}</span>
                <div>
                    <button class="complete-button" onclick="completeTask(this)">Complete</button>
                    <button class="edit-button" onclick="editTask(this)">Edit</button>
                    <button onclick="deleteTask(this)">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
            li.scrollIntoView({ behavior: 'smooth' });
            saveTasks();
            newTaskInput.value = '';
        }

        function completeTask(button) {
            const li = button.parentElement.parentElement;
            li.classList.toggle('completed');
            saveTasks();
        }

        function editTask(button) {
            const li = button.parentElement.parentElement;
            const span = li.querySelector('span');
            const currentText = span.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.className = 'edit-input';

            span.replaceWith(input);
            input.focus();

            input.addEventListener('blur', () => {
                const newText = input.value.trim();
                if (newText === '') {
                    deleteTask(button);
                } else {
                    span.textContent = newText;
                    input.replaceWith(span);
                    saveTasks();
                }
            });

            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });
        }

        function deleteTask(button) {
            const li = button.parentElement.parentElement;
            taskList.removeChild(li);
            saveTasks();
        }

        function saveTasks() {
            const tasks = [];
            document.querySelectorAll('.task-item').forEach(task => {
                tasks.push({
                    text: task.querySelector('span').textContent,
                    completed: task.classList.contains('completed')
                });
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        function loadTasks() {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = 'task-item';
                if (task.completed) li.classList.add('completed');
                li.innerHTML = `
                    <span>${task.text}</span>
                    <div>
                        <button class="complete-button" onclick="completeTask(this)">Complete</button>
                        <button class="edit-button" onclick="editTask(this)">Edit</button>
                        <button onclick="deleteTask(this)">Delete</button>
                    </div>
                `;
                taskList.appendChild(li);
            });
        }

        function setupAddToHomeScreen() {
            let deferredPrompt;

            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                addToHomeScreenButton.style.display = 'block';
                addToHomeScreenButton.addEventListener('click', addToHomeScreen);
            });

            function addToHomeScreen() {
                addToHomeScreenButton.style.display = 'none';
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                        openInPiP();
                    } else {
                        console.log('User dismissed the A2HS prompt');
                    }
                    deferredPrompt = null;
                });
            }

            function openInPiP() {
                if ('pictureInPictureEnabled' in document) {
                    const videoElement = document.querySelector('.container');
                    videoElement.requestPictureInPicture()
                        .then(() => {
                            console.log('Entered Picture-in-Picture');
                        })
                        .catch(error => {
                            console.error('Error entering Picture-in-Picture:', error);
                        });
                } else {
                    console.log('Picture-in-Picture is not supported');
                }
            }
        }

        // Toggle Settings Panel
        function toggleSettingsPanel() {
            var panel = document.getElementById('settings-panel');
            panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
        }

        // Change Font Color
        function changeFontColor(color) {
            document.body.style.color = color;
        }

        // Change Background Color
        function changeBackgroundColor(color) {
            document.body.style.backgroundColor = color;
        }

        // Change Font Family
        function changeFontFamily(font) {
            document.body.style.fontFamily = font;
        }
