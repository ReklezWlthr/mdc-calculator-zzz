import _ from 'lodash'
import { Characters } from '@src/data/db/characters'
import { useStore } from '@src/data/providers/app_store_provider'
import { observer } from 'mobx-react-lite'
import { Element, ITeamChar, Tags, Specialty } from '@src/domain/constant'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { useParams } from '@src/core/hooks/useParams'
import classNames from 'classnames'
import { useMemo } from 'react'
import { DefaultWeapon } from '@src/data/stores/team_store'
import { DefaultBuild } from '@src/data/stores/build_store'
import { findWeapon, isSubsetOf } from '@src/core/utils/finder'
import getConfig from 'next/config'
import { TagSelectInput } from '@src/presentation/components/inputs/tag_select_input'
import { getElementImage, getSpecialtyImage, getRankImage, getSquareAvatar } from '@src/core/utils/fetcher'

const { publicRuntimeConfig } = getConfig()

interface CharacterModalProps {
  index: number
  setChar?: (index: number, value: Partial<ITeamChar>) => void
}

export const CharacterModal = observer(({ index, setChar }: CharacterModalProps) => {
  const { teamStore, modalStore, buildStore, charStore, settingStore } = useStore()
  const { setParams, params } = useParams({
    searchWord: '',
    element: [],
    specialty: [],
    tags: [],
  })

  const selectedWeaponData = findWeapon(teamStore.characters[index]?.equipments?.weapon?.wId)

  const charSetter = setChar || teamStore.setMemberInfo

  const filteredChar = useMemo(
    () =>
      _.filter(
        Characters.sort((a, b) => a.name.localeCompare(b.name)),
        (item) => {
          const regex = new RegExp(params.searchWord, 'i')
          const nameMatch = item.name.match(regex)
          const elmMatch = _.size(params.element) ? _.includes(params.element, item.element) : true
          const specialtyMatch = _.size(params.specialty) ? _.includes(params.specialty, item.specialty) : true
          const tagsMatch = _.size(params.tags) ? isSubsetOf(params.tags, item.tags) : true

          return nameMatch && elmMatch && specialtyMatch && !!tagsMatch
        }
      ),
    [params]
  )

  const FilterIcon = ({ type, value }: { type: 'element' | 'specialty'; value: Element | Specialty }) => {
    const array = type === 'element' ? params.element : params.specialty
    const checked = _.includes(array, value)
    return (
      <div
        className={classNames(
          'w-8 h-8 duration-200 rounded-full cursor-pointer hover:bg-primary-lighter shrink-0 flex items-center justify-center',
          {
            'bg-primary-lighter': checked,
            'p-0.5': type === 'specialty',
          }
        )}
        onClick={() => setParams({ [type]: checked ? _.without(array, value) : [...array, value] })}
        title={value}
      >
        {type === 'element' ? (
          <img src={getElementImage(value)} className="p-1.5" />
        ) : (
          <img src={getSpecialtyImage(value)} />
        )}
      </div>
    )
  }

  return (
    <div className="desktop:w-[1220px] tablet:w-[85dvw] mobile:w-[85dvw] p-4 text-white rounded-xl bg-primary-dark space-y-3 font-semibold">
      <div className="flex items-center gap-6 mobile:gap-2 mobile:flex-col">
        <div className="flex items-center w-full gap-6">
          <p className="shrink-0">Select an Agent</p>
          <TextInput
            onChange={(value) => setParams({ searchWord: value })}
            value={params.searchWord}
            placeholder="Search Agent Name"
          />
        </div>
        <div className="flex gap-2">
          <FilterIcon type="element" value={Element.PHYSICAL} />
          <FilterIcon type="element" value={Element.ICE} />
          <FilterIcon type="element" value={Element.FIRE} />
          <FilterIcon type="element" value={Element.ELECTRIC} />
          <FilterIcon type="element" value={Element.ETHER} />
        </div>
        <div className="flex gap-2">
          <FilterIcon type="specialty" value={Specialty.ATTACK} />
          <FilterIcon type="specialty" value={Specialty.ANOMALY} />
          <FilterIcon type="specialty" value={Specialty.STUN} />
          <FilterIcon type="specialty" value={Specialty.SUPPORT} />
          <FilterIcon type="specialty" value={Specialty.DEFENSE} />
        </div>
        <TagSelectInput
          options={_.map(Tags, (item) => ({ name: item, value: item }))}
          onChange={(v) => setParams({ tags: v })}
          placeholder="Select Combat Roles (Match All)"
          small
          style="w-[250px]"
          values={params.tags}
          // onlyShowCount
          renderAsText
        />
      </div>
      <div className="grid w-full grid-cols-11 tablet:grid-cols-7 mobile:grid-cols-3 gap-4 max-h-[70dvh] mobile:max-h-[59dvh] overflow-y-auto hideScrollbar rounded-lg">
        {_.size(filteredChar) ? (
          _.map(filteredChar, (item) => {
            const owned = _.includes(_.map(charStore.characters, 'cId'), item.id)
            const codeName = item.order === '4' && settingStore.settings.travelerGender === 'zhujue' ? '5' : item.order
            return (
              <div
                className="w-full text-xs duration-200 border rounded-lg cursor-pointer bg-primary border-primary-border hover:scale-95"
                onClick={() => {
                  const build = _.find(buildStore.builds, (build) => build.isDefault && build.cId === item.id)
                  const char = _.find(charStore.characters, (char) => char.cId === item.id)
                  if (item.specialty !== selectedWeaponData?.type && teamStore.characters[index]?.equipments?.weapon)
                    teamStore.setWeapon(index, DefaultWeapon)
                  charSetter(index, {
                    cId: item.id,
                    ascension: char?.ascension || 0,
                    level: char?.level || 1,
                    talents: char?.talents || { normal: 1, dodge: 1, assist: 1, special: 1, chain: 1, core: 0 },
                    equipments: build ? { weapon: build.weapon, artifacts: build.artifacts } : DefaultBuild,
                    cons: char?.cons || 0,
                  })
                  modalStore.closeModal()
                }}
                key={item.name}
              >
                <div className="relative">
                  <div className="absolute bottom-1 left-1 z-[1] flex gap-0.5">
                    <div className="flex items-center justify-center bg-opacity-75 rounded-full bg-primary-dark p-0.5">
                      <img src={getSpecialtyImage(item?.specialty)} className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-center p-1 bg-opacity-75 rounded-full bg-primary-dark">
                      <img src={getElementImage(item?.element)} className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center bg-opacity-75 rounded-full absolute top-1.5 right-1.5 z-[1]">
                    <img src={getRankImage(item?.rarity)} className="w-5 h-5" />
                  </div>
                  {owned && (
                    <div className="absolute px-1.5 py-1 text-xs rounded-lg top-1 right-1 bg-primary font-bold z-[1]">
                      M{_.find(charStore.characters, ['cId', item.id])?.cons || 0}
                    </div>
                  )}
                  {item.beta && (
                    <div className="absolute right-0 px-1.5 text-xs py-0.5 font-bold rounded-l-md bottom-1 bg-rose-600 z-[1]">
                      Beta
                    </div>
                  )}
                  <div className="flex items-end justify-center overflow-hidden rounded-t-lg bg-primary-darker">
                    <img src={getSquareAvatar(codeName)} className="object-cover aspect-square" />
                  </div>
                </div>
                <p className="py-1 text-center line-clamp-1">{item.name}</p>
              </div>
            )
          })
        ) : (
          <div className="flex items-center justify-center w-full h-[70dvh] mobile:h-[60dvh] col-span-full text-xl">
            No Matching Resonator
          </div>
        )}
      </div>
    </div>
  )
})
