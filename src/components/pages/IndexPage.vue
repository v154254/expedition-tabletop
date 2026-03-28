<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import CreateFieldFeature from '@/components/buttons/CreateFieldFeature.vue'
import type { ICell, ICoords } from '@/types/types.ts'
import Character from '@/types/character'
import CellRow from '@/components/cells/CellRow.vue'
import CellSingle from '@/components/cells/CellSingle.vue'
import SingleCharacter from '@/components/characters/SingleCharacter.vue'
import CharacterCreator from '@/components/characters/CharacterCreator.vue'
import cellRow from "@/components/cells/CellRow.vue";

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
    const characters = ref<Character[]>([])
    const initiativeOrder = ref<Character[]>([])

    const selectedCharacter = ref<Character | null>(null)
    const currentTurnCharacter = ref<Character | null>(null)
    const isCharacterCreatorOpened = ref<boolean>(false)
    const placeCharacterMode = ref<boolean>(false)
    const moveCharacterMode = ref<boolean>(false)
    const attackCharacterMode = ref<boolean>(false)
    const selectCharacterToActMode = ref<boolean>(false)

    const currentInitiativeIndex = ref(0)
    const isFighting = ref<boolean>(false)

    const warning = ref<string>('')
    const combatLog = ref<string>('')

    // character management

    function toggleCharacterCreator() {
      isCharacterCreatorOpened.value = !isCharacterCreatorOpened.value
    }
    function addCharacter(character: Character) {
      characters.value.push(character)
      isCharacterCreatorOpened.value = false
    }

    function toggleSelectCharacter(character: Character) {
      if (selectedCharacter.value) {
        selectedCharacter.value = null
      } else {
        selectedCharacter.value = character
      }
    }

    function toggleAddingCharacterToField(character: Character) {
      toggleSelectCharacter(character)
      placeCharacterMode.value = !placeCharacterMode.value
    }

    function toggleCharacterMovement(character: Character) {
      toggleSelectCharacter(character)
      moveCharacterMode.value = !moveCharacterMode.value
    }

    function toggleAttackMode(character: Character) {
      toggleSelectCharacter(character)
      attackCharacterMode.value = !attackCharacterMode.value
    }

    function toggleSelectCharacterToActMode() {
      selectCharacterToActMode.value = !selectCharacterToActMode.value
    }

    function deleteCharacter(character: Character) {
      for (const key in character) {
        delete character[key]
      }
      characters.value = characters.value.filter((character) => character.name)
      initiativeOrder.value = characters.value.filter((character) => character.name)
    }

    // character actions

    function placeCharacter(cell: ICell) {
      if (selectedCharacter.value) {
        const oldPosition = findOldPosition(selectedCharacter)
        if (oldPosition) {
          oldPosition.character = undefined
        }
        cell.character = selectedCharacter.value
        selectedCharacter.value.position = { x: cell.position.x, y: cell.position.y }
        selectedCharacter.value = null
      }
    }

    function moveCharacter(cell: ICell, distance: number) {
      if (currentTurnCharacter.value.currentMovementPoints < distance) {
        warning.value = 'Не хватает очков передвижения'
        return
      }
      if (cell.character) {
        warning.value = 'На выбранной клетке уже находится персонаж'
        return
      }
      const oldPosition = findOldPosition(currentTurnCharacter)
      if (!oldPosition) {
        return
      }
      combatLog.value = combatLog.value + '\n' + `${currentTurnCharacter.value.name} передвигается из клетки x:${oldPosition.position.x} y:${oldPosition.position.y} на клетку x:${cell.position.x} y:${cell.position.y}`
      oldPosition.character = undefined
      currentTurnCharacter.value.position = cell.position
      currentTurnCharacter.value.currentMovementPoints -= distance
      cell.character = currentTurnCharacter.value!
    }

    function attackCharacter(cell: ICell, distance: number) {
      const attackValues = currentTurnCharacter.value.attack()
      if (currentTurnCharacter.value.remainingAttacks < 1) {
        warning.value = 'Не осталось атак'
        return
      }
      if (attackValues.reach < distance) {
        warning.value = 'Не хватает дальности атаки'
        return
      }
      if (!cell.character) {
        warning.value = 'На выбранной клетке нет персонажа которого можно было бы атаковать'
        return
      }
      if (cell.character.name === currentTurnCharacter.value.name) {
        warning.value = 'Убей врагов чем себя'
        return
      }
      const {log, remainingHealth} = cell.character.takeAttack(attackValues)
      cell.character.currentHealth = remainingHealth
      currentTurnCharacter.value.remainingAttacks -= 1
      combatLog.value = combatLog.value + '\n' + log
    }

    function endTurn() {
      initiativeOrder.value.map(
        (character) => {
          character.refreshCurrentMovementPoints()
          character.refreshAttacks()
        }
      )
    }

    function additionalTurn() {
      currentTurnCharacter.value.refreshCurrentMovementPoints()
      currentTurnCharacter.value.refreshAttacks()
      return
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
      endFighting()
      battleField.value = [[]]
      characters.value.map((character: Character) => (character.position = { x: 0, y: 0 }))
    }

    function toggleIsFighting() {
      if (isFighting.value) {
        endFighting()
      } else {
        startFighting()
      }
    }

    function startFighting() {
      isFighting.value = true
      createInitiativeOrder()
      currentTurnCharacter.value = initiativeOrder.value[currentInitiativeIndex.value]
    }

    function endFighting() {
      isFighting.value = false
      initiativeOrder.value.map((character) => character.refreshCurrentMovementPoints())
      initiativeOrder.value = []
      currentTurnCharacter.value = null
    }

    function createInitiativeOrder() {
      const iterator = battleField.value
        .flat()
        .filter((item) => item.character)
        .values()
      const charactersOnBattleField = []
      for (const value of iterator) {
        charactersOnBattleField.push(value.character)
      }
      initiativeOrder.value = charactersOnBattleField.toSorted((a: Character, b: Character) => {
        return a.name.localeCompare(b.name)
      })
      initiativeOrder.value.sort((a: Character, b: Character) => {
        return b.initiative - a.initiative
      })
    }

    //helpers

    function handleAction(position: ICoords) {
      const cell = battleField.value
        .flat()
        .find((cell) => cell.position.x === position.x && cell.position.y === position.y) as ICell
      if (!cell) {
        return
      }
      if (placeCharacterMode.value) {
        placeCharacter(cell)
        placeCharacterMode.value = false
        selectedCharacter.value = null
        return
      }
      if (selectCharacterToActMode.value) {
        currentTurnCharacter.value = cell.character
        selectCharacterToActMode.value = false
        return;
      }
      const distance =
        Math.abs(selectedCharacter.value.position.x - position.x) +
        Math.abs(selectedCharacter.value.position.y - position.y)
      if (moveCharacterMode.value) {
        moveCharacter(cell, distance)
        moveCharacterMode.value = false
        selectedCharacter.value = null
        return
      }
      if (attackCharacterMode.value) {
        attackCharacter(cell, distance)
        attackCharacterMode.value = false
        selectedCharacter.value = null
        return;
      }
    }

    function findOldPosition(character: Character) {
      return battleField.value
        .flat()
        .find(
          (cell) =>
            cell.position.x === character.value!.position.x &&
            cell.position.y === character.value!.position.y,
        )
    }

    // miscellaneous

    onMounted(() => {
      if (localStorage.characters) {
        characters.value = JSON.parse(localStorage.getItem('characters')).map(
          (character: Character) => {
            character = new Character(
              character.name, character.shortName, character.allegiance,
              character.permanentEffects, character.currentHealth, character.currentMovementPoints,
              character.position
            )
            return character
          }
        )
      }
      if (localStorage.battleField) {
        battleField.value = JSON.parse(localStorage.getItem('battleField')).map(
          (row) => {
            row.map(
              (cell) => {
                if (cell.character) {
                  cell.character = characters.value.find((character) => character.name === cell.character.name)
                }
                return cell
              }
            )
            return row
          }
        )
      }
    })

    onBeforeUnmount(() => {
      save()
    })

    function save() {
      localStorage.setItem('characters', JSON.stringify(characters.value))
      localStorage.setItem('battleField', JSON.stringify(battleField.value))
    }

    function clearCombatLog() {
      combatLog.value = ''
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
      warning,
      isFighting,
      toggleIsFighting,
      selectedCharacter,
      initiativeOrder,
      currentTurnCharacter,
      currentInitiativeIndex,
      attackCharacterMode,
      toggleAttackMode,
      combatLog,
      clearCombatLog,
      toggleSelectCharacterToActMode,
      selectCharacterToActMode,
      additionalTurn,
      endTurn
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
              placeCharacterMode && character === selectedCharacter
                ? 'Отменить установку персонажа'
                : 'Установить персонажа на поле'
            }}
          </button>
          <button @click="deleteCharacter(character)">Удалить персонажа</button>
        </div>
      </SingleCharacter>
    </div>
    <button @click="save">Сохранить игру</button>
    <CreateFieldFeature v-show="battleField.length <= 1" @create-field="createField" />
    <button v-show="battleField.length > 1" @click="toggleIsFighting">
      {{ isFighting ? 'Завершить бой' : 'Начать бой' }}
    </button>
    <button v-show="isFighting" @click="toggleSelectCharacterToActMode">
      {{ selectCharacterToActMode ? 'Отменить выбор персонажа' : 'Выбрать персонажа который будет ходить' }}
    </button>
    <button v-show="isFighting" @click="endTurn">
      Завершить ход
    </button>
    <span class="warning">{{ warning }}</span>
    <div class="battlefield-container">
      <div class="initiative-order">
        <SingleCharacter
          v-for="character in initiativeOrder"
          :key="character.name + 'orderInitiative'"
          :character="character"
          where-is-character="field"
        />
      </div>
      <div v-if="currentTurnCharacter">
        <SingleCharacter :character="currentTurnCharacter" where-is-character="field">
          <button @click="toggleCharacterMovement(currentTurnCharacter)">
            {{
              moveCharacterMode ? 'Отменить движение' : 'Начать движение'
            }}
          </button>
          <button @click="toggleAttackMode(currentTurnCharacter)">
            {{
              attackCharacterMode ? 'Отменить атаку' : 'Атаковать'
            }}
          </button>
          <button @click="additionalTurn">Сходить повторно</button>
        </SingleCharacter>
      </div>
      <div class="battlefield">
        <CellRow v-for="(row, rowIndex) in battleField" :key="`widthX: ${rowIndex}`">
          <CellSingle
            v-for="(cell, cellIndex) in row"
            :cell="cell"
            :key="`${rowIndex}: ${cellIndex}`"
            @click="handleAction"
          />
        </CellRow>
      </div>
      <div>
      <p class="combat-log">{{combatLog}}</p>
        <button @click="clearCombatLog" v-show="combatLog.length">Очистить лог</button>
      </div>
    </div>
    <button v-show="battleField.length > 1" @click="deleteField">Удалить поле</button>
  </div>
</template>

<style scoped>
@reference "tailwindcss";
.index-page {
  @apply flex flex-col;
}
.battlefield-container {
  @apply flex gap-20;
}
.battlefield {
  @apply flex flex-col;
}
.initiative-order {
  @apply flex flex-col;
}
.characters-list {
  @apply flex grow;
}
.warning {
  @apply text-red-600;
}
.combat-log {
  @apply whitespace-pre-line;
}
</style>
