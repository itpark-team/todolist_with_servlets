class TodoItem {
    #id;
    #date;
    #description;

    constructor(id, date, description) {
        this.#id = id;
        this.#date = date;
        this.#description = description;
    }

    getId() {
        return this.#id;
    }

    getDate() {
        return this.#date;
    }

    getDescription() {
        return this.#description;
    }
}

class TodoItemsManager {
    #globalId;
    #todoItems;

    constructor() {
        this.#globalId = 0;
        this.#todoItems = [];
    }

    addNew(date, description) {
        this.#globalId++;

        let todoItem = new TodoItem(this.#globalId, date, description);

        this.#todoItems.push(todoItem);
    }

    getAll() {
        return this.#todoItems;
    }

    deleteById(id) {
        let findIndex = this.#todoItems.findIndex(todoItem => {
            return todoItem.getId() === id;
        });

        this.#todoItems.splice(findIndex, 1);
    }

}

let todoItemsManager = new TodoItemsManager();

let inputDateField = document.getElementById("input-date-field");
let inputDescriptionField = document.getElementById("input-description-field");
let tableTodoItemsDiv = document.getElementById("table-todo-items-div");

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDateToYYYYMMDD(date) {
    return [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join("-");
}

function formatDateToDDMMYYYY(date) {
    return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear()].join(".");
}

function buttonAddTodoItem_Click() {
    let date = new Date(inputDateField.value);
    let description = inputDescriptionField.value;

    if (inputDateField.value.toString() === "") {
        alert("Вы не ввели дату");
        return;
    }

    date.setHours(0, 0, 0, 0);
    let currentDate = new Date().setHours(0, 0, 0, 0);

    if (date < currentDate) {
        alert("Введите дату больше либо равную текущей дате");
        return;
    }

    if (description === "") {
        alert("Ошибка. Поле с текстом задачи должно быть заполнено");
        return;
    }

    todoItemsManager.addNew(date, description);

    inputDateField.value = formatDateToYYYYMMDD(new Date());
    inputDescriptionField.value = "";

    showTodoItems();

    //add to server
}

function buttonDeleteTodoItem_Click(id) {
    todoItemsManager.deleteById(id);
    showTodoItems();
}

function showTodoItems() {
    let html = "";

    html += `<table class="table">`;
    html += `<thead>
        <tr>
            <th>№</th>
            <th>Дата</th>
            <th>Задача</th>
            <th>Действие</th>
        </tr>
        </thead>`;
    html += `<tbody>`;

    todoItemsManager.getAll().forEach((todoItem, index) => {
        html += `<tr>
                <td>${index + 1}</td>
                <td>${formatDateToDDMMYYYY(todoItem.getDate())}</td>
                <td>${todoItem.getDescription()}</td>
                <td><button class="btn btn-danger" onclick="buttonDeleteTodoItem_Click(${todoItem.getId()})">Удалить</button></td>
            </tr>`;
    });

    html += `</tbody>`;
    html += `</table>`;

    tableTodoItemsDiv.innerHTML = html;
}

window.onload = async function () {

    let response = await fetch("http://localhost:8080/todoitems");

    if (response.ok) {
        let todoItems = await response.json();

        console.log(todoItems);

        todoItems.forEach(item => {
            todoItemsManager.addNew(new Date(item.date), item.description);
        });

        showTodoItems();
    }
};