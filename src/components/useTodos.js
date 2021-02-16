import {computed, reactive, ref} from "vue";
import {useLocalRepository} from "./useLocalRepository";
import {useFilter} from "./useFilter";
import {v4 as uuidv4} from "uuid";

export const todos = useTodos();

function useTodos() {
    const todos = reactive({list: []});
    const newTodo = ref("");
    const user = ref("");
    const disabled =  ref(true);
    const editedTodo = ref(null);
    const visibility = ref("all");
    const beforeEditCache = ref("");

    const {todoStorage} = useLocalRepository();
    const {filters} = useFilter();

    async function getTodos() {
        todoStorage.fetch().then((result) => {
            todos.list = result.rows;
            console.log("get todos from storage");
        });

    }

    async function addTodo() {
        var value = newTodo.value && newTodo.value.trim();
        if (!value) {
            return;
        }
        let todo = {
            _id : uuidv4(),
            title: value,
            completed: false,
            user : user.value
        }
        console.log("Añadimos a persistencia: " + JSON.stringify(todo));
        todoStorage.create(todo);
        getTodos();
        newTodo.value = "";
    }

    async function removeTodo(todo) {
        todos.list.splice(todos.list.indexOf(todo.doc), 1);
        if (todoStorage.deleteItem(todo.doc._id, todo.doc._rev)) {
            getTodos();
        } else {
            console.error("Error al borrar un documento.")
        }
    }

    async function editCheckTodo(todo) {
        todoStorage.update(todo).then(()=> getTodos());
    }

    async function editTodo(todo) {
        beforeEditCache.value = todo.doc.title;
        editedTodo.value = todo;
    }

    async function doneEdit(todo) {
        if (!editedTodo.value) {
            return;
        }
        editedTodo.value = null;
        todo.doc.title = todo.doc.title.trim();
        if (!todo.doc.title) {
            removeTodo(todo);
        } else {
            todoStorage.update(todo).then(()=> getTodos());
        }
    }

    async function cancelEdit(todo) {
        editedTodo.value = null;
        todo.doc.title = beforeEditCache.value;
        todoStorage.update(todo).then(()=> getTodos());
    }

    async function removeCompleted() {
        todos.list = filters.completed(this.todos).each((todo)=> todoStorage.deleteItem(todo));
        getTodos();
    }

    async function init() {
        disabled.value = false
        todoStorage.init(user.value);
        // getTodos();
    }

    const filteredTodos = computed(() => {
        return filters[visibility.value](todos.list);
    });

    const remaining = computed(() => {
        if (!todos.list.length == 0) return 0
        return filters.active(todos.list).length;
    });

    const allDone = computed({
        get: () => remaining.value === 0,
        set: value => {
            todos.list.forEach((todo) => {
                todo.doc.completed = value;
            });
        }
    });

    return {
        todos,
        newTodo,
        user,
        disabled,
        editedTodo,
        visibility,
        addTodo,
        removeTodo,
        editTodo,
        editCheckTodo,
        doneEdit,
        cancelEdit,
        removeCompleted,
        filteredTodos,
        remaining,
        allDone,
        getTodos,
        init
    };
}