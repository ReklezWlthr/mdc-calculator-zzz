import { getSideAvatar } from '@src/core/utils/fetcher'
import { useStore } from '@src/data/providers/app_store_provider'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'

export const CharacterSelect = observer(
  ({
    onClick,
    isSelected,
    order,
    ringColor = 'ring-primary-lighter',
  }: {
    onClick?: () => void
    isSelected: boolean
    order: string
    ringColor?: string
  }) => {
    const { settingStore } = useStore()

    const codeName = order === '4' && settingStore?.settings?.travelerGender === 'zhujue' ? '5' : order

    return (
      <div
        className={classNames(
          'bg-primary duration-200 shrink-0 h-16 w-[47px] overflow-hidden pointer-events-auto skew-x-[16deg] rounded-sm',
          {
            'hover:ring-2 ring-primary-light': onClick && !isSelected,
            [classNames('ring-4', ringColor)]: isSelected,
            'cursor-pointer': onClick,
          }
        )}
        onClick={onClick}
      >
        <img src={getSideAvatar(codeName)} className="object-cover h-full skew-x-[-16deg] overflow-visible" />
      </div>
    )
  }
)
