import { Element, ITeamChar, TalentProperty } from '@src/domain/constant'
import _ from 'lodash'
import { makeAutoObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { StatsObjectKeysT } from '../lib/stats/baseConstant'

enableStaticRendering(typeof window === 'undefined')

export interface TSetup {
  char: ITeamChar[]
  name: string
  id: string
}

export type CustomSetterT = (
  innerIndex: number,
  key: StatsObjectKeysT,
  value: any,
  toggled: boolean,
  debuff?: boolean
) => void
export type CustomRemoverT = (_index: number, innerIndex: number) => void

export interface SetupStoreType {
  mode: string
  dmgMode: string
  team: TSetup[]
  tab: string
  selected: number[]
  main: TSetup
  mainChar: string
  comparing: TSetup[]
  custom: {
    name: StatsObjectKeysT
    value: number
    debuff: boolean
    toggled: boolean
  }[][][]
  forms: Record<string, any>[][]
  hydrated: boolean
  res: Record<Element, number>
  level: number | string
  enemy: string
  scaling: string
  toa: boolean
  setValue: <k extends keyof this>(key: k, value: this[k]) => void
  initForm: (i: number, initData: Record<string, any>[]) => void
  setForm: (index: number, value: Record<string, any>[]) => void
  setFormValue: (setupIndex: number, charIndex: number, key: string, value: any, sync: boolean) => void
  setComparing: (value: Partial<ITeamChar>) => void
  setRes: (element: Element, value: number) => void
  getDefMult: (level: number, defPen: number, defRed: number) => number
  getResMult: (element: Element, resPen: number) => number
  clearComparing: () => void
  setCustomValue: CustomSetterT
  removeCustomValue: CustomRemoverT
  saveTeam: (team: TSetup) => boolean
  editTeam: (tId: string, team: Partial<TSetup>) => boolean
  deleteTeam: (tId: string) => boolean
  findTeam: (tId: string) => TSetup
  hydrateTeams: (data: TSetup[]) => void
  hydrate: (data: SetupStoreType) => void
}

export class SetupStore {
  mode: string
  dmgMode: string
  selected: number[]
  tab: string
  team: TSetup[]
  main: TSetup
  mainChar: string
  comparing: TSetup[]
  custom: {
    name: StatsObjectKeysT
    value: number
    debuff: boolean
    toggled: boolean
  }[][][]
  hydrated: boolean = false
  forms: Record<string, any>[][]
  res: Record<Element, number>
  level: number | string
  enemy: string
  scaling: string
  toa: boolean

  constructor() {
    this.mode = 'avg'
    this.dmgMode = 'total'
    this.team = []
    this.tab = 'mod'
    this.selected = [0, 0]
    this.custom = Array(4).fill(Array(4))
    this.main = null
    this.mainChar = null
    this.comparing = Array(3)
    this.forms = Array(4)
    this.scaling = '1'
    this.res = {
      [Element.PHYSICAL]: 0,
      [Element.FUSION]: 0,
      [Element.GLACIO]: 0,
      [Element.ELECTRO]: 0,
      [Element.AERO]: 0,
      [Element.SPECTRO]: 0,
      [Element.HAVOC]: 0,
    }
    this.level = 1
    this.enemy = ''
    this.toa = false

    makeAutoObservable(this)
  }

  setValue = <k extends keyof this>(key: k, value: this[k]) => {
    this[key] = value
  }

  initForm = (i: number, initData: Record<string, any>[]) => {
    const mergedData = _.map(initData, (item, index) =>
      _.mapValues(item, (value, key) => {
        const old = this.forms[i]?.[index]?.[key]
        return _.isUndefined(old) ? value : old
      })
    )
    this.forms[i] = _.cloneDeep(mergedData)
  }

  setForm = (index: number, value: Record<string, any>[]) => {
    this.forms[index] = value
    this.forms = _.cloneDeep(this.forms)
  }

  setFormValue = (setupIndex: number, index: number, key: string, value: any, sync: boolean) => {
    this.forms[setupIndex][index][key] = value
    if (sync) {
      for (const form of this.forms) {
        if (!form) continue
        for (const char of form) {
          if (_.has(char, key)) char[key] = value
        }
      }
    }
    this.forms = _.cloneDeep(this.forms)
  }

  setRes = (element: Element, value: number) => {
    this.res[element] = value
  }

  getDefMult = (level: number, defPen: number = 0, defRed: number = 0) => {
    return (level + 100) / ((+this.level + 100) * (1 - defPen) * (1 - defRed) + level + 100)
  }

  getResMult = (element: Element, resPen: number) => {
    const res = this.res[element] / 100 - resPen
    if (res < 0) return 1 - res / 2
    if (res >= 0.75) return 1 / (4 * res + 1)
    return 1 - res
  }

  setComparing = (value: Partial<ITeamChar>) => {
    const [setupIndex, charIndex] = this.selected
    if (setupIndex === 0) {
      const dupeIndex = _.findIndex(this.main.char, ['cId', value?.cId])
      const oldData = _.cloneDeep(this.main.char[charIndex]) || null
      if (value?.equipments?.artifacts)
        _.forEach(value.equipments.artifacts, (aId) =>
          _.forEach(this.main.char, (character, cI) => {
            const i = _.findIndex(character.equipments.artifacts, (item) => item === aId)
            if (i >= 0 && cI !== charIndex) character.equipments.artifacts[i] = null
          })
        )
      this.main.char[charIndex] = { ...this.main.char[charIndex], ...value }
      if (dupeIndex >= 0 && dupeIndex !== charIndex) this.main.char[dupeIndex] = oldData
      this.main = _.cloneDeep(this.main)
    } else {
      const arr = this.comparing[setupIndex - 1]
      const dupeIndex = _.findIndex(arr.char, ['cId', value?.cId])
      const oldData = _.cloneDeep(arr.char[charIndex]) || null
      if (value?.equipments?.artifacts)
        _.forEach(value.equipments.artifacts, (aId) =>
          _.forEach(arr.char, (character, cI) => {
            const i = _.findIndex(character.equipments.artifacts, (item) => item === aId)
            if (i >= 0 && cI !== charIndex) character.equipments.artifacts[i] = null
          })
        )
      arr.char[charIndex] = { ...arr.char[charIndex], ...value }
      if (dupeIndex >= 0 && dupeIndex !== charIndex) this.comparing[setupIndex - 1].char[dupeIndex] = oldData
      this.comparing = _.cloneDeep(this.comparing)
    }
  }

  clearComparing = () => {
    const [setupIndex, charIndex] = this.selected
    if (setupIndex === 0) {
      this.main.char[charIndex] = null
      this.main = _.cloneDeep(this.main)
    } else {
      this.comparing[setupIndex - 1].char[charIndex] = null
      this.comparing = _.cloneDeep(this.comparing)
    }
  }

  setCustomValue = (
    innerIndex: number,
    key: StatsObjectKeysT,
    value: any,
    toggled: boolean,
    debuff: boolean = false
  ) => {
    const [setupIndex, charIndex] = this.selected
    if (innerIndex < 0) {
      this.custom[setupIndex][charIndex] = [
        ...(this.custom[setupIndex][charIndex] || []),
        { name: key, value, debuff, toggled },
      ]
    } else {
      this.custom[setupIndex][charIndex].splice(innerIndex, 1, { name: key, value, debuff, toggled })
    }
    this.custom = _.cloneDeep(this.custom)
  }

  removeCustomValue = (_index: number, innerIndex: number) => {
    const [setupIndex, charIndex] = this.selected
    this.custom[setupIndex][charIndex].splice(innerIndex, 1)
    this.custom = _.cloneDeep(this.custom)
  }

  saveTeam = (team: TSetup) => {
    if (!team) return false
    this.team = [...this.team, team]
    return true
  }

  editTeam = (tId: string, team: Partial<TSetup>) => {
    if (!team || !tId) return false
    const index = _.findIndex(this.team, ['id', tId])
    this.team[index] = { ...this.team[index], ...team }
    this.team = [...this.team]
    return true
  }

  deleteTeam = (tId: string) => {
    if (!tId) return false
    const index = _.findIndex(this.team, ['id', tId])
    this.team.splice(index, 1)
    this.team = [...this.team]
    return true
  }

  findTeam = (tId: string) => {
    return _.find(this.team, (item) => item.id === tId)
  }

  hydrateTeams = (data: TSetup[]) => {
    this.team = data || []
  }

  hydrate = (data: SetupStoreType) => {
    if (!data) return

    this.team = data.team || []
  }
}
