const button = document.getElementById("addTaskBtn");
const input = document.getElementById("task");
const list = document.getElementById("list");
button.addEventListener("click", addTask(input))
input.addEventListener("keydown", function(event){
    if (event.key == "Enter")
        addTask(input);
})

function addTask(input){
    if (input !== ""){
        const taskItem = document.createElement("li");
        taskItem.textContent = input;
    }
    

    list.appendChild(taskItem);
}