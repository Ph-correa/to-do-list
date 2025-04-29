//esperar o html carregar 
document.addEventListener("DOMContentLoaded", function () {
    //todo o codigo vem aqui
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");
    const filter = document.querySelectorAll(".filter");
    const toggleThemeBtn = document.getElementById("toggle-theme");



    //LocalStorage- Dados salvos no navegador
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let theme = localStorage.getItem("theme") || "light";


    if (theme === "dark") {
        document.body.classList.add("dark");
    }


    toggleThemeBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode")
        if (document.body.classList.contains("dark")) {
            theme = "dark";
        }
        else {
            theme = "light";
        }
        localStorage.setItem("theme", theme);
    });
    function saveTask() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    //funcao para mostrar tarefas na tela 
    function renderTask(filter) {
        if (filter === undefined)
            filter = "all";
        taskList.innerHTML = "";

        tasks.forEach(function (task, index) {
            if (filter === "pending" && task.completed) return;
            if (filter === "completed" && !task.completed) return;

            const li = document.createElement("li");

            if (task.completed === true) {
                li.className = "completed";
            } else {
                li.className = "";
            }

            li.innerHTML = `
                    <span class="task-text">${task.text}</span>
                    <button class ="edit"><img class="btnTask edit"src="assets/editar.png"></button>
                    <button class = "delete"><img class=""btnTask  delete"  src="assets/excluir.png"></button>
                `;


            li.addEventListener("click", function (e) {
                if (e.target.classList.contains("delete")) {
                    task.splice(index, 1);
                } else if (e.target.classList.contains("edit")) {
                    const newText = prompt("Editar tarefa:", task.text);
                    if (newText) task[index].text = newText;
                } else {
                    if (tasks[index].completed === true) {
                        tasks[index].completed = false;
                    } else {
                        tasks[index].completed = true;
                    }
                }
                saveTask();
                renderTask(filter);

            });

            taskList.appendChild(li);

        });
    };

    addTaskBtn.addEventListener("click",function(){
        const text = taskInput.value.trim();  //remove os espaços em branco
        if(text){
            tasks.push({text: text,completed: false})
            saveTask();
            renderTask(); //atualiza a lista
            taskInput.value = "";
        }
    });


    filter.forEach(function(button){
        button.addEventListener("click", function(){
            filter.forEach(function(btn) {
                btn.classList.remove("active");
            });
            button.classList.add("active");
            renderTask(button.dataset.filter);
        });
    });

    renderTask();

});