import { findCharacter } from '@src/core/utils/finder'
import { useStore } from '@src/data/providers/app_store_provider'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import { ScalingSubRows } from '../components/tables/scaling_sub_rows'
import { ScalingWrapper } from '../components/tables/scaling_wrapper'
import { StatBlock } from '../components/stat_block'
import { CharacterSelect } from '../components/character_select'
import { ConsCircle } from '../components/cons_circle'
import { ConditionalBlock } from '../components/conditionals/conditional_block'
import classNames from 'classnames'
import { AscensionIcons } from '../components/ascension_icons'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { EnemyModal } from '../components/modals/enemy_modal'
import { WeaponConditionalBlock } from '../components/conditionals/weapon_conditional_block'
import { useCalculator } from '@src/core/hooks/useCalculator'
import { CustomConditionalBlock } from '../components/conditionals/custom_conditional_block'
import { StatsModal } from '../components/modals/stats_modal'
import { Echoes } from '@src/data/db/artifacts'
import { ITalentDisplay } from '@src/domain/conditional'
import { formatWeaponString } from '@src/core/utils/data_format'

export const Calculator = observer(({}: {}) => {
  const { teamStore, modalStore, calculatorStore, settingStore, artifactStore } = useStore()
  const { selected, computedStats } = calculatorStore

  const [tab, setTab] = useState('mod')

  const char = teamStore.characters[selected]
  const charData = findCharacter(char.cId)

  const { main, mainComputed, contents, finalStats } = useCalculator({})

  const onOpenEnemyModal = useCallback(() => modalStore.openModal(<EnemyModal stats={mainComputed} />), [mainComputed])

  const onOpenStatsModal = useCallback(
    () => modalStore.openModal(<StatsModal stats={mainComputed} weapon={charData.specialty} />),
    [mainComputed, charData, finalStats]
  )
  const mainEchoData = _.find(artifactStore.artifacts, (item) => char?.equipments?.artifacts?.[0] === item.id)
  const mainEcho = _.find(Echoes, (item) => item.id === mainEchoData?.setId)
  const echoTalent: ITalentDisplay = {
    trace: 'Echo Skill',
    title: mainEcho?.name,
    content: formatWeaponString(mainEcho?.desc, mainEcho?.properties, mainEchoData?.quality - 1),
    image: mainEcho?.skill,
  }

  return (
    <div className="w-full overflow-y-auto customScrollbar mobile:overflow-visible">
      <div className="grid w-full grid-cols-3 mobile:grid-cols-2 gap-5 p-5 text-white max-w-[1200px] mx-auto">
        <div className="col-span-2">
          <div className="flex items-center">
            <div className="flex justify-center w-full gap-4 pt-1 pb-3">
              {_.map(teamStore?.characters, (item, index) => {
                const currentChar = findCharacter(item.cId)
                return (
                  <CharacterSelect
                    key={`char_select_${index}`}
                    onClick={() => calculatorStore.setValue('selected', index)}
                    isSelected={index === selected}
                    order={
                      currentChar?.order === '4' && settingStore.settings?.travelerGender === 'zhujue'
                        ? '5'
                        : currentChar?.order
                    }
                  />
                )
              })}
            </div>
            <PrimaryButton onClick={onOpenEnemyModal} title="Enemy Setting" style="whitespace-nowrap" />
          </div>
          {teamStore?.characters[selected]?.cId ? (
            <>
              <div className="flex flex-col mb-5 text-sm rounded-lg bg-primary-darker h-fit">
                <div className="flex flex-col items-center justify-center px-2 py-1 text-lg font-bold text-center rounded-t-lg bg-primary-light">
                  <p>Damage Calculation</p>
                  <p className="text-xs font-normal text-gray">
                    Click on <b>Skill Icon</b> for Description <span className="text-desc">✦</span> Hover on{' '}
                    <b>Damage Number</b> for Formula Breakdown
                  </p>
                </div>
                <div className="flex justify-end w-full mb-1.5 bg-primary-dark">
                  <div className="grid w-4/5 grid-cols-8 gap-2 py-0.5 pr-2 text-sm font-bold text-center bg-primary-dark mobile:hidden">
                    <p className="col-span-2">Property</p>
                    <p className="col-span-1">Type</p>
                    <p className="col-span-1">Base</p>
                    <p className="col-span-1">Crit</p>
                    <p className="col-span-1">Average</p>
                  </div>
                </div>
                <ScalingWrapper talent={main?.talents?.normal} element={charData.element} level={char.talents?.normal}>
                  {_.map(mainComputed?.BASIC_SCALING, (item) => (
                    <ScalingSubRows key={item.name} scaling={item} />
                  ))}
                </ScalingWrapper>
                <div className="w-full my-2 border-t-2 border-primary-border" />
                <ScalingWrapper talent={main?.talents?.dodge} element={charData.element} level={char.talents?.dodge}>
                  {_.map(mainComputed?.DODGE_SCALING, (item) => (
                    <ScalingSubRows key={item.name} scaling={item} />
                  ))}
                </ScalingWrapper>
                <div className="w-full my-2 border-t-2 border-primary-border" />
                <ScalingWrapper talent={main?.talents?.assist} element={charData.element} level={char.talents?.assist}>
                  {_.map(mainComputed?.ASSIST_SCALING, (item) => (
                    <ScalingSubRows key={item.name} scaling={item} />
                  ))}
                </ScalingWrapper>
                <div className="w-full my-2 border-t-2 border-primary-border" />
                <ScalingWrapper
                  talent={main?.talents?.special}
                  element={charData.element}
                  level={char.talents?.special}
                >
                  {_.map(mainComputed?.SPECIAL_SCALING, (item) => (
                    <ScalingSubRows key={item.name} scaling={item} />
                  ))}
                </ScalingWrapper>
                <div className="w-full my-2 border-t-2 border-primary-border" />
                <ScalingWrapper talent={main?.talents?.chain} element={charData.element} level={char.talents?.chain}>
                  {_.map(mainComputed?.CHAIN_SCALING, (item) => (
                    <ScalingSubRows key={item.name} scaling={item} />
                  ))}
                </ScalingWrapper>
                <div className="w-full my-2 border-t-2 border-primary-border" />
                <ScalingWrapper talent={main?.talents?.core} element={charData.element} level={char.talents?.core}>
                  {_.map(mainComputed?.CORE_SCALING, (item) => (
                    <ScalingSubRows key={item.name} scaling={item} />
                  ))}
                </ScalingWrapper>
                {mainEcho && (
                  <>
                    <div className="w-full my-2 border-t-2 border-primary-border" />
                    <ScalingWrapper talent={echoTalent} element={'Echo' as any}>
                      {_.map(mainComputed?.ECHO_SCALING, (item) => (
                        <ScalingSubRows key={item.name} scaling={item} />
                      ))}
                    </ScalingWrapper>
                  </>
                )}
                <div className="h-2" />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full text-xl rounded-lg h-[66dvh] bg-primary-darker">
              No Character Selected
            </div>
          )}
        </div>
        <div className="flex flex-col items-center w-full gap-3 mobile:col-span-full">
          <div className="flex gap-5">
            <div
              className={classNames('rounded-lg px-2 py-1 text-white cursor-pointer duration-200', {
                'bg-primary': tab === 'mod',
              })}
              onClick={() => setTab('mod')}
            >
              Modifiers
            </div>
            <div
              className={classNames('rounded-lg px-2 py-1 text-white cursor-pointer duration-200', {
                'bg-primary': tab === 'stats',
              })}
              onClick={() => setTab('stats')}
            >
              Stats
            </div>
          </div>
          {tab === 'mod' && (
            <>
              <p className="w-full px-3 py-2 text-xs text-center rounded-lg bg-primary-dark text-gray">
                Hover over <b>Modifier Names</b> for More Info
              </p>
              <ConditionalBlock title="Self Modifiers" contents={_.filter(contents.main, 'show')} />
              <ConditionalBlock title="Team Modifiers" contents={_.filter(contents.team, 'show')} />
              <WeaponConditionalBlock contents={contents.weapon(selected)} />
              <ConditionalBlock title="Echo Modifiers" contents={contents.artifact(selected)} />
              <CustomConditionalBlock index={selected} />
            </>
          )}
          {tab === 'stats' && (
            <>
              <div className="flex items-center justify-between w-full">
                <p className="px-4 text-lg font-bold">
                  <span className="text-desc">✦</span> Final Stats <span className="text-desc">✦</span>
                </p>
                {charData && <PrimaryButton title="Stats Breakdown" onClick={onOpenStatsModal} />}
              </div>
              <StatBlock stat={computedStats[selected]} />
              {charData && (
                <>
                  <ConsCircle
                    talents={main?.talents}
                    element={charData.element}
                    cons={char.cons}
                    name={charData.name}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
})
