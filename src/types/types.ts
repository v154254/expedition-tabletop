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
  strength = 'Сила',
  endurance = 'Выносливость',
  perception = 'Восприятие',
  agility = 'Ловкость',
  luck = 'Удача',
  spirit = 'Дух',
  intelligence = 'Интеллект',
  speed = 'Скорость',
  faith = 'Вера',
  beauty = 'Красота',
  charisma = 'Харизма',
  currentHealth = 'Текущее здоровье',
  maxHealth = 'Максимальное здоровье',
  currentMovementPoints = 'Текущее кол-во СП',
  maxMovementPoints = 'Максимальное кол-во СП',
  initiative = 'Инициатива',
  accuracy = 'Меткость',
  evasion = 'Уклонение',
  will = 'Воля',
  closeCombatDamage = 'Урон (ББ)',
  critChance = 'Критшанс',
  skillPoints = 'ОУ',
  attractiveness = 'Привлекательность',
  actionPoints = 'ОД',
  allegiance = 'Сторона',
  position = 'Местоположение',
}
