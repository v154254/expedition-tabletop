<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { type ISingleCharacter, SingleCharactersRussianEnum } from '@/types/types.ts'

export default defineComponent({
  computed: {
    SingleCharactersRussianEnum() {
      return SingleCharactersRussianEnum
    },
  },
  components: {},
  props: {
    character: { type: Object as PropType<ISingleCharacter>, required: true },
  },
  setup() {
    return {}
  },
})
</script>

<template>
  <div class="single-character">
    <div v-for="(attribute, key) in character" :key="key">
      <span class="single-character__block-title"> {{ SingleCharactersRussianEnum[key] }}:</span>
      <span>&nbsp;{{ attribute }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
.single-character {
  @apply flex flex-col border w-60;
}
.single-character__block-title {
  @apply font-bold;
}
</style>
