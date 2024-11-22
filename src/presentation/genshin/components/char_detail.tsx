import { findBaseLevel, findMaxLevel, getBaseDef, getBaseStat } from '@src/core/utils/data_format'
import { findCharacter } from '@src/core/utils/finder'
import { useStore } from '@src/data/providers/app_store_provider'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import _ from 'lodash'
import ConditionalsObject from '@src/data/lib/stats/conditionals/conditionals'
import { TalentIcon } from './tables/scaling_wrapper'
import { StatIcons, Stats } from '@src/domain/constant'
import { useParams } from '@src/core/hooks/useParams'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { toPercentage } from '@src/core/utils/converter'
import { getAvatar, getTagsImage, getSpecialtyImage } from '@src/core/utils/fetcher'
import { CharDetailModal } from './modals/char_detail_modal'
import { StatBonusValue } from '@src/domain/scaling'

export const CharDetail = observer(() => {
  const { charStore, settingStore, teamStore, modalStore } = useStore()
  const selected = charStore.selected
  const data = findCharacter(selected)
  const charUpgrade = _.find(charStore.characters, ['cId', selected])
  const cond = _.find(ConditionalsObject, ['id', charStore.selected])?.conditionals(
    charUpgrade?.cons || 0,
    charUpgrade?.i || { i1: false, i2: false },
    charUpgrade?.talents || { normal: 1, skill: 1, lib: 1, forte: 1, intro: 1 },
    teamStore.characters
  )
  const talent = cond.talents

  const [loading, setLoading] = useState(true)

  const { params, setParams } = useParams({ asc: 7 })

  useEffect(() => {
    const elms = document.getElementsByClassName('cons')
    _.forEach(elms, (elm: HTMLImageElement) => (elm.style.display = 'none'))
    document.getElementById('detail_container').scrollTo(0, 0)
  }, [charStore.selected])

  useEffect(() => {
    setLoading(true)
  }, [data?.codeName])

  const onCalcSlider = useCallback(() => {
    const range = document.getElementsByClassName('slider')
    if (range) {
      _.forEach(range, (elm: HTMLInputElement) => {
        const bg = getComputedStyle(elm).getPropertyValue('--tw-gradient-to')
        const slider = getComputedStyle(elm).getPropertyValue('--tw-gradient-from')
        const min = Number(elm.min)
        const max = Number(elm.max) - min
        const value = ((Number(elm.value) - min) / max) * 100
        elm.setAttribute('style', `background:linear-gradient(to right,${slider},${slider} ${value}%,${bg} ${value}%)`)
      })
    }
  }, [])

  useEffect(() => {
    onCalcSlider()
  }, [params, talent])

  const baseLevel = params.asc === 7 ? 90 : findBaseLevel(params.asc)
  const asc = _.min([params.asc, 6])

  const fCodeName = data?.codeName === 'rover' ? settingStore.settings.travelerGender : data?.codeName

  const onOpenEditModal = useCallback(
    () => modalStore.openModal(<CharDetailModal char={charUpgrade} cId={selected} />),
    [charUpgrade, charStore.selected]
  )

  return (
    <div
      className="w-full h-full py-2 pr-5 ml-2 text-white customScrollbar mobile:hideScrollbar mobile:bg-primary-bg mobile:w-[400px] mobile:max-h-[80dvh] mobile:border mobile:border-primary-border mobile:rounded-lg mobile:px-2"
      id="detail_container"
    >
      <p className='hidden px-2 pt-2 text-xl font-bold mobile:block'>Resonator Detail</p>
      <div className="flex mobile:flex-col">
        <div className="relative w-2/3 pointer-events-none mobile:w-full aspect-square mobile:aspect-auto">
          <div
            className={classNames(
              'items-center justify-center w-full h-full aspect-square shrink-0',
              loading ? 'flex' : 'hidden'
            )}
          >
            <i className="text-6xl animate-spin fa-solid fa-circle-notch text-gray" />
          </div>
          <img
            src={getAvatar(fCodeName)}
            className={
              loading
                ? 'hidden'
                : 'block h-full object-cover overflow-visible relative pointer-events-none mx-auto mobile:max-h-[300px] scale-110'
            }
            onLoad={() => setLoading(false)}
          />
          <div className="absolute left-0 flex flex-col space-y-1 mobile:left-4 bottom-10">
            <div className="flex items-center gap-4">
              <div className="shrink-0 p-0.5">
                <ElementIcon element={data.element} size="w-8 h-8" transparent />
              </div>
              <img
                src={getSpecialtyImage(data.weapon)}
                className="p-0.5 bg-opacity-75 rounded-full w-9 h-9 shrink-0 bg-primary-bg"
              />
            </div>
            <p className="px-3 py-2 text-3xl font-semibold text-center break-words bg-opacity-75 rounded-lg bg-primary-bg">
              {data.name}
            </p>
            <div className="ml-3 w-fit">
              <RarityGauge rarity={data.rarity} textSize="text-xl" />
            </div>
          </div>
        </div>
        <div className="w-1/3 px-3 space-y-3 mobile:w-[85%] mobile:mx-auto">
          <div>
            <p className="font-bold">Base Stats</p>
            <input
              type="range"
              className="w-full h-2 slider bg-gradient-to-r from-primary-lighter to-gray shrink-0"
              step={1}
              min="0"
              max="7"
              value={params.asc}
              onChange={(e) => {
                const value = Number(e.target.value)
                setParams({ asc: value })
              }}
            />
            <div className="flex justify-between pl-2 text-xs text-gray">
              {_.map(Array(7), (_item, index) => (
                <p key={index}>{findBaseLevel(index)}</p>
              ))}
              <p>90</p>
            </div>
          </div>
          <div className="relative grid grid-cols-2 gap-2 px-5 py-3 text-xs rounded-lg bg-opacity-80 bg-primary-dark">
            <b>Base HP</b>
            <p className="text-center">
              {_.round(getBaseStat(Stats.HP, data?.stat?.baseHp, baseLevel, asc)).toLocaleString()}
            </p>
            <b>Base ATK</b>
            <p className="text-center">
              {_.round(getBaseStat(Stats.ATK, data?.stat?.baseAtk, baseLevel, asc)).toLocaleString()}
            </p>
            <b>Base DEF</b>
            <p className="text-center">{_.round(getBaseDef(data?.stat?.baseDef, baseLevel, asc)).toLocaleString()}</p>
            <div className="space-y-1 col-span-full">
              <b>Combat Roles</b>
              <div className="flex flex-wrap items-center gap-1">
                {_.map(data?.tags, (item) => (
                  <img src={getTagsImage(item)} className="w-6 h-6" title={item} key={item} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="px-3 py-1 rounded-lg bg-opacity-80 bg-primary-dark">
              <p className="font-bold">Account Data</p>
              <p className="text-[10px] font-normal text-gray">Will be used as Default Data</p>
            </div>
            <PrimaryButton title="Edit" onClick={onOpenEditModal} />
          </div>
          <div className="px-5 py-3 rounded-lg bg-primary-darker bg-opacity-80">
            {charUpgrade ? (
              <div className="text-xs">
                <div className="flex justify-between">
                  <p>
                    Level{' '}
                    <span className="text-desc">
                      {charUpgrade.level}/{findMaxLevel(charUpgrade.ascension)}
                    </span>
                  </p>
                  <p>
                    Sequence <span className="text-desc">{charUpgrade.cons}</span>
                  </p>
                </div>
                <p className="py-1.5 font-bold text-center">Forte</p>
                <div className="px-2 space-y-1">
                  <div className="flex justify-between">
                    <p>Normal Attack</p>
                    <p className="text-desc">{charUpgrade.talents?.normal}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Resonance Skill</p>
                    <p className="text-desc">{charUpgrade.talents?.skill}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Forte Circuit</p>
                    <p className="text-desc">{charUpgrade.talents?.forte}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Resonance Liberation</p>
                    <p className="text-desc">{charUpgrade.talents?.lib}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Intro Skill</p>
                    <p className="text-desc">{charUpgrade.talents?.intro}</p>
                  </div>
                </div>
                <p className="py-1.5 font-bold text-center">Inherent Skills</p>
                <div className="grid grid-cols-2">
                  {_.map(charUpgrade.i, (item, index) => (
                    <div className="flex items-center justify-around" key={index}>
                      <p>{index.toUpperCase()}</p>
                      <i
                        className={classNames('font-bold fa-solid', item ? 'text-heal fa-check' : 'text-red fa-times')}
                      />
                    </div>
                  ))}
                </div>
                <p className="py-1.5 font-bold text-center">Stat Bonus</p>
                <div className="px-2 space-y-1">
                  {_.map(data.growth, (g, i) => (
                    <div className="flex justify-between" key={i}>
                      <div className="flex items-center gap-1.5">
                        <img src={StatIcons[g]} className="w-4 h-4" />
                        <p>{g}</p>
                      </div>
                      <p className="text-desc">
                        {toPercentage(
                          (+charUpgrade?.growth?.[0 + i * 4] + +charUpgrade?.growth?.[1 + i * 4]) *
                            StatBonusValue[g][0] +
                            (+charUpgrade?.growth?.[2 + i * 4] + +charUpgrade?.growth?.[3 + i * 4]) *
                              StatBonusValue[g][1]
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray">Not Owned</p>
            )}
          </div>
        </div>
      </div>
      <p className="flex justify-center gap-2 mt-5 mb-1 text-2xl font-bold">
        <span className="text-desc">✦</span> Forte Circuit <span className="text-desc">✦</span>
      </p>
      <div className="grid gap-6 ml-2">
        {_.map(_.omit(talent, 'i1', 'i2', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6'), (item) => {
          return (
            item && (
              <div className="flex gap-x-3" key={item.trace}>
                <TalentIcon element={data.element} talent={item} size="w-10 h-10 mt-1" hideTip />
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-normal text-primary-lighter">{item.trace}</p>
                      <p className="font-semibold">{item.title}</p>
                      <div className="flex gap-1 text-xs opacity-80">
                        {!!item.tag && <p className="text-desc">[{item.tag}]</p>}
                      </div>
                    </div>
                  </div>
                  <p
                    className="pt-1.5 text-[13px] font-normal text-gray"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </div>
              </div>
            )
          )
        })}
        <p className="flex justify-center gap-2 mb-1 text-2xl font-bold">
          <span className="text-desc">✦</span> Inherent Skills <span className="text-desc">✦</span>
        </p>
        <div className="flex flex-col gap-5">
          {_.map([talent.i1, talent.i2], (item) => (
            <div className="flex gap-x-3" key={item.trace}>
              <TalentIcon element={data.element} talent={item} size="w-10 h-10" hideTip />
              <div>
                <p className="text-sm font-normal text-primary-lighter">{item?.trace}</p>
                <p className="font-semibold">{item.title}</p>
                <p
                  className="pt-1.5 text-[13px] font-normal text-gray"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="flex justify-center gap-2 mb-1 text-2xl font-bold">
          <span className="text-desc">✦</span> Resonance Chain <span className="text-desc">✦</span>
        </p>
        <div className="flex flex-col gap-5">
          {_.map([talent.c1, talent.c2, talent.c3, talent.c4, talent.c5, talent.c6], (item, i) => (
            <div className="flex gap-x-3" key={item.trace}>
              <div className="flex gap-3">
                <TalentIcon element={data.element} talent={item} size="w-10 h-10" hideTip />
                <div>
                  <p className="text-sm font-normal text-primary-lighter">{item.trace}</p>
                  <p className="font-semibold">{item.title}</p>
                  <p
                    className="pt-1.5 text-[13px] font-normal text-gray"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
