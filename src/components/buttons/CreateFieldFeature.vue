<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: {},
  emits: ['createField'],
  setup(props, { emit }) {
    const positionX = ref<number>(0)
    const positionY = ref<number>(0)

    const showFieldCreation = ref<boolean>(false)

    function toggleFieldCreation() {
      showFieldCreation.value = !showFieldCreation.value
    }

    function createField() {
      emit('createField', { x: positionX.value, y: positionY.value })
      showFieldCreation.value = false
    }

    return {
      positionX,
      positionY,
      showFieldCreation,
      toggleFieldCreation,
      createField,
    }
  },
})
</script>

<template>
  <div class="create-field-feature">
    <button @click="toggleFieldCreation">
      {{ showFieldCreation ? 'Отменить создание игрового поля' : 'Начать создание игрового поля' }}
    </button>
    <div class="create-field-feature" v-show="showFieldCreation">
      <label for="position-x">Укажите число клеток по горизонтали:</label>
      <input id="position-x" type="number" v-model="positionX" />
      <label for="position-y">Укажите число клеток по вертикали:</label>
      <input id="position-y" type="number" v-model="positionY" />
      <button @click="createField">Создать поле</button>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
.create-field-feature {
  @apply flex flex-col;
}
</style>
