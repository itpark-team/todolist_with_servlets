//region date utils
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDateToYYYYMMDD(date) {
    return [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join("-");
}

function formatDateToDDMMYYYY(date) {
    return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear()].join(".");
}

//endregion


async function buttonAddTodoItem_Click() {
    let inputDateField = document.getElementById("input-date-field");
    let inputDescriptionField = document.getElementById("input-description-field");

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

    let todoItem = {
        id: 0,
        date: formatDateToYYYYMMDD(date),
        description: description
    };

    console.log(todoItem);

    await saveToServer(todoItem);

    inputDateField.value = formatDateToYYYYMMDD(new Date());
    inputDescriptionField.value = "";

    await loadFromServerAndShowTodoItems();
}

function buttonDeleteTodoItem_Click(id) {
    todoItemsManager.deleteById(id);
    showTodoItems();
}

function showTodoItems(todoItems) {
    let tableTodoItemsDiv = document.getElementById("table-todo-items-div");

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

    todoItems.forEach((todoItem, index) => {
        html += `<tr>
                <td>${index + 1}</td>
                <td>${formatDateToDDMMYYYY(new Date(todoItem.date))}</td>
                <td>${todoItem.description}</td>
                <td><button class="btn btn-danger" onclick="buttonDeleteTodoItem_Click(${todoItem.id})">Удалить</button></td>
            </tr>`;
    });

    html += `</tbody>`;
    html += `</table>`;

    tableTodoItemsDiv.innerHTML = html;
}

async function loadFromServerAndShowTodoItems() {
    let response = await fetch("http://localhost:8080/todoitems");

    if (response.ok) {
        let todoItems = await response.json();
        showTodoItems(todoItems);
    }
}

async function saveToServer(todoItem) {
    let response = await fetch('http://localhost:8080/todoitems', {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(todoItem)
    });
}

window.onload = loadFromServerAndShowTodoItems