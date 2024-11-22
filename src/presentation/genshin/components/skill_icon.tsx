import { SkillIcon } from './tables/scaling_wrapper'

export const MiniSkillIcon = ({ type }: { type: string }) => {
  return <img src={SkillIcon[type]} className="inline-block w-5 h-5" />
}
