import type Character from '@/types/character.ts'

export interface ICoords {
  x: number
  y: number
}
export interface ICell {
  position: ICoords
  character: Character | undefined
}

export enum SingleCharactersRussianEnum {
  name = 'Имя',
  shortName = 'Короткое имя',
  mind = 'Разум',
  body = 'Тело',
  insight = 'Проницательность',
  fortitude = 'Стойкость',
  liveliness = 'Энергичность',
  aesthetics = 'Эстетичность',
  learnability = 'Обучаемость',
  spirit = 'Дух',
  endurance = 'Выносливость',
  accuracy = 'Меткость',
  evasion = 'Уклонение',
  defence = 'Защита',
  defenceFromElements = 'Защита от элементов',
  charisma = 'Обаяние',
  critChance = 'Критшанс',
  actionPoints = 'ОД',
  currentHealth = 'Текущее здоровье',
  maxHealth = 'Максимальное здоровье',
  currentMovementPoints = 'Текущее кол-во СП',
  maxMovementPoints = 'Максимальное кол-во СП',
  allegiance = 'Сторона',
  position = 'Местоположение',
  remainingAttacks = 'Осталось атак'
}

export interface IAttack {
  damage: number
  accuracy: number
  critChance: number
  reach: number
  attackerName: string
}
