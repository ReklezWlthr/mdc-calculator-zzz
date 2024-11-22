import _ from 'lodash'
import { Weapons } from '@src/data/db/weapons'
import { useStore } from '@src/data/providers/app_store_provider'
import { observer } from 'mobx-react-lite'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { useParams } from '@src/core/hooks/useParams'
import { useMemo } from 'react'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import { IWeaponEquip, StatIcons, Stats, Specialty } from '@src/domain/constant'
import classNames from 'classnames'
import { findCharacter } from '@src/core/utils/finder'
import getConfig from 'next/config'
import { Tooltip } from '@src/presentation/components/tooltip'
import { formatWeaponString, getWeaponBase, getWeaponBonus } from '@src/core/utils/data_format'
import { toPercentage } from '@src/core/utils/converter'
import { getRankImage, getWeaponImage } from '@src/core/utils/fetcher'
import { staticWeapons } from '../weapon_block'

const { publicRuntimeConfig } = getConfig()

interface WeaponModalProps {
  index: number
  pathOverride?: Specialty
  setWeapon?: (index: number, info: Partial<IWeaponEquip>) => void
}

export const WeaponModal = observer(({ index, setWeapon, pathOverride }: WeaponModalProps) => {
  const { teamStore, modalStore } = useStore()
  const { setParams, params } = useParams({
    searchWord: '',
    stat: [],
  })

  const set = setWeapon || teamStore.setWeapon

  const filteredWeapon = useMemo(
    () =>
      _.filter(_.orderBy(Weapons, ['rarity', 'name'], ['desc', 'asc']), (item) => {
        const regex = new RegExp(params.searchWord, 'i')
        const nameMatch = item.name.match(regex)
        const data = findCharacter(teamStore.characters[index]?.cId)
        const typeMatch = (pathOverride || data?.specialty) === item.type
        const statMatch = _.size(params.stat) ? _.includes(params.stat, item.ascStat) : true

        return nameMatch && typeMatch && statMatch
      }),
    [params]
  )

  const FilterIcon = ({ stat }: { stat: Stats }) => {
    const checked = _.includes(params.stat, stat)
    return (
      <div
        className={classNames('w-8 h-8 duration-200 rounded-full cursor-pointer hover:bg-primary-lighter', {
          'bg-primary-light': checked,
        })}
        onClick={() => setParams({ stat: checked ? _.without(params.stat, stat) : [...params.stat, stat] })}
        title={stat}
      >
        <img src={StatIcons[stat]} className="p-1.5" />
      </div>
    )
  }

  return (
    <div className="w-[85dvw] max-w-[1240px] p-4 text-white rounded-xl bg-primary-dark space-y-3 font-semibold">
      <div className="flex items-center gap-6 mobile:gap-3 mobile:flex-col">
        <div className="flex items-center gap-6">
          <p className="shrink-0">Select a Weapon</p>
          <div className="w-full">
            <TextInput
              onChange={(value) => setParams({ searchWord: value })}
              value={params.searchWord}
              placeholder="Search Weapon Name"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <FilterIcon stat={Stats.P_HP} />
          <FilterIcon stat={Stats.P_ATK} />
          <FilterIcon stat={Stats.P_DEF} />
          <FilterIcon stat={Stats.P_IMPACT} />
          <FilterIcon stat={Stats.ER} />
          <FilterIcon stat={Stats.CRIT_RATE} />
          <FilterIcon stat={Stats.CRIT_DMG} />
          <FilterIcon stat={Stats.AP} />
          <FilterIcon stat={Stats.PEN_RATIO} />
        </div>
      </div>
      <div className="grid w-full grid-cols-11 mobile:grid-cols-3 gap-4 max-h-[70dvh] overflow-y-auto hideScrollbar rounded-lg">
        {_.map(filteredWeapon, (item) => {
          const minAtk = getWeaponBase(item?.baseAtk, 0, 0)
          const maxAtk = getWeaponBase(item?.baseAtk, 60, 5)
          const minStat = toPercentage(item.baseStat || 0)
          const maxStat = toPercentage(getWeaponBonus(item.baseStat, 5) || 0)

          const component = (
            <div
              className="text-xs duration-200 border rounded-lg cursor-pointer bg-primary border-primary-border hover:scale-95"
              onClick={() => {
                set(index, { wId: item.id })
                if (_.includes(staticWeapons, item.id)) set(index, { refinement: 1 })
                modalStore.closeModal()
              }}
              key={item.name}
            >
              <div className="relative">
                <div className="absolute w-6 h-6 rounded-full top-2 left-2 bg-primary">
                  <img src={StatIcons[item.ascStat]} className="p-1" title={item.ascStat} />
                </div>
                {item.beta && (
                  <div className="absolute right-0 px-1.5 text-xs py-0.5 font-bold rounded-l-md bottom-6 bg-rose-600">
                    Beta
                  </div>
                )}
                <div className="absolute right-1 bottom-1">
                  <img src={getRankImage(item.rarity)} className="w-5 h-5" />
                </div>
                <img
                  src={getWeaponImage(item?.image)}
                  className="object-contain p-2 rounded-t-lg bg-primary-darker aspect-square"
                />
              </div>
              <div className="w-full h-10 px-2 py-1">
                <p className="text-center line-clamp-2">{item.name}</p>
              </div>
            </div>
          )

          return (
            <>
              <Tooltip
                key={item.id}
                title={
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-normal text-primary-lighter">{item.type}</p>
                      <p>{item.name}</p>
                    </div>
                    <div className="w-fit">
                      <img src={getRankImage(item.rarity)} className="w-5 h-5" />
                    </div>
                  </div>
                }
                body={
                  <div>
                    <div className="grid grid-cols-3 gap-2">
                      <p>
                        <b>Base ATK</b>: <span className="text-blue">{_.round(minAtk)}</span>{' '}
                        <span className="text-desc">({_.round(maxAtk)})</span>
                      </p>
                      <p className="col-span-2">
                        <b>{item.ascStat}</b>: <span className="text-blue">{minStat}</span>{' '}
                        <span className="text-desc">({maxStat})</span>
                      </p>
                    </div>
                    <div className="my-1 border-t border-primary-light" />
                    <b>{item.desc.name}</b>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: formatWeaponString(item?.desc?.detail, item?.desc?.properties, 1),
                      }}
                      className="font-normal"
                    />
                  </div>
                }
                style="w-[500px]"
                containerStyle="mobile:hidden block"
              >
                {component}
              </Tooltip>
              <div className="hidden mobile:block">{component}</div>
            </>
          )
        })}
      </div>
    </div>
  )
})
