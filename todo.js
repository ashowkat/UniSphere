//@author Amy Siby 
//@author Aleezah Showkat

const button = document.getElementById("addTaskBtn");
const input = document.getElementById("task");
const list = document.getElementById("list");
let taskStack = [];

button.addEventListener("click", () => addTask(input.value));
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter")
        addTask(input.value);
});

function addTask(string) {
    if (string.trim() != ""){
        const taskItem = document.createElement("li");
        taskItem.textContent = string.trim() + "      ";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style = "background-color:rgb(212, 169, 255); color: #280039;";
        deleteBtn.onclick = function () {
            list.removeChild(taskItem);
            list.removeChild(checkbox);
            taskStack.push(taskItem);
            saveTasks();
        };

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change',function(){
            if (checkbox.checked){
                taskItem.style.textDecoration = 'line-through';
            }
            else{
                taskItem.style.textDecoration = 'none';
            }
        });

        taskItem.prepend(checkbox);
        list.appendChild(taskItem);
        taskItem.appendChild(deleteBtn);
        saveTasks();
        input.value = "";
    }
}

function saveTasks(){
    let tasks = [];
    list.querySelectorAll('li').forEach(function(item){
        tasks.push(item.textContent.replace('Delete','').trim());
    });

    localStorage.setItem("tasks",JSON.stringify(tasks));
    localStorage.setItem("taskStack", JSON.stringify(taskStack));
}

function loadTasks(){
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    taskStack = JSON.parse(localStorage.getItem("taskStack")) || [];
    tasks.forEach(function(item){
        const taskItem = document.createElement("li");
        taskItem.textContent = item.trim() + "      ";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style = "background-color:rgb(212, 169, 255); color: #280039;";
        deleteBtn.onclick = function () {
            list.removeChild(taskItem);
            list.removeChild(checkbox);
            saveTasks();
        };

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        if (taskItem.checkbox.checked){
            checkbox.checked = true;
            taskItem.style.textDecoration = 'line-through';
        }
        
        checkbox.addEventListener('change',function(){
            if (checkbox.checked){
                taskItem.style.textDecoration = 'line-through';
            }
            else{
                taskItem.style.textDecoration = 'none';
            }
        });

        taskItem.prepend(checkbox);
        list.appendChild(taskItem);
        taskItem.appendChild(deleteBtn);
    });
}

loadTasks();

//Undo Button
const undoBtn = document.getElementById("undoBtn");

undoBtn.addEventListener('click', () => undo())

function undo(){
    if (taskStack.length > 0)
        addTask(taskStack.pop().textContent.replace("Delete",""));
}