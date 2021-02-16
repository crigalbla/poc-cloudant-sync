
export function useFilter() {
    var filters = {
        all: function (todos) {
            return todos;
        },
        active: function (todos) {
            console.log("active "+todos)
            return todos.filter(function (todo) {
                return !todo.doc.completed;
            });
        },
        completed: function (todos) {
            console.log("completed "+todos)
            return todos.filter(function (todo) {
                return todo.doc.completed;
            });
        }
    };
    return {filters};
}