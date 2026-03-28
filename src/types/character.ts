import type {IAttack, ICoords} from '@/types/types.ts'
import {getRandomNumber} from "@/helpers/helpers.ts";

export interface permanentEffects {
  name: string
  modifiers?: SomeModifiers
}

interface SomeModifiers {
  mind?: number;
  body?: number;
  insight?: number;
  fortitude?: number;
  liveliness?: number;
  aesthetics?: number;
  learnability?: number;
  spirit?: number;
  endurance?: number;
  maxHealth?: number;
  accuracy?: number;
  evasion?: number;
  defence?: number;
  defenceFromElements?: number;
  maxMovementPoints?: number;
  actionPoints?: number;
  charisma?: number;
  critChance?: number;
}

interface AllModifiers {
  mind: number;
  body: number;
  insight: number;
  fortitude: number;
  liveliness: number;
  aesthetics: number;
  learnability: number;
  spirit: number;
  endurance: number;
  maxHealth: number;
  accuracy: number;
  evasion: number;
  defence: number;
  defenceFromElements: number;
  maxMovementPoints: number;
  actionPoints: number;
  charisma: number;
  critChance: number;
}

export default class Character {
  // Base attributes
  private _baseMind: number
  private _baseBody: number
  private _baseInsight: number
  private _baseFortitude: number
  private _baseLiveliness: number
  private _baseAesthetics: number

  public currentHealth: number
  public currentMovementPoints: number
  public position: ICoords
  public numberOfAttacks: number
  public remainingAttacks: number

  readonly name: string
  readonly shortName: string
  readonly allegiance?: string

  // Modifiers
  permanentEffects: permanentEffects[]
  readonly noModifiers: AllModifiers


  constructor(name: string, shortName: string, allegiance: string, permanentEffects: permanentEffects[] = [], currentHealth = 100, currentMovementPoints = 2, position: ICoords = { x: 0, y: 0 }  ) {
    this.name = name
    this.shortName = shortName
    this.allegiance = allegiance
    this.permanentEffects = permanentEffects
    this.currentHealth = currentHealth
    this.currentMovementPoints = currentMovementPoints
    this.position = position
    this.numberOfAttacks = 1
    this.remainingAttacks = 1

    // Base attributes
    this._baseMind = 10
    this._baseBody = 10
    this._baseInsight = 10
    this._baseFortitude = 10
    this._baseLiveliness = 10
    this._baseAesthetics = 10

    this.noModifiers = {
      mind: 0,
      body: 0,
      insight: 0,
      fortitude: 0,
      liveliness: 0,
      aesthetics: 0,
      learnability: 0,
      spirit: 0,
      endurance: 0,
      maxHealth: 0,
      accuracy: 0,
      evasion: 0,
      defence: 0,
      defenceFromElements: 0,
      maxMovementPoints: 0,
      actionPoints: 0,
      charisma: 0,
      critChance: 0
    }
  }

    get attributes(): AllModifiers {
    return {
      mind: this.mind,
      body: this.body,
      insight: this.insight,
      fortitude: this.fortitude,
      liveliness: this.liveliness,
      aesthetics: this.aesthetics,
      learnability: this.learnability,
      spirit: this.spirit,
      endurance: this.endurance,
      maxHealth: this.maxHealth,
      accuracy: this.accuracy,
      evasion: this.evasion,
      defence: this.defence,
      defenceFromElements: this.defenceFromElements,
      maxMovementPoints: this.maxMovementPoints,
      actionPoints: this.actionPoints,
      charisma: this.charisma,
      critChance: this.critChance,
      remainingAttacks: this.remainingAttacks
    }
  }

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

  get mind(): number {
    return this._baseMind + this.modifiers.mind;
  }

  get body(): number {
    return this._baseBody + this.modifiers.body;
  }

  get insight(): number {
    return this._baseInsight + this.modifiers.insight;
  }

  get fortitude(): number {
    return this._baseFortitude + this.modifiers.fortitude;
  }

  get liveliness(): number {
    return this._baseLiveliness + this.modifiers.liveliness;
  }

  get aesthetics(): number {
    return this._baseAesthetics + this.modifiers.aesthetics;
  }

  get learnability() {
    return Math.floor(this.mind * 0.3) + this.modifiers.learnability
  }
  get spirit() {
    return (this.mind * 10) + this.modifiers.spirit
  }

  get endurance() {
    return this.body + this.modifiers.endurance
  }

  get maxHealth() {
    return (this.body * 10) + this.modifiers.maxHealth
  }

  get accuracy() {
    return (this.insight * 2) + this.modifiers.accuracy
  }

  get evasion() {
    return (this.insight * 2) + this.modifiers.evasion
  }

  get defence() {
    return this.fortitude + this.modifiers.fortitude
  }

  get defenceFromElements() {
    return this.fortitude + this.modifiers.fortitude
  }

  get maxMovementPoints() {
    return Math.floor(this.liveliness * 0.3) + this.modifiers.maxMovementPoints
  }

  get actionPoints() {
    return Math.floor(this.liveliness * 0.3) + this.modifiers.actionPoints
  }

  get charisma() {
    return this.aesthetics + this.modifiers.charisma
  }

  get critChance() {
    return this.aesthetics + this.modifiers.critChance
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
  refreshAttacks() {
    this.remainingAttacks = this.numberOfAttacks
  }
  partiallyRestoreHealth(healthToRestore: number) {
    if ((this.currentHealth + healthToRestore) > this.maxHealth) {
      this.currentHealth = this.maxHealth
    } else {
      this.currentHealth = this.currentHealth + healthToRestore
    }
  }


  attack(): IAttack {
    return {
      damage: this.closeCombatDamage,
      accuracy: this.accuracy,
      critChance: this.critChance,
      reach: 1,
      attackerName: this.name
    }
  }

  takeAttack(attack: IAttack): {log: string, remainingHealth: number} {
    let { accuracyLog, isHit } = this.checkIfHit(attack.accuracy, attack.attackerName)
    if (isHit) {
      const {damageLog, remainingHealth} = this.calculateDamage(attack.damage, attack.attackerName)
      const log = accuracyLog + '\n' + damageLog
      return { log, remainingHealth}
    } else {
      return { log: accuracyLog, remainingHealth: this.currentHealth}
    }
  }

  checkIfHit(accuracy: number, attackerName: string): {accuracyLog: string, isHit: boolean} {
    let accuracyLog = `${attackerName} кидает кубик на точность, результат: `
    const accuracyRoll = getRandomNumber(1, 20)
    accuracyLog = accuracyLog + `${accuracyRoll}, `
    const accuracyResult = accuracyRoll + accuracy
    accuracyLog = accuracyLog + `базовое значение меткости: ${accuracy}, общее значение: ${accuracyRoll} + ${accuracy} = ${accuracyResult}`
    accuracyLog = accuracyLog + '\n'
    accuracyLog = accuracyLog + `${this.name} кидает кубик на уклонение, результат: `
    const evasionRoll = getRandomNumber(1, 20)
    accuracyLog = accuracyLog + `${evasionRoll}, `
    const evasionResult = evasionRoll + this.evasion
    accuracyLog = accuracyLog + `базовое значение уклонения: ${this.evasion}, общее значение: ${evasionRoll} + ${this.evasion} = ${evasionResult}`
    accuracyLog = accuracyLog + `\n`
    if (accuracyResult >= evasionResult) {
      accuracyLog = accuracyLog + `Меткость (${accuracyResult}) >= уклонения (${evasionResult}). Попадание.`
      return { accuracyLog, isHit: true }
    } else {
      accuracyLog = accuracyLog + `Уклонение (${evasionResult}) > меткости (${accuracyResult}). Промах.`
      return { accuracyLog, isHit: false }
    }
  }

  calculateDamage(attackerDamage: number, attackerName: string): {damageLog: string, remainingHealth: number} {
    let damageLog = `${attackerName} кидает кубик на урон, результат: `
    const damageRoll = getRandomNumber(1, 6)
    damageLog = damageLog + `${damageRoll}, `
    const damageResult = attackerDamage + damageRoll
    damageLog = damageLog + '\n'
    damageLog = damageLog + `${this.name} кидает кубик на сопротивление к урону, результат: `
    const resistanceRoll = getRandomNumber(1, 6)
    damageLog = damageLog + `${resistanceRoll}`
    const remainingHealth = this.currentHealth - (attackerDamage + damageRoll) - resistanceRoll
    damageLog = damageLog + '\n'
    damageLog = damageLog + `${this.currentHealth} - (${attackerDamage} + ${damageRoll}) - ${resistanceRoll} = ${remainingHealth}`
    return {
      damageLog,
      remainingHealth
    }
  }

}
