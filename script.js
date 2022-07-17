const taskInput = document.querySelector(".task-input input");
const filters = document.querySelectorAll(".filters span");
const taskBox = document.querySelector(".task-box");
const clearAll = document.querySelector(".clear-btn");

let editId;
let isEditedTask = false;

//getting localstorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        btn.classList.add("active");
        showToDo(btn.id)
    });
});

function showToDo(filter) {
    let li = "";
    if(todos) {
        todos.forEach((todo, id) => {
            //if todo status is completed, set the isCompleted value to checked
            let isCompleted = todo.status === "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                li += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                                <p class="${isCompleted}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick="editTask(${id}, '${todo.name}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteTask(${id}, '${filter}')"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }

    taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
    //if there are no tasks disable clear all button, if there is at least one activate it
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    //if the height of the taskBox goes beyond 300px add a scroll
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
};

showToDo("all");

function showMenu(selectedTask) {
    //getting task menu div
    let taskMenu = selectedTask.parentElement.lastElementChild
    taskMenu.classList.add("show");
    document.addEventListener("click", (e) => {
        //removing show class from the task menu on the document click
        if(e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    });
};

function editTask(taskId, taskName) {
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
    taskInput.focus();
    taskInput.classList.add(".active");
};

function deleteTask(deleteId, filter) {
    isEditedTask = false;
    //removing seleceted task from todos
    todos.splice(deleteId, 1);
    //updating localStorage
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showToDo(filter);
};

clearAll.addEventListener("click", () => {
    isEditedTask = false;
    //removing all tasks from todos
    todos.splice(0, todos.length);
    //updating localStorage
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showToDo("all");
});

function updateStatus(selectedTask) {
    //getting paragraph that contains task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        //updating the status of the selecetd task to completed
        todos[selectedTask.id].status = "completed";
        //if we are in all stay in all if we are in pending stay in pending
        if(document.querySelector("span#all").classList.contains("active")) {
            showToDo("all");
        } else {
            showToDo("pending");
        }
    } else {
        taskName.classList.remove("checked");
        //updating the status of the selecetd task to pending
        todos[selectedTask.id].status = "pending";
        //if we are in all stay in all if we are in completed stay in completed
        if(document.querySelector("span#all").classList.contains("active")) {
            showToDo("all");
        } else {
            showToDo("completed");
        }
    }
    
    //updating localStorage
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

taskInput.addEventListener("keyup", (e) => {
    let userTask = taskInput.value.trim();
    if(e.key === "Enter" && userTask) { //userTask means != ""
        if(!isEditedTask) {
            if(!todos) { //non existent
                todos = [];
            }

            let taskInfo = {
                name: userTask,
                status: "pending", //by default
            };
    
            todos.push(taskInfo); //adding new task to todos 
        } else {
            isEditedTask = false;
            todos[editId].name = userTask;
        }

        taskInput.value = ""; //empty task input after adding a new task

        localStorage.setItem("todo-list", JSON.stringify(todos)); //updating localStorage
        //so that you stay in the category you were
        showToDo(document.querySelector("span.active").id);
    }
});