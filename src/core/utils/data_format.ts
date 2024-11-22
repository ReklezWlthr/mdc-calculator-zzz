import { MainStatValue, QualityMultiplier } from '@src/domain/artifact'
import { Element, IArtifactEquip, ICharacter, ITeamChar, Stats } from '@src/domain/constant'
import { NormalScaling, WeaponScaling, WeaponSecondaryScaling } from '@src/domain/scaling'
import _ from 'lodash'
import { findCharacter } from './finder'

export const findBaseLevel = (ascension: number) => {
  if (ascension < 0 || ascension > 6) return 0
  if (ascension === 0) return 1
  if (ascension === 1) return 20
  return (ascension + 2) * 10
}

export const findMaxLevel = (ascension: number) => {
  if (ascension < 0 || ascension > 6) return 0
  if (ascension === 0) return 20
  if (ascension === 1) return 40
  return findBaseLevel(ascension) + 10
}

export const isLevelInRange = (ascension: number, level: number) => {
  const low = findBaseLevel(ascension)
  const high = findMaxLevel(ascension)
  return level >= low && level <= high
}

export const getBaseStat = (base: number, growth: number, level: number = 1, ascension: number) => {
  return base + ((level === 0 ? 0 : level - 1) * growth) / 1e4 + ascension
}

export const getWeaponBase = (base: number, level: number = 0, ascension: number = 0) => {
  return base * (1 + (WeaponScaling[level] + WeaponSecondaryScaling[ascension]) / 1e4)
}

export const getWeaponBonus = (base: number, ascension: number = 0) => {
  return base * (1 + ascension * 0.3)
}

export const getMainStat = (main: Stats, quality: number, level: number, cost: number) => {
  const entry = _.find(MainStatValue, (item) => item.cost === cost && _.includes(item.stat, main))
  const actualBase = entry?.values * QualityMultiplier[quality]
  const maxValue = actualBase * 5
  const step = (maxValue - actualBase) / 25
  return actualBase + step * level
}

export const getSetCount = (artifacts: IArtifactEquip[]) => {
  const unique = _.uniqBy(artifacts, (item) => item?.setId)
  const setBonus: Record<string, number> = _.reduce(
    unique,
    (acc, curr) => {
      if (!curr) return acc
      acc[curr.sonata] ? (acc[curr.sonata] += 1) : (acc[curr.sonata] = 1)
      return acc
    },
    {}
  )
  return setBonus
}

export const getResonanceCount = (chars: ITeamChar[]) => {
  if (_.size(chars) < 4) return {}
  const charData = _.map(chars, (item) => findCharacter(item.cId))
  const setBonus: Record<string, number> = _.reduce(
    charData,
    (acc, curr) => {
      if (!curr) return acc
      acc[curr.element] ? (acc[curr.element] += 1) : (acc[curr.element] = 1)
      return acc
    },
    {}
  )
  return setBonus
}

export const calcScaling = (base: number, level: number) => {
  return 0
}

export const calcRefinement = (base: number, growth: number, refinement: number, override?: number[]) => {
  return override ? override[refinement - 1] : base + growth * (refinement - 1)
}

export const calcAmplifying = (em: number) => {
  return 2.78 * (em / (em + 1400))
}

export const calcAdditive = (em: number) => {
  return (em * 5) / (em + 1200)
}

export const calcTransformative = (em: number) => {
  return 16 * (em / (em + 2000))
}

export const formatWeaponString = (detail: string, properties: number[][], r: number, showMax?: boolean) =>
  _.reduce(
    Array.from(detail?.matchAll(/{{\d+}}\%?/g) || []),
    (acc, curr) => {
      const index = curr?.[0]?.match(/\d+/)?.[0]
      const isPercentage = !!curr?.[0]?.match(/\%$/)
      return _.replace(
        acc,
        curr[0],
        showMax
          ? `<span class="text-blue">${_.floor(properties[index][r - 1], 2)}${
              isPercentage ? '%' : ''
            }</span> <span class="text-desc">(${_.floor(properties[index][3], 2)}${isPercentage ? '%' : ''})</span>`
          : `<span class="text-desc">${_.floor(properties[index][r - 1], 2)}${isPercentage ? '%' : ''}</span>`
      )
    },
    detail
  )

export const swapElement = (array: any[], index1: number, index2: number) => {
  ;[array[index1], array[index2]] = [array[index2], array[index1]]
  return array
}

export const padArray = (array: any[], length: number, fill: any) => {
  return length > array.length ? array.concat(Array(length - array.length).fill(fill)) : array
}

export const romanize = (num: number) => {
  if (isNaN(num)) return NaN
  var digits = String(+num).split(''),
    key = [
      '',
      'C',
      'CC',
      'CCC',
      'CD',
      'D',
      'DC',
      'DCC',
      'DCCC',
      'CM',
      '',
      'X',
      'XX',
      'XXX',
      'XL',
      'L',
      'LX',
      'LXX',
      'LXXX',
      'XC',
      '',
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
    ],
    roman = '',
    i = 3
  while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman
  return Array(+digits.join('') + 1).join('M') + roman
}
