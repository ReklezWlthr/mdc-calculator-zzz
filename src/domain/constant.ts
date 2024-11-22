import { Sonata } from '@src/data/db/artifacts'
import { StatsObject, StatsObjectKeys } from '@src/data/lib/stats/baseConstant'

export enum Factions {
  HARES = 'Cunning Hares',
  VICTORIA = 'Victoria Housekeeping Co.',
  BELOBOG = 'Belobog Heavy Industries',
  CALYDON = 'Sons of Calydon',
  OBOL = 'Obol Squad',
  HSO = 'Hollow Special Operations Section 6',
  NEPS = 'Criminal Investigation Special Response Team',
}

export enum GenshinPage {
  TEAM = 'team',
  DMG = 'dmg',
  ER = 'er',
  IMPORT = 'import',
  BUILD = 'build',
  INVENTORY = 'inventory',
  CHAR = 'char',
  COMPARE = 'compare',
}

export enum Tags {
  BUFF = 'Buffer',
  DEBUFF = 'Debuffer',
  BATTERY = 'Battery',
  MAIN_DPS = 'Main DPS',
  SHIELD = 'Shielder',
  PARRY = 'Parry',
}

export interface ICharacterStats {
  baseAtk: number
  baseHp: number
  baseDef: number
  ascAtk: number
  ascHp: number
  ascDef: number
  ascStat: string
}

export interface ICharacter {
  name: string
  weapon: Specialty
  element: Element
  rarity: number
  stat: ICharacterStats
  codeName: string
}

export interface ITalentLevel {
  normal: number
  dodge: number
  assist: number
  special: number
  chain: number
  core: number
}

export interface ICharStoreBase {
  level: number
  ascension: number
  cons: number
  cId: string
  talents: ITalentLevel
}

export interface ICharStore extends ICharStoreBase {
  // id: string
}

export interface ITeamChar extends ICharStoreBase {
  equipments: { weapon: IWeaponEquip; artifacts: string[] }
}

export interface IBuild {
  id: string
  name: string
  cId: string
  isDefault: boolean
  weapon: IWeaponEquip
  artifacts: string[]
  note?: string
}

export interface IArtifact {
  id: string
  icon: string
  skill: string
  name: string
  sonata: Sonata[]
  desc: string
  properties: { base: number; growth: number }[]
  bonus?: (conditionals: StatsObject, rarity: number) => StatsObject
  cost: number
}

export interface IArtifactEquip {
  id: string
  setId: string
  level: number
  cost: number
  main: Stats
  quality: number
  subList: { stat: Stats; value: number }[]
  sonata: Sonata
}

export interface IWeapon {
  name: string
  rarity: number
  tier: number
  ascStat: string
  baseStat: number
  icon: string
  type: string
}

export interface IWeaponEquip {
  level: number
  ascension: number
  refinement: number
  wId: string
}

export enum Specialty {
  ATTACK = 'Attack',
  ANOMALY = 'Anomaly',
  STUN = 'Stun',
  DEFENSE = 'Defense',
  SUPPORT = 'Support',
}

export const SpecialtyIcon = {
  [Specialty.ATTACK]: '/attack.png',
  [Specialty.ANOMALY]: '/anomaly.png',
  [Specialty.STUN]: '/stun.png',
  [Specialty.DEFENSE]: '/defense.png',
  [Specialty.SUPPORT]: '/support.png',
}

export const RankImage = {
  S: 's_big.png',
  A: 'a_big.png',
  B: 'b_big.png',
}

export const DefaultWeaponImage = {
  [Specialty.ATTACK]: 'T_IconWeapon21020011_UI',
  [Specialty.ANOMALY]: 'T_IconWeapon21010011_UI',
  [Specialty.STUN]: 'T_IconWeapon21040011_UI',
  [Specialty.DEFENSE]: 'T_IconWeapon21030011_UI',
  [Specialty.SUPPORT]: 'T_IconWeapon21050011_UI',
}

export const DefaultWeaponId = {
  [Specialty.ATTACK]: '21020011',
  [Specialty.ANOMALY]: '21010011',
  [Specialty.STUN]: '21040011',
  [Specialty.DEFENSE]: '21030011',
  [Specialty.SUPPORT]: '21050011',
}

export enum TalentProperty {
  BA = 'Basic Attack',
  HA = 'Heavy Attack',
  SKILL = 'Resonance Skill',
  LIB = 'Res. Liberation',
  INTRO = 'Intro Skill',
  OUTRO = 'Outro Skill',
  HEAL = 'Heal',
  SHIELD = 'Shield',
  COORD = 'Coordinated Attack',
  ECHO = 'Echo Skill',
}

export enum Element {
  PHYSICAL = 'Physical',
  ICE = 'Ice',
  FIRE = 'Fire',
  ELECTRIC = 'Electric',
  ETHER = 'Ether',
}

export const ElementIcon = {
  [Element.FIRE]: '/IconFire.webp',
  [Element.ICE]: '/IconIce.webp',
  [Element.ELECTRIC]: '/IconElectric.webp',
  [Element.ETHER]: '/IconEther.webp',
  [Element.PHYSICAL]: '/IconPhysical.webp',
}

export enum Stats {
  HP = 'HP',
  ATK = 'ATK',
  DEF = 'DEF',
  P_HP = 'HP%',
  P_ATK = 'ATK%',
  P_DEF = 'DEF%',
  C_HP = 'HP',
  C_ATK = 'ATK',
  C_DEF = 'DEF',
  C_P_HP = 'HP%',
  C_P_ATK = 'ATK%',
  C_P_DEF = 'DEF%',
  CRIT_RATE = 'CRIT Rate',
  CRIT_DMG = 'CRIT DMG',
  ER = 'Energy Regen',
  FIRE_DMG = 'Fire DMG%',
  ICE_DMG = 'Ice DMG%',
  ELECTRIC_DMG = 'Electric DMG%',
  ETHER_DMG = 'Ether DMG%',
  PHYSICAL_DMG = 'Physical DMG%',
  AM = 'Anomaly Mastery',
  AP = 'Anomaly Proficiency',
  C_AM = 'Anomaly Mastery',
  C_AP = 'Anomaly Proficiency',
  PEN = 'PEN',
  PEN_RATIO = 'PEN Ratio',
  IMPACT = 'Impact',
  P_IMPACT = 'Impact%',
  ALL_DMG = 'DMG%',
}

export const StatIcons = {
  [Stats.P_HP]: '/asset/icons/hp.webp',
  [Stats.P_ATK]: '/asset/icons/atk.webp',
  [Stats.P_DEF]: '/asset/icons/def.webp',
  [Stats.ATK]: '/asset/icons/atk.webp',
  [Stats.HP]: '/asset/icons/hp.webp',
  [Stats.DEF]: '/asset/icons/def.webp',
  [Stats.CRIT_RATE]: '/asset/icons/crit_rate.webp',
  [Stats.CRIT_DMG]: '/asset/icons/crit_dmg.webp',
  [Stats.ER]: '/asset/icons/energy_regen.webp',
  [Stats.AM]: '/asset/icons/anomaly_mastery.webp',
  [Stats.AP]: '/asset/icons/anomaly_proficiency.webp',
  [Stats.IMPACT]: '/asset/icons/impact.webp',
  [Stats.P_IMPACT]: '/asset/icons/impact.webp',
  [Stats.PEN]: '/asset/icons/pen.webp',
  [Stats.PEN_RATIO]: '/asset/icons/pen_ratio.webp',
  [Stats.PHYSICAL_DMG]: '/asset/elements/IconPhysical.webp',
  [Stats.FIRE_DMG]: '/asset/elements/IconFire.webp',
  [Stats.ICE_DMG]: '/asset/elements/IconIce.webp',
  [Stats.ELECTRIC_DMG]: '/asset/elements/IconElectric.webp',
  [Stats.ETHER_DMG]: '/asset/elements/IconEther.webp',
}

export const Region = Object.freeze({
  1: 'Monstadt',
  2: 'Liyue',
  3: 'Inazuma',
  4: 'Sumeru',
  5: 'Fontaine',
  6: 'Natlan',
  7: 'Scheznaya',
})

export const ArtifactPiece = Object.freeze({
  1: 'Goblet of Eonothem',
  2: 'Plume of Death',
  3: 'Circlet of Logos',
  4: 'Flower of Life',
  5: 'Sands of Eon',
})

export const Promotion = [
  { name: 'P0', value: '0' },
  { name: 'P1', value: '1' },
  { name: 'P2', value: '2' },
  { name: 'P3', value: '3' },
  { name: 'P4', value: '4' },
  { name: 'P5', value: '5' },
].reverse()

export const MindScapeOptions = [
  { name: 'M0', value: '0' },
  { name: 'M1', value: '1' },
  { name: 'M2', value: '2' },
  { name: 'M3', value: '3' },
  { name: 'M4', value: '4' },
  { name: 'M5', value: '5' },
  { name: 'M6', value: '6' },
]

export const RefinementOptions = [
  { name: 'R1', value: '1' },
  { name: 'R2', value: '2' },
  { name: 'R3', value: '3' },
  { name: 'R4', value: '4' },
  { name: 'R5', value: '5' },
]

export const MainStatOptions = [
  { name: Stats.P_HP, value: Stats.P_HP, img: StatIcons[Stats.P_HP] },
  { name: Stats.P_ATK, value: Stats.P_ATK, img: StatIcons[Stats.P_ATK] },
  { name: Stats.P_DEF, value: Stats.P_DEF, img: StatIcons[Stats.P_DEF] },
  { name: Stats.IMPACT, value: Stats.IMPACT, img: StatIcons[Stats.IMPACT] },
  { name: Stats.ER, value: Stats.ER, img: StatIcons[Stats.ER] },
  { name: Stats.CRIT_RATE, value: Stats.CRIT_RATE, img: StatIcons[Stats.CRIT_RATE] },
  { name: Stats.CRIT_DMG, value: Stats.CRIT_DMG, img: StatIcons[Stats.CRIT_DMG] },
  { name: Stats.AM, value: Stats.AM, img: StatIcons[Stats.AM] },
  { name: Stats.AP, value: Stats.AP, img: StatIcons[Stats.AP] },
  { name: Stats.PEN_RATIO, value: Stats.PEN_RATIO, img: StatIcons[Stats.PEN_RATIO] },
  { name: Stats.PHYSICAL_DMG, value: Stats.PHYSICAL_DMG, img: StatIcons[Stats.PHYSICAL_DMG] },
  { name: Stats.FIRE_DMG, value: Stats.FIRE_DMG, img: StatIcons[Stats.FIRE_DMG] },
  { name: Stats.ICE_DMG, value: Stats.ICE_DMG, img: StatIcons[Stats.ICE_DMG] },
  { name: Stats.ELECTRIC_DMG, value: Stats.ELECTRIC_DMG, img: StatIcons[Stats.ELECTRIC_DMG] },
  { name: Stats.ETHER_DMG, value: Stats.ETHER_DMG, img: StatIcons[Stats.ETHER_DMG] },
]

export const SubStatOptions = [
  { name: Stats.HP, value: Stats.HP, img: StatIcons[Stats.HP] },
  { name: Stats.ATK, value: Stats.ATK, img: StatIcons[Stats.ATK] },
  { name: Stats.DEF, value: Stats.DEF, img: StatIcons[Stats.DEF] },
  { name: Stats.P_HP, value: Stats.P_HP, img: StatIcons[Stats.P_HP] },
  { name: Stats.P_ATK, value: Stats.P_ATK, img: StatIcons[Stats.P_ATK] },
  { name: Stats.P_DEF, value: Stats.P_DEF, img: StatIcons[Stats.P_DEF] },
  { name: Stats.ER, value: Stats.ER, img: StatIcons[Stats.ER] },
  { name: Stats.CRIT_RATE, value: Stats.CRIT_RATE, img: StatIcons[Stats.CRIT_RATE] },
  { name: Stats.CRIT_DMG, value: Stats.CRIT_DMG, img: StatIcons[Stats.CRIT_DMG] },
  { name: Stats.AP, value: Stats.AP, img: StatIcons[Stats.AP] },
  { name: Stats.PEN, value: Stats.PEN, img: StatIcons[Stats.PEN] },
]

export const CustomConditionalMap = {
  MELT_DMG: 'Melt DMG%',
  VAPE_DMG: 'Vaporize DMG%',
  BURNING_DMG: 'Burning DMG%',
  BLOOM_DMG: 'Melt DMG%',
  HYPERBLOOM_DMG: 'Hyperbloom DMG%',
  BURGEON_DMG: 'Burgeon DMG%',
  SPREAD_DMG: 'Spread DMG%',
  AGGRAVATE_DMG: 'Aggravate DMG%',
  TASER_DMG: 'Electro-Charged DMG%',
  OVERLOAD_DMG: 'Overloaded DMG%',
  SHATTER_DMG: 'Shattered DMG%',
  SWIRL_DMG: 'Swirl DMG%',
  SUPERCONDUCT_DMG: 'Superconduct DMG%',
  PYRO_F_DMG: 'Pyro Flat DMG',
  CRYO_F_DMG: 'Cryo Flat DMG',
  HYDRO_F_DMG: 'Hydro Flat DMG',
  ELECTRO_F_DMG: 'Electro Flat DMG',
  ANEMO_F_DMG: 'Anemo Flat DMG',
  GEO_F_DMG: 'Geo Flat DMG',
  DENDRO_F_DMG: 'Dendro Flat DMG',
  BASIC_F_DMG: 'Normal Attack Flat DMG',
  CHARGE_F_DMG: 'Charged Attack Flat DMG',
  PLUNGE_F_DMG: 'Plunging Attack Flat DMG',
  SKILL_F_DMG: 'Elemental Skill Flat DMG',
  BURST_F_DMG: 'Elemental Burst Flat DMG',
  BASIC_CR: 'Normal Attack CRIT Rate',
  CHARGE_CR: 'Charged Attack CRIT Rate',
  PLUNGE_CR: 'Plunging Attack CRIT Rate',
  SKILL_CR: 'Elemental Skill CRIT Rate',
  BURST_CR: 'Elemental Burst CRIT Rate',
  BASIC_CD: 'Normal Attack CRIT DMG',
  CHARGE_CD: 'Charged Attack CRIT DMG',
  PLUNGE_CD: 'Plunging Attack CRIT DMG',
  SKILL_CD: 'Elemental Skill CRIT DMG',
  BURST_CD: 'Elemental Burst CRIT DMG',
  DEF_REDUCTION: 'DEF Reduction (%)',
  ALL_TYPE_RES_PEN: 'All Type RES Reduction',
  PHYSICAL_RES_PEN: 'Physical RES Reduction',
  PYRO_RES_PEN: 'Pyro RES Reduction',
  HYDRO_RES_PEN: 'Hydro RES Reduction',
  CRYO_RES_PEN: 'Cryo RES Reduction',
  ELECTRO_RES_PEN: 'Electro RES Reduction',
  ANEMO_RES_PEN: 'Anemo RES Reduction',
  GEO_RES_PEN: 'Geo RES Reduction',
  DENDRO_RES_PEN: 'Dendro RES Reduction',
}
