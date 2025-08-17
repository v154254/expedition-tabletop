<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: {},
  emits: ['createField'],
  setup() {
    const positionX = ref<number>(0)
    const positionY = ref<number>(0)

    return {
      positionX,
      positionY,
    }
  },
})
</script>

<template>
  <div class="create-field-feature">
    <label for="position-x">Укажите число клеток по горизонтали:</label>
    <input id="position-x" type="number" v-model="positionX" />
    <label for="position-y">Укажите число клеток по вертикали:</label>
    <input id="position-y" type="number" v-model="positionY" />
    <button @click="$emit('createField', { x: positionX, y: positionY })">Создать поле</button>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
.create-field-feature {
  @apply flex flex-col;
}
</style>
