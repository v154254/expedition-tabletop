<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  components: {},
  props: {
    positionX: { type: Number, required: true },
    positionY: { type: Number, required: true },
  },
  setup(props) {
    const contains = ref()
    const position = computed(() => {
      return {
        x: props.positionX,
        y: props.positionY,
      }
    })
    return {
      position,
      contains,
    }
  },
})
</script>

<template>
  <div class="cell-single">{{ contains }}</div>
</template>

<style scoped>
@reference "tailwindcss";
.cell-single {
  @apply h-8 w-8 border border-solid hover:outline-orange-400 hover:outline-4 hover:-outline-offset-2;
}
</style>
