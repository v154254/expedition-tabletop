<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { SingleCharactersRussianEnum } from '@/types/types.ts'
import type Character from '@/types/character.ts'

export default defineComponent({
  computed: {
    SingleCharactersRussianEnum() {
      return SingleCharactersRussianEnum
    },
  },
  components: {},
  props: {
    character: { type: Object as PropType<Character>, required: true },
  },
  setup() {
    return {}
  },
})
</script>

<template>
  <div class="single-character">
    <div class="single-character__names">
      <div>
        <span class="single-character__block-title"> Имя:</span>
        <span>&nbsp;{{ character.name }}</span>
      </div>
      <div>
        <span class="single-character__block-title"> Короткое имя:</span>
        <span>&nbsp;{{ character.shortName }}</span>
      </div>
    </div>
    <div class="single-character__attributes">
      <div v-for="(attribute, key) in character.attributes" :key="key">
        <span class="single-character__block-title"> {{ SingleCharactersRussianEnum[key] }}:</span>
        <span>&nbsp;{{ attribute }}</span>
      </div>
    </div>
    <ul>
      <li v-for="modifier in character.permanentEffects" :key="modifier.name">
        {{ modifier.name }}
      </li>
    </ul>
    <div>
      <span class="single-character__block-title">Текущее здоровье:</span>
      <span>&nbsp;{{ character.currentHealth }}</span>
    </div>
    <div>
      <span class="single-character__block-title">Текущие СП:</span>
      <span>&nbsp;{{ character.currentMovementPoints }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
.single-character {
  @apply flex flex-col border w-90;
}
.single-character__names {
  @apply mb-2 text-lg;
}
.single-character__block-title {
  @apply font-bold;
}
.single-character__attributes {
  @apply grid grid-cols-2;
}
</style>
