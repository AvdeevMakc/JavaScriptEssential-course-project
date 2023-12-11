let taskNameInput = document.querySelector("#taskNameInput");
let addTaskButton = document.querySelector("#addTaskBtn");
let startMessageToDoList = document.querySelector("#startMessageToDoList");
let tasksFilter = document.querySelector("#tasksFilter");
let taskList = document.querySelector(".to-do-list__task-list");
let delAllTaskBtn = document.querySelector("#delAllTaskBtn");
let taskDateInput = document.querySelector("#taskDateInput");  // дата введенная пользователем
let changeTask = document.querySelector(".changeTask");

// новый блок
let taskNameInputNew = document.querySelector("#taskNameInputNew");
let taskDateInputNew = document.querySelector("#taskDateInputNew");
let addTaskBtnNew = document.querySelector("#addTaskBtnNew");
let taskCheckedNew = document.querySelector("#taskCheckedNew");

addTaskButton.addEventListener("click", addTaskHandler);
taskNameInput.addEventListener("keydown", function (e) {
    if (e.code == "Enter") addTaskHandler();
});

let dataService = {
    tasks: [],

    get allTasks() {
        return this.tasks;
    },

    get notCompletedTasks() {
        return this.tasks.filter(task => task.isDone == false);
    },

    get completedTasks() {
        return this.tasks.filter(task => task.isDone == true);
    },

    add(task) {
        this.tasks.push(task);
        this.save();
    },

    save() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },

    open() {
        this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    },

    delete(task) {
        let index = this.tasks.indexOf(task);
        this.tasks.splice(index, 1);
        this.save();
    },

    deleteAll() {
        localStorage.clear();
        this.tasks = [];
    },

    rename(task) {
        // console.log(task);
        changeTask.style.display = "block";
        let index = this.tasks.indexOf(task);
        taskNameInputNew.value = this.tasks[index].text;
        taskDateInputNew.value = this.tasks[index].date;
        if (this.tasks[index].isDone) taskCheckedNew.checked = true;
        else taskCheckedNew.checked = false;
        this.delete(task);
        // let newTask = prompt("введите новое задание");
        // if (!newTask) return;
        // this.tasks[index].text = newTask;
        this.save();
        taskListView.drawAll();
    }
}

class Task {
    constructor(text, date, isDone = false) {
        this.text = text;
        this.date = date;
        this.isDone = isDone;
    }
}

class TaskListView {
    element;
    dataService;

    constructor(element) {
        this.element = element;
        this.dataService = dataService;
    }

    #drawList(tasksElements) {
        this.element.innerHTML = "";

        tasksElements.forEach(taskElement => {
            taskElement.createIn(this.element)
        });
    }

    drawAll() {
        let taskElements = [];
        let tasks = dataService.allTasks;
        if (tasks.length == 0) return;

        tasks.forEach(task => taskElements.push(new TaskView(task)));

        // console.log(taskElements);

        this.#drawList(taskElements);
    }

    drawNotCompleted() {
        let taskElements = [];
        let tasks = dataService.notCompletedTasks;
        if (tasks.length == 0) {
            taskList.textContent = "";
            return;
        }

        tasks.forEach(task => taskElements.push(new TaskView(task)));

        this.#drawList(taskElements);
    }
    drawCompleted() {
        let taskElements = [];
        let tasks = dataService.completedTasks;
        if (tasks.length == 0) {
            taskList.textContent = "";
            return;
        }

        tasks.forEach(task => taskElements.push(new TaskView(task)));

        this.#drawList(taskElements);
    }
}

class TaskView {
    constructor(task) {
        this.task = task;
        this.div = null;
    }

    createIn(elem) {
        this.div = document.createElement("div");
        this.div.classList.add("task");

        let input = document.createElement("input");
        input.addEventListener("click", this.changeState.bind(this));
        input.type = "checkbox";

        let p = document.createElement("p");
        p.textContent = this.task.text;

        let pDate = document.createElement("p");
        pDate.textContent = this.task.date;

        let imgRename = document.createElement("img");
        imgRename.src = "./image/rename.webp";
        imgRename.addEventListener("click", this.rename.bind(this));

        let imgBin = document.createElement("img");
        imgBin.src = "./image/bin.webp";
        imgBin.addEventListener("click", this.delete.bind(this));

        this.div.append(input);
        this.div.append(p);
        this.div.append(pDate);
        this.div.append(imgRename);
        this.div.append(imgBin);

        if (this.task.isDone) {
            this.div.classList.add("completed");
            input.checked = true;
        }

        if (new Date(this.task.date) < new Date() && !this.div.classList.contains("completed")) {
            this.div.classList.add("no-time");
        }
        elem.append(this.div);
    }

    changeState(elem) {
        this.task.isDone = !this.task.isDone;
        dataService.save();
        this.div.classList.toggle("completed");
        // this.div.classList.toggle("no-time");
    }

    delete() {
        dataService.delete(this.task);
        this.div.remove();
    }

    rename() {
        dataService.rename(this.task);

    }
}

dataService.open();
let taskListView = new TaskListView(taskList);

window.addEventListener("load", function () {
    taskListView.drawAll();
})

function addTaskHandler() {
    if (taskNameInput.value && taskDateInput.value != 0) {
        if (!startMessageToDoList.hidden) startMessageToDoList.hidden = true;   // скрываем сообщение

        console.log(taskDateInput.value);

        let newTask = new Task(taskNameInput.value, taskDateInput.value);
        dataService.add(newTask);
        taskListView.drawAll();

        taskNameInput.value = "";    // очистка ввода
    } else {
        alert("Enter task and date");
    }
}

addTaskBtnNew.addEventListener("click", function () {
    if (taskNameInputNew.value && taskDateInputNew.value != 0) {

        let newTask = new Task(taskNameInputNew.value, taskDateInputNew.value, taskCheckedNew.checked);
        dataService.add(newTask);
        taskListView.drawAll();

        taskNameInput.value = "";    // очистка ввода

        changeTask.style.display = "none";
    } else {
        alert("Enter task and date");
    }

    // console.log(dataService);
})

delAllTaskBtn.addEventListener("click", function () {
    if (startMessageToDoList.hidden) startMessageToDoList.hidden = false; // ???
    // console.log(startMessageToDoList.hidden);
    dataService.deleteAll();
    taskList.textContent = "";


})

tasksFilter.addEventListener("change", function () {
    switch (tasksFilter.selectedIndex) {
        case 0:
            taskListView.drawAll();
            // console.log("show all");
            break;
        case 1:
            // console.log("show check");
            taskListView.drawNotCompleted();
            break;
        case 2:
            taskListView.drawCompleted();
        // console.log("show no check");
    }
})