<script lang="ts">
import { defineComponent, ref } from 'vue'
import { SingleCharactersRussianEnum } from '@/types/types.ts'
import Character, { type permanentEffects } from '@/types/character.ts'

export default defineComponent({
  computed: {
    SingleCharactersRussianEnum() {
      return SingleCharactersRussianEnum
    },
  },
  components: {},
  emits: ['createCharacter'],
  setup(props, { emit }) {
    const name = ref<string>('')
    const shortName = ref<string>('')
    const affiliation = ref<string>('')
    const character = ref<Character>(new Character('', '', ''))

    const modificators = ref<permanentEffects[]>([
      {
        name: 'Происхождение: Фарис',
        modifiers: {
          agility: 3,
          perception: 2,
        },
      },
      {
        name: 'Происхождение: Муфигур',
        modifiers: {
          endurance: 3,
          spirit: 2,
        },
      },
      {
        name: '+4 к скорости',
        modifiers: {
          speed: 4,
        },
      },
    ])

    const error = ref<string>('')

    const addingModifierMode = ref<boolean>(false)
    const removingModifierMode = ref<boolean>(false)
    function onSubmit() {
      if (!character.value.name || !character.value.shortName) {
        error.value =
          'Имя или короткое имя персонажа не заполнены. Эти поля обязательны к заполнению.'
      } else {
        character.value.refreshCurrentHealth()
        character.value.refreshCurrentMovementPoints()
        emit('createCharacter', character.value)
        character.value = new Character('', '', '')
        error.value = ''
      }
    }
    function addModifier(modifier: permanentEffects) {
      character.value.addPermanentModifier(modifier)
    }
    function removeModifier(modifier: permanentEffects) {
      character.value.removePermanentModifier(modifier)
    }
    function toggleAddingMode() {
      addingModifierMode.value = !addingModifierMode.value
    }
    function toggleRemovingMode() {
      removingModifierMode.value = !removingModifierMode.value
    }

    return {
      name,
      shortName,
      affiliation,
      onSubmit,
      error,
      character,
      addModifier,
      removeModifier,
      addingModifierMode,
      removingModifierMode,
      toggleAddingMode,
      toggleRemovingMode,
      modificators,
    }
  },
})
</script>

<template>
  <div class="character-creator">
    <form @submit.prevent="onSubmit" class="character-creator__form">
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
      <div class="character-creator__container">
        <div v-for="(attribute, key) in character.attributes" :key="key">
          <span class="single-character__block-title">
            {{ SingleCharactersRussianEnum[key] }}:</span
          >
          <span>&nbsp;{{ attribute }}</span>
        </div>
      </div>
      <ul>
        <li v-for="modifier in character.permanentEffects" :key="modifier.name">
          {{ modifier.name }}
        </li>
      </ul>
      <span class="character-creator__error">{{ error }}</span>
    </form>
    <button @click="toggleAddingMode">Добавить особенность</button>
    <ul v-show="addingModifierMode">
      <li
        @click="addModifier(modificator)"
        v-for="modificator in modificators"
        :key="modificator.name"
        class="character-modifiers__item"
      >
        {{ modificator.name }}
      </li>
    </ul>
    <button @click="onSubmit">Создать персонажа</button>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
.character-creator {
  @apply border;
}
.character-creator__form {
  @apply pt-2 pl-1;
}
.character-creator__container {
  @apply grid grid-cols-4 mt-1;
}
.character-creator__block {
  @apply flex flex-col gap-0.5;
}
.character-creator__error {
  @apply text-red-600;
}
.single-character__block-title {
  @apply font-bold;
}
.character-modifiers__item {
  @apply hover:text-orange-300;
}
</style>
