import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { validationConfig, initialTodos } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";

const addTodoButton = document.querySelector(".button_action_add");
const addTodoPopup = document.querySelector("#add-todo-popup");
const addTodoForm = addTodoPopup.querySelector(".popup__form");
const todosList = document.querySelector(".todos__list");

const addTodoPopupForm = new PopupWithForm({
  popupSelector: "#add-todo-popup",
  handleFormSubmit: (inputValues) => {
    const { name, date: dateInput } = inputValues;
    const id = uuidv4();
    const date = new Date(dateInput);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

    const values = { name, date, id };
    renderTodo(values, section);
    addTodoPopupForm.close();
    newTodoValidator.resetValidation();
    todoCounter.updateTotal(true);
  },
});
addTodoPopupForm.setEventListeners();

function handleCheck(completed) {
  todoCounter.updateCompleted(completed);
}
function handleDelete(completed) {
  if (completed) {
    todoCounter.updateCompleted(false);
  }
  todoCounter.updateTotal(false);
}

function renderTodo(item, sectionInstance) {
  const todo = generateTodo(item);
  sectionInstance.addItem(todo);
}

const generateTodo = (data) => {
  const todo = new Todo(data, "#todo-template", handleCheck, handleDelete);
  const todoElement = todo.getView();
  return todoElement;
};

addTodoButton.addEventListener("click", () => {
  addTodoPopupForm.open();
});

const section = new Section({
  items: initialTodos,
  renderer: (item) => renderTodo(item, section),
  containerSelector: ".todos__list",
});

section.renderItems();

const todoCounter = new TodoCounter(initialTodos, ".counter__text");

const newTodoValidator = new FormValidator(validationConfig, addTodoForm);

newTodoValidator.enableValidation();
