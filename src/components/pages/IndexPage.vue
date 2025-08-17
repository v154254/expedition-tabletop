<script lang="ts">
import { defineComponent, ref } from 'vue'
import CreateFieldFeature from '@/components/buttons/CreateFieldFeature.vue'
import type { ICoords, ISingleCharacter } from '@/types/types.ts'
import CellRow from '@/components/cells/CellRow.vue'
import CellSingle from '@/components/cells/CellSingle.vue'
import SingleCharacter from '@/components/characters/SingleCharacter.vue'
import CharacterCreator from '@/components/characters/CharacterCreator.vue'

export default defineComponent({
  components: { CharacterCreator, SingleCharacter, CellSingle, CellRow, CreateFieldFeature },
  setup() {
    const amountOfCells = ref<number>(0)
    const amountOfRows = ref<number>(0)
    const characters = ref<ISingleCharacter[]>([])
    const isCharacterCreatorOpened = ref<boolean>(false)

    function createField(coords: ICoords) {
      amountOfCells.value = coords.x
      amountOfRows.value = coords.y
    }
    function toggleCharacterCreator() {
      isCharacterCreatorOpened.value = !isCharacterCreatorOpened.value
    }
    function addCharacter(character: ISingleCharacter) {
      characters.value.push(character)
      isCharacterCreatorOpened.value = false
    }
    return {
      amountOfRows,
      amountOfCells,
      createField,
      characters,
      isCharacterCreatorOpened,
      toggleCharacterCreator,
      addCharacter,
    }
  },
})
</script>

<template>
  <div class="index-page">
    <button @click="toggleCharacterCreator">
      {{
        isCharacterCreatorOpened
          ? 'Закрыть форму создания персонажа'
          : 'Открыть форму создания персонажа'
      }}
    </button>
    <CharacterCreator v-show="isCharacterCreatorOpened" @create-character="addCharacter" />
    <div class="characters-list">
      <SingleCharacter
        v-for="character in characters"
        :character="character"
        :key="character.name"
      />
    </div>
    <CreateFieldFeature @create-field="createField" />
    <div class="cell-field">
      <CellRow
        v-for="rowNumber in amountOfRows"
        :amount-of-cells="amountOfCells"
        :key="`widthX: ${rowNumber}`"
      >
        <CellSingle
          v-for="cellNumber in amountOfCells"
          :position-y="rowNumber"
          :position-x="cellNumber"
          :key="`heightY: ${cellNumber}`"
        />
      </CellRow>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
.index-page {
  @apply flex flex-col;
}
.cell-field {
  @apply flex flex-col self-center;
}
.characters-list {
  @apply grow;
}
</style>
