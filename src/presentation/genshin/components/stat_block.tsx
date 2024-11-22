import { observer } from 'mobx-react-lite'
import _ from 'lodash'
import { toPercentage } from '@src/core/utils/converter'

import { StatsObject, StatsObjectKeys } from '@src/data/lib/stats/baseConstant'
import { Stats } from '@src/domain/constant'

interface StatBlockProps {
  stat: StatsObject
}

export const StatBlock = observer(({ stat }: StatBlockProps) => {
  const DataRow = ({ title, value }: { title: string; value: number | string }) => {
    return (
      <div className="flex items-center gap-2 text-xs">
        <p className="shrink-0">{title}</p>
        <hr className="w-full border border-primary-border" />
        <p className="font-normal text-gray">{value.toLocaleString()}</p>
      </div>
    )
  }

  const ExtraDataRow = ({ title, base, bonus }: { title: string; base: number; bonus: number }) => {
    return (
      <div className="flex items-center gap-2 text-xs">
        <p className="shrink-0">{title}</p>
        <hr className="w-full border border-primary-border" />
        <div className="flex flex-col items-end shrink-0">
          <p className="font-normal text-gray">{(_.floor(base) + _.floor(bonus)).toLocaleString()}</p>
          <p className="font-normal text-neutral-400 text-[9px]">
            {_.floor(base).toLocaleString()}
            <span className="text-sky-300">{` +${_.floor(bonus).toLocaleString()}`}</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid w-full grid-flow-col grid-cols-2 p-4 font-bold text-white rounded-lg grid-rows-8 gap-y-1 gap-x-5 bg-primary-dark">
      <ExtraDataRow
        title="HP"
        base={stat?.BASE_HP}
        bonus={stat?.BASE_HP * stat?.getValue(Stats.P_HP) + stat?.getValue(Stats.HP)}
      />
      <ExtraDataRow
        title="ATK"
        base={stat?.BASE_ATK}
        bonus={stat?.BASE_ATK * stat?.getValue(Stats.P_ATK) + stat?.getValue(Stats.ATK)}
      />
      <ExtraDataRow
        title="DEF"
        base={stat?.BASE_DEF}
        bonus={stat?.BASE_DEF * stat?.getValue(Stats.P_DEF) + stat?.getValue(Stats.DEF)}
      />
      <ExtraDataRow
        title="Impact"
        base={stat?.BASE_IMPACT}
        bonus={stat?.BASE_IMPACT * stat?.getValue(Stats.P_IMPACT) + stat?.getValue(Stats.IMPACT)}
      />
      <DataRow title="CRIT Rate" value={toPercentage(stat?.getValue(Stats.CRIT_RATE))} />
      <DataRow title="CRIT DMG" value={toPercentage(stat?.getValue(Stats.CRIT_DMG))} />
      <DataRow title="Anomaly Mastery" value={stat?.getValue(Stats.AM).toLocaleString()} />
      <DataRow title="Anomaly Proficiency" value={stat?.getValue(Stats.AP).toLocaleString()} />
      <DataRow title="Physical DMG%" value={toPercentage(stat?.getValue(Stats.PHYSICAL_DMG))} />
      <DataRow title="Fire DMG%" value={toPercentage(stat?.getValue(Stats.FIRE_DMG))} />
      <DataRow title="Ice DMG%" value={toPercentage(stat?.getValue(Stats.ICE_DMG))} />
      <DataRow title="Electric DMG%" value={toPercentage(stat?.getValue(Stats.ELECTRIC_DMG))} />
      <DataRow title="Ether DMG%" value={toPercentage(stat?.getValue(Stats.ETHER_DMG))} />
      <DataRow title="PEN Ratio" value={toPercentage(stat?.getValue(Stats.PEN_RATIO))} />
      <DataRow title="PEN" value={stat?.getValue(Stats.PEN).toLocaleString()} />
      <DataRow title="Energy Regen" value={stat?.getValue(Stats.ER)} />
    </div>
  )
})
