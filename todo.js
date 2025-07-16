//@author Amy Siby 
//@author Aleezah Showkat

const button = document.getElementById("addTaskBtn");
const input = document.getElementById("task");
const list = document.getElementById("list");
//let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

button.addEventListener("click", () => addTask(input.value));
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter")
        addTask(input.value);
});

function addTask(string) {
    //tasks.push(string);
    //localStorage.setItem("tasks", JSON.stringify(tasks));
    const taskItem = document.createElement("li");
    taskItem.textContent = string + "      ";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function () {
        list.removeChild(taskItem);
        //tasks.splice(index, 1);
        //localStorage.setItem("tasks", JSON.stringify(tasks));
        //loadTasks();
    };
    list.appendChild(taskItem);
    taskItem.appendChild(deleteBtn);
    input.value = "";
}
/*
function loadTasks(){
    list.innerHTML = "";
    tasks.forEach((taskText, index) => {
        const taskItem = document.createElement("li");
        taskItem.textContent = taskText + "      ";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = function(){
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            loadTasks();
        };
        list.appendChild(taskItem);
        taskItem.appendChild(deleteBtn);
    });
    }

window.onload = () => {
    loadTasks();
};
*/
