export interface ICoords {
  x: number
  y: number
}

export interface ISingleCharacter {
  name: string
  shortName: string
  strength: number
  endurance: number
  perception: number
  agility: number
  luck: number
  spirit: number
  intelligence: number
  speed: number
  faith: number
  beauty: number
  charisma: number
  movementPoints: number
  allegiance: string
  position: ICoords
  currentTurn: string
}

export interface ICell {
  position: ICoords
  character: ISingleCharacter | undefined
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
  movementPoints = 'СП',
  allegiance = 'Сторона',
  position = 'Местоположение',
  currentTurn = 'Ходит сейчас',
}
