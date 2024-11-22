import { useStore } from '@src/data/providers/app_store_provider'
import React, { useCallback, useMemo } from 'react'
import { CharacterModal } from './modals/character_modal'
import { observer } from 'mobx-react-lite'
import { PillInput } from '@src/presentation/components/inputs/pill_input'
import { Promotion, MindScapeOptions, ITeamChar } from '@src/domain/constant'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import { findBaseLevel } from '@src/core/utils/data_format'
import _ from 'lodash'
import { findMaxLevel } from '../../../core/utils/data_format'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import { DefaultCharacter } from '@src/data/stores/team_store'
import { findCharacter } from '@src/core/utils/finder'
import { getElementImage, getSpecialtyImage, getSquareAvatar } from '@src/core/utils/fetcher'
import classNames from 'classnames'

interface CharacterBlockProps {
  index: number
  override?: ITeamChar[]
  disabled?: boolean
}

export const CharacterBlock = observer((props: CharacterBlockProps) => {
  const { modalStore, teamStore, settingStore } = useStore()
  const selectedChar = props.override?.[props.index] || teamStore.characters[props.index]
  const ascension = selectedChar?.ascension || 0
  const level = selectedChar?.level || 1
  const cons = selectedChar?.cons || 0

  const characterData = findCharacter(selectedChar?.cId)
  const rarity = characterData?.rarity

  const isEmpty = !characterData

  const levels = useMemo(
    () =>
      _.map(Array(10).fill(ascension * 10), (item, index) => ({
        name: _.toString(item + index + 1),
        value: _.toString(item + index + 1),
      })).reverse(),
    [ascension]
  )

  const onOpenModal = useCallback(() => {
    modalStore.openModal(<CharacterModal index={props.index} />)
  }, [modalStore, props.index])

  return (
    <div className="w-full font-bold text-white rounded-lg bg-primary-dark">
      <div className="flex justify-center px-5 py-2 text-xl rounded-t-lg bg-primary-lighter">Agent</div>
      <div className="flex">
        <div
          className="relative h-[136px] m-3 duration-200 border rounded-lg cursor-pointer bg-primary-darker border-primary-border aspect-square hover:border-primary-light overflow-hidden shrink-0"
          onClick={onOpenModal}
        >
          {characterData && (
            <>
              <img src={getSquareAvatar(characterData?.order)} className="object-cover aspect-square" />
              <div className="absolute space-y-0.5 bottom-1 left-1">
                <div
                  className="flex items-center justify-center p-1 bg-opacity-75 rounded-full bg-primary-darker"
                  title={characterData?.specialty}
                >
                  <img src={getSpecialtyImage(characterData?.specialty)} className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-center p-1 bg-opacity-75 rounded-full bg-primary-darker">
                  <img src={getElementImage(characterData?.element)} className="w-5 h-5" />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="w-full py-3 pl-2 pr-5 space-y-2">
          <div className="space-y-1">
            <p className="text-sm font-semibold">Name</p>
            <PillInput
              onClick={onOpenModal}
              value={characterData?.name}
              onClear={() => teamStore.setMember(props.index, DefaultCharacter)}
              disabled={props.disabled}
              placeholder="Select a Resonator"
            />
          </div>
          <div className="space-y-1">
            <p className="w-full text-sm font-semibold">Level</p>
            <div className="flex w-full gap-2">
              <SelectInput
                onChange={(value) => teamStore.setMemberInfo(props.index, { level: parseInt(value) || 0 })}
                options={levels}
                value={level?.toString()}
                disabled={isEmpty || props.disabled}
              />
              <SelectInput
                onChange={(value) => {
                  const max = _.max([1, (parseInt(value) - 1) * 2])
                  teamStore.setMemberInfo(props.index, {
                    ascension: parseInt(value) || 0,
                    level: ((parseInt(value) || 0) + 1) * 10,
                  })
                  _.forEach(teamStore.characters[props.index]?.talents, (item, key: 'normal' | 'skill' | 'burst') => {
                    if (item > max) teamStore.setTalentLevel(props.index, key, max)
                  })
                }}
                options={Promotion}
                value={ascension?.toString()}
                style="w-fit"
                disabled={isEmpty || props.disabled}
              />
              <SelectInput
                onChange={(value) =>
                  teamStore.setMemberInfo(props.index, {
                    cons: parseInt(value) || 0,
                  })
                }
                options={MindScapeOptions}
                value={cons?.toString()}
                style="w-fit"
                disabled={isEmpty || props.disabled || characterData?.id === '10000062'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
