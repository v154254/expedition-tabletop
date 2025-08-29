<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { ICell, ISingleCharacter } from '@/types/types.ts'

export default defineComponent({
  components: {},
  props: {
    cell: { type: Object as PropType<ICell>, required: true },
    characterToPlace: { type: Object as PropType<ISingleCharacter>, default: () => ({}) },
  },
  emits: ['click'],
  setup(props, { emit }) {
    function handleClick() {
      emit('click', props.cell.position)
    }
    return {
      handleClick,
    }
  },
})
</script>

<template>
  <div @click="handleClick" class="cell-single">{{ cell.character?.shortName }}</div>
</template>

<style scoped>
@reference "tailwindcss";
.cell-single {
  @apply h-8 w-8 border border-solid hover:outline-orange-400 hover:outline-4 hover:-outline-offset-2;
}
</style>
