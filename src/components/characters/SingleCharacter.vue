<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { ISingleCharacter } from '@/types/types.ts'

export default defineComponent({
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
    <div>
      <span class="single-character__block-title">Имя:</span>
      <span>{{ character.name }}</span>
    </div>
    <div>
      <span class="single-character__block-title">Короткое имя:</span>
      <span> {{ character.shortName }}</span>
    </div>
    <div>
      <span class="single-character__block-title">Характеристики:</span>
      <div>
        <span>Сила:</span>
        <span></span>
      </div>
    </div>
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
