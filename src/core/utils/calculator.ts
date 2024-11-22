import { getBaseStat, getMainStat, getSetCount, getWeaponBase, getWeaponBonus } from '../utils/data_format'
import _ from 'lodash'
import { Element, IArtifactEquip, ITeamChar, IWeaponEquip, Stats, Specialty } from '@src/domain/constant'
import { findCharacter, findWeapon } from '../utils/finder'
import { baseStatsObject, StatsObject } from '@src/data/lib/stats/baseConstant'
import WeaponBonus from '@src/data/lib/stats/conditionals/weapons/weapon_bonus'

export const calculateOutOfCombat = (
  conditionals: StatsObject,
  selected: number,
  team: ITeamChar[],
  artifacts: IArtifactEquip[],
  applyResonance: boolean,
  includeTeam: boolean
) => {
  if (!_.size(team) || !team?.[selected]) return conditionals
  const base = calculateBase(conditionals, team[selected], team[selected]?.equipments?.weapon, includeTeam ? team : [])
  const final = addArtifactStats(base, artifacts)

  return final
}

export const calculateFinal = (conditionals: StatsObject) => {
  const cb = conditionals.CALLBACK
  let x = conditionals
  _.forEach(cb, (item) => {
    x = item(x, [])
  })
  return x
}

export const calculateBase = (conditionals: StatsObject, char: ITeamChar, weapon: IWeaponEquip, team: ITeamChar[]) => {
  const character = findCharacter(char?.cId)
  const weaponData = findWeapon(weapon?.wId)

  const charBaseAtk = _.floor(
    getBaseStat(
      character?.stat?.baseAtk,
      character?.stat?.growthAtk,
      char?.level,
      character?.stat?.ascAtk?.[char?.ascension]
    ) || 0
  )
  const weaponBaseAtk = _.floor(getWeaponBase(weaponData?.baseAtk, weapon?.level, weapon?.ascension) || 0)
  const weaponSecondary = getWeaponBonus(weaponData?.baseStat, weapon?.ascension)
  const weaponBonus = _.find(WeaponBonus, (item) => item.id === weapon?.wId)

  conditionals.NAME = character?.name?.replaceAll(/\(\w+\)/g, '')?.trim()
  conditionals.ELEMENT = character?.element
  conditionals.SPECIALTY = character?.specialty
  conditionals.MAX_ENERGY = 0

  // Get Base
  conditionals.BASE_ATK = charBaseAtk + weaponBaseAtk
  conditionals.BASE_ATK_C = charBaseAtk
  conditionals.BASE_ATK_L = weaponBaseAtk
  conditionals.BASE_IMPACT = character?.stat?.baseImpact
  conditionals.BASE_HP = _.floor(
    getBaseStat(
      character?.stat?.baseHp,
      character?.stat?.growthHp,
      char?.level,
      character?.stat?.ascHp?.[char?.ascension]
    ) || 0
  )
  conditionals.BASE_DEF = _.floor(
    getBaseStat(
      character?.stat?.baseDef,
      character?.stat?.growthDef,
      char?.level,
      character?.stat?.ascDef?.[char?.ascension]
    ) || 0
  )

  // Get Ascension
  conditionals[weaponData?.ascStat]?.push({
    value: weaponSecondary,
    source: weaponData?.name,
    name: 'Secondary Stat',
  })

  conditionals = weaponBonus?.scaling(conditionals, weapon?.refinement, team) || conditionals

  return conditionals
}

export const addArtifactStats = (conditionals: StatsObject, artifacts: IArtifactEquip[]) => {
  const setBonus = getSetCount(artifacts)
  const main = _.reduce(
    artifacts,
    (acc, curr) => {
      if (!acc[curr?.main]) acc[curr?.main] = 0
      acc[curr?.main] += getMainStat(curr.main, curr.quality, curr.level, curr.cost)
      return acc
    },
    {} as Record<Stats, number>
  )
  _.forEach(main, (item, key) => {
    conditionals[key]?.push({
      name: `Main Stat`,
      source: 'Drive Disk',
      value: item,
    })
  })
  const sub = _.reduce(
    _.flatMap(artifacts, (item) => item.subList),
    (acc, curr) => {
      if (!acc[curr?.stat]) acc[curr?.stat] = 0
      acc[curr?.stat] += curr.value
      return acc
    },
    {} as Record<Stats, number>
  )
  _.forEach(sub, (item, key) => {
    conditionals[key]?.push({
      name: `Sub Stat`,
      source: 'Drive Disk',
      value: item,
    })
  })
  _.forEach(setBonus, (count, sonata) => {
    if (count >= 2) {
      // const bonus = SonataDetail[sonata]?.[0]?.bonus
      // if (bonus)
      //   conditionals[bonus.stat].push({
      //     name: `2 Piece`,
      //     source: sonata,
      //     value: bonus.value,
      //   })
    }
    if (count >= 4) {
      // const bonus = SonataDetail[sonata]?.[1]?.bonus
      // if (bonus)
      //   conditionals[bonus.stat].push({
      //     name: `5 Piece`,
      //     source: sonata,
      //     value: bonus.value,
      //   })
    }
  })

  return conditionals
}

export const getTeamOutOfCombat = (chars: ITeamChar[], artifacts: IArtifactEquip[]) => {
  const applyRes = _.size(_.filter(chars, (item) => !!item.cId)) >= 4
  return _.map(Array(4), (_v, i) =>
    calculateOutOfCombat(
      _.cloneDeep(baseStatsObject),
      i,
      chars,
      _.filter(artifacts, (item) => _.includes(chars?.[i]?.equipments?.artifacts, item.id)),
      applyRes,
      true
    )
  )
}
