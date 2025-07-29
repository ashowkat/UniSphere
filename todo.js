//@author Amy Siby
//@author Aleezah Showkat
//javascript file for to-do page
const button = document.getElementById("addTaskBtn");
const input = document.getElementById("task"); //type string
const list = document.getElementById("list");
list.style.listStyleType = 'none';
let tasks = [];
let taskStack = [];
let checkBools = [];

loadTasks();
document.addEventListener('visibilitychange', function () {
    if (!document.hidden)
        loadTasks();
})

button.addEventListener("click", () => addTask(input.value));
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter")
        addTask(input.value);
});

function addTask(string, bool = undefined) {
    if (string.trim() != "") {
        const taskItem = document.createElement('li');

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        deleteBtn.style = "background-color:rgb(212, 169, 255); color: #280039;";
        deleteBtn.onclick = function () {
            list.removeChild(taskItem);
            taskStack.push(taskItem);
            checkBools.push(checkbox.checked);
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
            saveTasks();
        })

        if (bool !== undefined) {
            if (bool) {
                checkbox.checked = true;
                taskItem.style.textDecoration = 'line-through';
            }
            else {
                checkbox.checked = false;
                taskItem.style.textDecoration = 'none';
            }
        }

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
    checkBools = [];
    list.querySelectorAll('li').forEach(function (item) {
        tasks.push(item.firstElementChild.nextElementSibling.textContent.trim());
        checkBools.push(item.firstElementChild.checked);
    })

    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("taskStack", JSON.stringify(taskStack));
    localStorage.setItem("checkBools", JSON.stringify(checkBools));
}

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    taskStack = JSON.parse(localStorage.getItem("taskStack")) || [];
    let checkBoolsOne = JSON.parse(localStorage.getItem("checkBools")) || [];
    tasks.forEach(function (item, i) {
        if (checkBoolsOne[i] === undefined) {
            addTask(item.trim(), false)
        }
        else {
            addTask(item.trim(), checkBoolsOne[i]);
        }
    })
}

//undo btn
const undoBtn = document.getElementById("undoBtn");
undoBtn.addEventListener('click', function () {
    if (taskStack.length > 0) {
        obj = taskStack.pop()
        addTask(obj.firstElementChild.nextElementSibling.textContent, obj.firstElementChild.checked);
        checkBools.pop();
    }
})

//clear btn
const clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener('click', function () {
    while (list.firstElementChild) {
        let li = list.firstElementChild
        taskStack.push(li);
        checkBools.push(li.firstElementChild.checked);
        list.removeChild(li);
    }
    saveTasks();
})