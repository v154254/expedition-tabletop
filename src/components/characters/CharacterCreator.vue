<script lang="ts">
import { defineComponent, ref } from 'vue'
import { type ISingleCharacter, SingleCharactersRussianEnum } from '@/types/types.ts'

class SingleCharacter implements ISingleCharacter {
  name = ''
  shortName = ''
  strength = 1
  endurance = 1
  perception = 1
  agility = 1
  luck = 1
  spirit = 1
  intelligence = 1
  speed = 1
  faith = 1
  beauty = 1
  charisma = 1
  movementPoints = 2
  allegiance = ''
  position = {
    x: 0,
    y: 0,
  }
  currentTurn = 'Нет'
  constructor(init?: Partial<ISingleCharacter>) {
    Object.assign(this, init)
  }
}

export default defineComponent({
  computed: {
    SingleCharactersRussianEnum() {
      return SingleCharactersRussianEnum
    },
  },
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
    <div class="character-creator__block">
      <label for="name"
        >Имя
        <input id="name" type="text" v-model="character.name" />
      </label>
      <label for="shortName"
        >Короткое имя. Будет использовано для обозначения персонажа на карте. Не более 2 символов.
        <input id="shortName" type="text" v-model="character.shortName" />
      </label>
      <label for="allegiance"
        >К какой "команде" принадлежит персонаж на поле боя. Можно оставить пустым.
        <input id="allegiance" type="text" v-model="character.allegiance" />
      </label>
    </div>
    <div v-for="(attribute, key) in character" :key="key">
      <span class="single-character__block-title"> {{ SingleCharactersRussianEnum[key] }}:</span>
      <span>&nbsp;{{ attribute }}</span>
    </div>
    <span class="character-creator__error">{{ error }}</span>
    <button>Создать персонажа</button>
  </form>
</template>

<style scoped>
@reference "tailwindcss";
.character-creator {
  @apply flex flex-col border flex-wrap h-40;
}
.character-creator__block {
  @apply flex flex-col;
}
.character-creator__error {
  @apply text-red-600;
}
.single-character__block-title {
  @apply font-bold;
}
</style>
