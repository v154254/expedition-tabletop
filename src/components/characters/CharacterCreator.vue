<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { ISingleCharacter } from '@/types/types.ts'

class SingleCharacter implements ISingleCharacter {
  name = ''
  shortName = ''
  movementPoints = 2
  constructor(init?: Partial<ISingleCharacter>) {
    Object.assign(this, init)
  }
}

export default defineComponent({
  components: {},
  emits: ['createCharacter'],
  setup(props, { emit }) {
    const character = ref<ISingleCharacter>(new SingleCharacter())
    const error = ref<string>('')
    function onSubmit() {
      if (!character.value.name || !character.value.shortName) {
        error.value =
          'Имя или короткое имя персонажа не заполнены. Эти поля обязательны к заполнению.'
      } else {
        // создаём глубокую копию объекта с новыми значениями, без ссылок
        const characterToCreate = JSON.parse(JSON.stringify(character.value))
        emit('createCharacter', characterToCreate)
        character.value = new SingleCharacter()
        error.value = ''
      }
    }
    return {
      character,
      onSubmit,
      error,
    }
  },
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="character-creator">
    <label for="name">Укажите имя персонажа</label>
    <input id="name" type="text" v-model="character.name" />
    <label for="short-name"
      >Укажите короткое имя персонажа. Это имя будет отображаться на карте боя и быть в пределе 1-3
      символов</label
    >
    <input id="short-name" type="text" v-model="character.shortName" />
    <label for="movement-points">Укажите числов очков передвижения</label>
    <input id="movement-points" type="number" v-model="character.movementPoints" />
    <span class="character-creator__error">{{ error }}</span>
    <button>Создать персонажа</button>
  </form>
</template>

<style scoped>
@reference "tailwindcss";
.character-creator {
  @apply flex flex-col border w-60;
}
.character-creator__error {
  @apply text-red-600;
}
</style>
