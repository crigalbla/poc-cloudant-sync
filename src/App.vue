<template>
  <h3>Poc cloudant</h3>
  <Todo/>
</template>

<script>
import Todo from './components/Todo.vue'

export default {
  name: 'App',
  components: {
    Todo
  }
}
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
