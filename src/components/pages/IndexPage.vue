<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import CreateFieldFeature from '@/components/buttons/CreateFieldFeature.vue'
import type { ICell, ICoords, ISingleCharacter } from '@/types/types.ts'
import CellRow from '@/components/cells/CellRow.vue'
import CellSingle from '@/components/cells/CellSingle.vue'
import SingleCharacter from '@/components/characters/SingleCharacter.vue'
import CharacterCreator from '@/components/characters/CharacterCreator.vue'

class Cell implements ICell {
  position = {
    x: 0,
    y: 0,
  }
  character = undefined
}

export default defineComponent({
  components: { CharacterCreator, SingleCharacter, CellSingle, CellRow, CreateFieldFeature },
  setup() {
    const battleField = ref<ICell[][]>([])
    const characters = ref<ISingleCharacter[]>([])
    const selectedCharacter = ref<ISingleCharacter | null>(null)
    const isCharacterCreatorOpened = ref<boolean>(false)
    const placeCharacterMode = ref<boolean>(false)
    const moveCharacterMode = ref<boolean>(false)

    // character management

    function toggleCharacterCreator() {
      isCharacterCreatorOpened.value = !isCharacterCreatorOpened.value
    }
    function addCharacter(character: ISingleCharacter) {
      characters.value.push(character)
      isCharacterCreatorOpened.value = false
    }

    function toggleSelectCharacter(character: ISingleCharacter) {
      if (selectedCharacter.value) {
        selectedCharacter.value = null
      } else {
        selectedCharacter.value = character
      }
    }

    function toggleAddingCharacterToField(character: ISingleCharacter) {
      toggleSelectCharacter(character)
      placeCharacterMode.value = !placeCharacterMode.value
    }

    function toggleCharacterMovement(character: ISingleCharacter) {
      toggleSelectCharacter(character)
      moveCharacterMode.value = !moveCharacterMode.value
    }

    function deleteCharacter(character: ISingleCharacter) {
      for (const key in character) {
        delete character[key]
      }
      characters.value = characters.value.filter((character) => character.name)
    }

    // character actions

    function placeCharacter(cell: ICell) {
      if (selectedCharacter.value) {
        cell.character = selectedCharacter.value
        selectedCharacter.value.position.x = cell.position.x
        selectedCharacter.value.position.y = cell.position.y
        selectedCharacter.value = null
      }
    }

    function moveCharacter(cell: ICell, distance: number) {
      if (selectedCharacter.value!.movementPoints < distance) {
        return
      }
      const oldPosition = battleField.value
        .flat()
        .find(
          (cell) =>
            cell.position.x === selectedCharacter.value!.position.x &&
            cell.position.y === selectedCharacter.value!.position.y,
        )
      if (!oldPosition) {
        return
      }
      oldPosition.character = undefined
      selectedCharacter.value!.position = cell.position
      cell.character = selectedCharacter.value!
    }

    // game management

    function createField(coords: ICoords) {
      for (let i = 1; i <= coords.y; i++) {
        const row: ICell[] = []
        for (let y = 1; y <= coords.x; y++) {
          const cell = new Cell()
          cell.position.x = y
          cell.position.y = i
          row.push(cell)
        }
        battleField.value.push(row)
      }
    }

    function deleteField() {
      battleField.value = [[]]
      characters.value.map((character) => (character.position = { x: 0, y: 0 }))
    }

    function handleAction(position: ICoords) {
      const cell = battleField.value
        .flat()
        .find((cell) => cell.position.x === position.x && cell.position.y === position.y)
      if (!selectedCharacter.value || !cell) {
        return
      }
      if (placeCharacterMode.value) {
        placeCharacter(cell)
      }
      const distance =
        Math.abs(selectedCharacter.value.position.x - position.x) +
        Math.abs(selectedCharacter.value.position.y - position.y)
      if (moveCharacterMode.value) {
        moveCharacter(cell, distance)
      }
    }

    // miscellaneous

    onMounted(() => {
      if (localStorage.characters) {
        characters.value = JSON.parse(localStorage.characters)
      }
      if (localStorage.battleField) {
        battleField.value = JSON.parse(localStorage.battleField)
      }
    })

    onBeforeUnmount(() => {
      save()
    })

    function save() {
      localStorage.setItem('characters', JSON.stringify(characters.value))
      localStorage.setItem('battleField', JSON.stringify(battleField.value))
    }

    return {
      createField,
      characters,
      isCharacterCreatorOpened,
      toggleCharacterCreator,
      addCharacter,
      toggleAddingCharacterToField,
      save,
      toggleCharacterMovement,
      deleteCharacter,
      battleField,
      handleAction,
      placeCharacterMode,
      moveCharacterMode,
      deleteField,
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
      <SingleCharacter v-for="character in characters" :character="character" :key="character.name">
        <div>
          <button @click="toggleAddingCharacterToField(character)">
            {{
              placeCharacterMode ? 'Отменить установку персонажа' : 'Установить персонажа на поле'
            }}
          </button>
          <button @click="toggleCharacterMovement(character)">
            {{
              moveCharacterMode ? 'Отменить передвижение персонажа' : 'Начать движение персонажа'
            }}
          </button>
          <button @click="deleteCharacter(character)">Удалить персонажа</button>
        </div>
      </SingleCharacter>
    </div>
    <button @click="save">Сохранить игру</button>
    <CreateFieldFeature @create-field="createField" />
    <button @click="deleteField">Удалить поле</button>
    <div class="cell-field">
      <CellRow v-for="(row, rowIndex) in battleField" :key="`widthX: ${rowIndex}`">
        <CellSingle
          v-for="(cell, cellIndex) in row"
          :cell="cell"
          :key="`${rowIndex}: ${cellIndex}`"
          @click="handleAction"
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
