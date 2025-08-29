<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
  setup() {
    return {}
  },
})
</script>

<template>
  <div class="cell-row">
    <slot></slot>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
.cell-row {
  @apply flex;
}
</style>
