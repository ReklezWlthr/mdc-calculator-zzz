import { Element, ElementIcon, SpecialtyIcon, Specialty, RankImage } from '@src/domain/constant'

export const getEmote = (emote: string) => `https://cdn.wanderer.moe/genshin-impact/emotes/${emote}.png`

export const getElementImage = (value: string) => `/asset/elements/${ElementIcon[value]}`

export const getSpecialtyImage = (value: string) => `/asset/icons/${SpecialtyIcon[value]}`

export const getRankImage = (value: string) => `/asset/icons/${RankImage[value]}`

export const getAvatar = (order: string) => `/asset/avatar/full/IconRole${order}.webp`

export const getSideAvatar = (order: string) => (order ? `/asset/avatar/portrait/IconRoleSelect${order}.webp` : '')

export const getSquareAvatar = (order: string) => (order ? `/asset/avatar/square/IconRoleSelect${order}.png` : '')

export const getGachaAvatar = (path: string) => (path ? `/asset/avatar/gacha/UI_Gacha_AvatarImg_${path}.webp` : '')

export const getTalentIcon = (path: string) => `/asset/talent/${path}.webp`

export const getWeaponImage = (path: string) => (path ? `/asset/weapon/${path}` : '')

export const getEchoImage = (path: string) => `/asset/echo/${path}.webp`
