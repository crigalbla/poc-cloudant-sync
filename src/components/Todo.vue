<template>
  <section class="todoapp">
    <header class="header">
      <input class="new-todo" autofocus autocomplete="off" placeholder="Nombre usuario" v-model="user"
             @keyup.enter="init()" :disabled="!disabled"/>
      <h1>Gestiones</h1>
      <input class="new-todo" autofocus autocomplete="off" placeholder="What needs to be done?" v-model="newTodo"
             @keyup.enter="addTodo" :disabled="disabled"/>
    </header>
    <section class="main" v-show="todos.list.length && !disabled" v-cloak>
      <input id="toggle-all" class="toggle-all" type="checkbox" v-model="allDone"/>
      <label for="toggle-all"></label>
      <ul class="todo-list">
        <li v-for="todo in filteredTodos" class="todo" :key="todo.doc._id"
            :class="{ completed: todo.doc.completed, editing: todo == editedTodo }">
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.doc.completed" @change="editCheckTodo(todo)"/>
            <label @dblclick="editTodo(todo)">{{ todo.doc.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input class="edit" type="text" v-model="todo.doc.title" @blur="doneEdit(todo)"
                 @keyup.enter="doneEdit(todo)"
                 @keyup.esc="cancelEdit(todo)"/>
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.list.length" v-cloak>
        <span class="todo-count">
<!--          <strong>{{ remaining }}</strong> {{ remaining | pluralize }} left-->
        </span>
      <ul class="filters">
        <li><a @click="visibility = 'all'" :class="{ selected: visibility == 'all' }">All</a></li>
        <li><a @click="visibility = 'active'" :class="{ selected: visibility == 'active' }">Active</a></li>
        <li><a @click="visibility = 'completed'" :class="{ selected: visibility == 'completed' }">Completed</a>
        </li>
      </ul>
      <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script>
import {todos} from "./useTodos";

export default {
  computed: {
    pluralize(n) {
      return n === 1 ? "item" : "items";
    }
  },
  setup() {
    return {
      ...todos
    };
  },
}
</script>


<style scoped>

</style>
