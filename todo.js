//@author Amy Siby
//@author Aleezah Showkat
//javascript file for to-do page
const button = document.getElementById("addTaskBtn");
const input = document.getElementById("task"); //type string
const list = document.getElementById("list");
list.style.listStyleType = 'none';
let tasks = [];
let taskStack = [];

button.addEventListener("click", () => addTask(input.value));
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter")
        addTask(input.value);
});

function addTask(string) {
    if (string.trim() != "") {
        const taskItem = document.createElement('li');

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        deleteBtn.style = "background-color:rgb(212, 169, 255); color: #280039;";
        deleteBtn.onclick = function () {
            list.removeChild(taskItem);
            taskStack.push(taskItem);
            saveTasks();
        };

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                taskItem.style.textDecoration = 'line-through';
            }
            else {
                taskItem.style.textDecoration = 'none';
            }
        })

        const taskText = document.createElement('span');
        taskText.textContent = string + '   ';

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteBtn);
        list.appendChild(taskItem);
        input.value = "";
        saveTasks();
    }
}

function saveTasks() {
    tasks = [];
    list.querySelectorAll('li').forEach(function (item) {
        tasks.push(item.firstChild.nextSibling.textContent);
    })

    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("taskStack", JSON.stringify(taskStack));
}

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    taskStack = JSON.parse(localStorage.getItem("taskStack")) || [];
    tasks.forEach(function (item) {
        addTask(item);
    })
}

loadTasks();

//undo btn
const undoBtn = document.getElementById("undoBtn");
undoBtn.addEventListener('click', function () {
    if (taskStack.length > 0) {
        addTask(taskStack.pop().firstChild.nextSibling.textContent);
    }
})

//clear btn
const clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener('click', function () {
    while (list.firstChild) {
        taskStack.push(list.firstChild.nextSibling);
        list.removeChild(list.firstChild).nextSibling;
        saveTasks();
    }
})