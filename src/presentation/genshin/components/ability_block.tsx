import { observer } from 'mobx-react-lite'
import { TalentIcon } from './tables/scaling_wrapper'
import _ from 'lodash'
import { ITeamChar } from '@src/domain/constant'
import { ITalent } from '@src/domain/conditional'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import { findCharacter } from '@src/core/utils/finder'

export interface AbilityBlockProps {
  char: ITeamChar
  talents: ITalent
  onChange: (key: string, value: number) => void
  disabled?: boolean
}

export const AbilityBlock = observer(({ char, onChange, talents }: AbilityBlockProps) => {
  const maxCoreLevel = char.level < 15 ? 0 : _.ceil((char.level - 5) / 10)
  const coreLevels = _.map(Array(maxCoreLevel + 1), (_, index) => ({
    name: index ? String.fromCharCode(index + 96).toUpperCase() : '-',
    value: index.toString(),
  })).reverse()

  const maxTalentLevel = char.level < 15 ? 1 : char.level === 60 ? 12 : _.ceil((char.level - 5) / 10) * 2 + 1
  const talentLevels = _.map(Array(maxTalentLevel), (_, index) => ({
    name: (index + 1).toString(),
    value: (index + 1).toString(),
  })).reverse()

  const charData = findCharacter(char.cId)

  return (
    <div className="flex flex-col items-center">
      <p className="text-xl font-bold text-center text-white">
        <span className="mr-2 text-desc">✦</span>Skills<span className="ml-2 text-desc">✦</span>
      </p>
      <div className="flex items-center justify-center gap-3 py-2">
        <TalentIcon talent={talents?.normal} element={charData?.element} size="w-9 h-9" hideTip type="Basic Attack" />
        <div className="space-y-1">
          <p className="text-xs text-primary-lighter">Basic ATK</p>
          <SelectInput
            value={char?.talents?.normal?.toString()}
            onChange={(value) => onChange('normal', parseInt(value))}
            options={talentLevels}
            style="w-14 mr-2"
          />
        </div>
        <TalentIcon talent={talents?.skill} element={charData?.element} size="w-9 h-9" hideTip type="Dodge" />
        <div className="space-y-1">
          <p className="text-xs text-primary-lighter">Dodge</p>
          <SelectInput
            value={char?.talents?.dodge?.toString()}
            onChange={(value) => onChange('dodge', parseInt(value))}
            options={talentLevels}
            style="w-14"
          />
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 py-2">
        <TalentIcon talent={talents?.forte} element={charData?.element} size="w-9 h-9" hideTip type="Special Attack" />
        <div className="space-y-1">
          <p className="text-xs text-primary-lighter">Special</p>
          <SelectInput
            value={char?.talents?.special?.toString()}
            onChange={(value) => onChange('special', parseInt(value))}
            options={talentLevels}
            style="w-14 mr-2"
          />
        </div>
        <TalentIcon talent={talents?.lib} element={charData?.element} size="w-9 h-9" hideTip type="Chain Attack" />
        <div className="space-y-1">
          <p className="text-xs text-primary-lighter">Chain</p>
          <SelectInput
            value={char?.talents?.chain?.toString()}
            onChange={(value) => onChange('chain', parseInt(value))}
            options={talentLevels}
            style="w-14"
          />
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 py-2">
        <TalentIcon talent={talents?.intro} element={charData?.element} size="w-9 h-9" hideTip type="Assist Attack" />
        <div className="space-y-1">
          <p className="text-xs text-primary-lighter">Assist</p>
          <SelectInput
            value={char?.talents?.assist?.toString()}
            onChange={(value) => onChange('assist', parseInt(value))}
            options={talentLevels}
            style="w-14 mr-2  "
          />
        </div>
        <TalentIcon talent={talents?.lib} element={charData?.element} size="w-9 h-9" hideTip type="Core Skill" />
        <div className="space-y-1">
          <p className="text-xs text-primary-lighter">Core Skill</p>
          <SelectInput
            value={char?.talents?.core?.toString()}
            onChange={(value) => onChange('core', parseInt(value))}
            options={coreLevels}
            style="w-14"
          />
        </div>
      </div>
    </div>
  )
})
