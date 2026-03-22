import type { ICoords } from '@/types/types.ts'

export interface permanentEffects {
  name: string
  modifiers?: SomeModifiers
}

interface SomeModifiers {
  strength?: number
  endurance?: number
  perception?: number
  agility?: number
  luck?: number
  spirit?: number
  intelligence?: number
  speed?: number
  faith?: number
  beauty?: number
  charisma?: number
  maxHealth?: number
  maxMovementPoints?: number
  initiative?: number
  accuracy?: number
  evasion?: number
  will?: number
  closeCombatDamage?: number
  critChance?: number
  skillPoints?: number
  attractiveness?: number
  actionPoints?: number
}

interface AllModifiers {
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
  maxHealth: number
  maxMovementPoints: number
  initiative: number
  accuracy: number
  evasion: number
  will: number
  closeCombatDamage: number
  critChance: number
  skillPoints: number
  attractiveness: number
  actionPoints: number
}

export default class Character {
  // Base attributes
  private _strength: number
  private _endurance: number
  private _perception: number
  private _agility: number
  private _luck: number
  private _spirit: number
  private _intelligence: number
  private _speed: number
  private _faith: number
  private _beauty: number
  private _charisma: number
  private _movementPoints: number

  public currentHealth: number
  public currentMovementPoints: number
  public position: ICoords

  readonly name: string
  readonly shortName: string
  readonly allegiance?: string

  // Modifiers
  permanentEffects: permanentEffects[]

  // Constants
  readonly initialHealth: number
  readonly initialCloseCombatDamage: number
  readonly initialInitiative: number
  readonly initialAccuracy: number
  readonly initialEvasion: number
  readonly initialCritChance: number
  readonly initialWill: number
  readonly initialSkillPoints: number
  readonly initialAttractiveness: number
  readonly initialActionPoints: number
  readonly noModifiers: AllModifiers

  constructor(name: string, shortName: string, allegiance: string, permanentEffects: permanentEffects[] = [], currentHealth = 100, currentMovementPoints = 2, position: ICoords = { x: 0, y: 0 }  ) {
    this.name = name
    this.shortName = shortName
    this.allegiance = allegiance
    this.permanentEffects = permanentEffects
    this.currentHealth = currentHealth
    this.currentMovementPoints = currentMovementPoints
    this.position = position

    // Base attributes
    this._strength = 1
    this._endurance = 1
    this._perception = 1
    this._agility = 1
    this._luck = 1
    this._spirit = 1
    this._intelligence = 1
    this._speed = 1
    this._faith = 1
    this._beauty = 1
    this._charisma = 1
    this._movementPoints = 2

    // Modifiers

    // Constants
    this.initialHealth = 100
    this.initialCloseCombatDamage = 75
    this.initialInitiative = 10
    this.initialAccuracy = 50
    this.initialEvasion = 0
    this.initialCritChance = 0
    this.initialWill = 5
    this.initialSkillPoints = 0
    this.initialAttractiveness = 0
    this.initialActionPoints = 0

    this.noModifiers = {
      strength: 0,
      endurance: 0,
      perception: 0,
      agility: 0,
      luck: 0,
      spirit: 0,
      intelligence: 0,
      speed: 0,
      faith: 0,
      beauty: 0,
      charisma: 0,
      maxHealth: 0,
      maxMovementPoints: 0,
      initiative: 0,
      accuracy: 0,
      evasion: 0,
      will: 0,
      closeCombatDamage: 0,
      critChance: 0,
      skillPoints: 0,
      attractiveness: 0,
      actionPoints: 0,
    }
  }

  // Getters for modifiers

  get modifiers(): AllModifiers {
    if (this.permanentEffects) {
      // need it to prevent mutation of noModifiers
      const initialAcc = { ...this.noModifiers }

      return this.permanentEffects.reduce((acc, effect) => {
        if (effect.modifiers) {
          for (const key of Object.keys(this.noModifiers) as (keyof AllModifiers)[]) {
            const modifierValue = effect.modifiers[key]
            if (modifierValue !== undefined) {
              acc[key] += modifierValue
            }
          }
        }
        return acc
      }, initialAcc)
    }
    return this.noModifiers
  }

  // Getters for base attributes with modifiers
  get strength(): number {
    return this._strength + this.modifiers.strength
  }

  get endurance(): number {
    return this._endurance + this.modifiers.endurance
  }

  get perception(): number {
    return this._perception + this.modifiers.perception
  }

  get agility(): number {
    return this._agility + this.modifiers.agility
  }

  get luck(): number {
    return this._luck + this.modifiers.luck
  }

  get spirit(): number {
    return this._spirit + this.modifiers.spirit
  }

  get intelligence(): number {
    return this._intelligence + this.modifiers.intelligence
  }

  get speed(): number {
    return this._speed + this.modifiers.speed
  }

  get faith(): number {
    return this._faith + this.modifiers.faith
  }

  get beauty(): number {
    return this._beauty + this.modifiers.beauty
  }

  get charisma(): number {
    return this._charisma + this.modifiers.charisma
  }

  get maxMovementPoints(): number {
    return this._movementPoints + this.modifiers.maxMovementPoints
  }

  // Derived properties
  get maxHealth(): number {
    if (this.endurance < 6) {
      return this.initialHealth + 25 * (this.endurance - 1)
    }
    const currentHealth = this.initialHealth + 100
    return Math.round(
      this.initialHealth +
        100 +
        0.2 * (this.endurance - 5) * currentHealth +
        this.modifiers.maxHealth,
    )
  }

  get closeCombatDamage(): number {
    return (
      this.initialCloseCombatDamage + 25 * (this.strength - 1) + this.modifiers.closeCombatDamage
    )
  }

  get initiative(): number {
    return this.initialInitiative + 2 * (this.speed - 1) + this.modifiers.initiative
  }

  get accuracy(): number {
    return this.initialAccuracy + 5 * (this.perception - 1) + this.modifiers.accuracy
  }

  get evasion(): number {
    return this.initialEvasion + 5 * (this.agility - 1) + this.modifiers.evasion
  }

  get critChance(): number {
    return this.initialCritChance + 5 * (this.luck - 1) + this.modifiers.critChance
  }

  get will(): number {
    return this.initialWill + (this.spirit - 1) + this.modifiers.will
  }

  get skillPoints(): number {
    return this.initialSkillPoints + this.intelligence + this.modifiers.skillPoints
  }

  get attractiveness(): number {
    return this.initialAttractiveness + 10 * (this.beauty - 1) + this.modifiers.attractiveness
  }

  get actionPoints(): number {
    return this.initialActionPoints + this.charisma + this.modifiers.actionPoints
  }

  get attributes(): AllModifiers {
    return {
      strength: this.strength,
      endurance: this.endurance,
      perception: this.perception,
      agility: this.agility,
      luck: this.luck,
      spirit: this.spirit,
      intelligence: this.intelligence,
      speed: this.speed,
      faith: this.faith,
      beauty: this.beauty,
      charisma: this.charisma,
      maxMovementPoints: this.maxMovementPoints,
      maxHealth: this.maxHealth,
      closeCombatDamage: this.closeCombatDamage,
      initiative: this.initiative,
      accuracy: this.accuracy,
      evasion: this.evasion,
      critChance: this.critChance,
      will: this.will,
      skillPoints: this.skillPoints,
      attractiveness: this.attractiveness,
      actionPoints: this.actionPoints,
    }
  }

  addPermanentModifier(modifier: permanentEffects) {
    this.permanentEffects.push(modifier)
  }

  removePermanentModifier(modifier: permanentEffects) {
    const index = this.permanentEffects.indexOf(modifier)
    if (index > -1) {
      // only splice array when item is found
      this.permanentEffects.splice(index, 1) // 2nd parameter means remove one item only
    }
  }

  refreshCurrentHealth() {
    this.currentHealth = this.maxHealth
  }
  refreshCurrentMovementPoints() {
    this.currentMovementPoints = this.maxMovementPoints
  }
}
