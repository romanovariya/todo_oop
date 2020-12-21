'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted, todoContainer) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todo = document.querySelector(todoContainer);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    }

    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
        this.input.value = '';
    }

    createItem (todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${todo.value}</span>
				<div class="todo-buttons">
					<button class="todo-remove"></button>
					<button class="todo-complete"></button>
                </div>
        `);

        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    addTodo(e) {
        e.preventDefault();

        if(this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);

            this.render();
        } else {
            alert('Запоните поле ввода');
        }
        
    }
    
    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    deleteItem(target) {
        let item = target.closest('.todo-item');

        const todoItems = document.querySelectorAll('.todo-item');
        todoItems.forEach(element => {
            if (element.key === item.key) {
                    element.remove();
                    for(let key of this.todoData.keys()){
                        if(key === item.key) {
                            this.todoData.delete(key);
                        }
                    }
                this.addToStorage();
            }
        });

    }

    completedItem(target) {
        let item = target.closest('.todo-item');

        const todoItems = document.querySelectorAll('.todo-item');
        todoItems.forEach(element => {
            if (element.key === item.key) {
                if(item.closest('.todo-completed')){
                    this.todoList.append(item);
                    for(let [key, value] of this.todoData){
                        if(key === item.key) {
                            value.completed = false;
                        }
                    }
                } else if(item.closest('.todo-list')) {
                    this.todoCompleted.append(item);
                    for(let [key, value] of this.todoData){
                        if(key === item.key) {
                            value.completed = true;
                        }
                    }
                }
                this.addToStorage();
            }
        });
    }

    handler(event) {
        
        let target = event.target;
        if(target.matches('.todo-remove')) {
            this.deleteItem(target);
        } else if (target.matches('.todo-complete')) {
            this.completedItem(target);
        }
        

    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.todo.addEventListener('click', this.handler.bind(this));
        this.render();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');
todo.init();
