import { ICharStore } from '@src/domain/constant'
import _ from 'lodash'
import { makeAutoObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'
import { Characters } from '../db/characters'

enableStaticRendering(typeof window === 'undefined')

export const DefaultCharacterStore = {
  level: 1,
  ascension: 0,
  cons: 0,
  cId: null,
  talents: {
    normal: 1,
    dodge: 1,
    assist: 1,
    special: 1,
    chain: 1,
    core: 0,
  },
}

export const DefaultAccount = _.map(['1202', '1402', '1501', '1103'], (cId) => ({
  ...DefaultCharacterStore,
  cId,
}))

export interface CharacterStoreType {
  characters: ICharStore[]
  selected: string
  loading: boolean
  hydrated: boolean
  setValue: <k extends keyof this>(key: k, value: this[k]) => void
  addChar: (char: ICharStore) => boolean
  editChar: (id: string, char: ICharStore) => boolean
  deleteChar: (id: string) => boolean
  hydrateCharacters: (data: ICharStore[]) => void
  hydrate: (data: CharacterStoreType) => void
}

export class CharacterStore {
  characters: ICharStore[]
  selected: string
  loading: boolean
  hydrated: boolean = false

  constructor() {
    this.characters = DefaultAccount
    this.selected = _.head(_.orderBy(Characters, ['name'])).id
    this.loading = true

    makeAutoObservable(this)
  }

  setValue = <k extends keyof this>(key: k, value: this[k]) => {
    this[key] = value
  }

  addChar = (char: ICharStore) => {
    if (!char) return false
    this.characters = [char, ...this.characters]
    return true
  }

  editChar = (id: string, char: ICharStore) => {
    if (!char || !id) return false
    const index = _.findIndex(this.characters, ['cId', id])
    this.characters[index] = char
    return true
  }

  deleteChar = (id: string) => {
    if (!id) return false
    const index = _.findIndex(this.characters, ['cId', id])
    this.characters.splice(index, 1)
    this.characters = [...this.characters]
    return true
  }

  hydrateCharacters = (data: ICharStore[]) => {
    this.characters = data || DefaultAccount
  }

  hydrate = (data: CharacterStoreType) => {
    if (!data) return

    this.characters = data.characters || DefaultAccount
  }
}
