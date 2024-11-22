import { getTalentIcon } from '@src/core/utils/fetcher'
import { ITalentDisplay } from '@src/domain/conditional'
import { Element, TalentProperty } from '@src/domain/constant'
import { Tooltip } from '@src/presentation/components/tooltip'
import { TooltipModal } from '@src/presentation/components/tooltip_modal'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'

interface ScalingWrapperProps {
  children: React.ReactNode | React.ReactNode[]
  talent: ITalentDisplay
  element: Element
  level?: number
  compare?: boolean
}

interface TalentIconProps {
  element: Element
  talent?: ITalentDisplay
  size?: string
  tooltipSize?: string
  level?: number
  showLevel?: boolean
  showUpgrade?: boolean
  upgraded?: boolean
  active?: boolean
  type?: string
  energy?: number
  hideTip?: boolean
  modal?: boolean
}

export const ElementIconColor = {
  [Element.FIRE]: 'bg-wuwa-fusion ring-wuwa-fusion',
  [Element.ELECTRIC]: 'bg-wuwa-electro ring-wuwa-electro',
  [Element.ICE]: 'bg-wuwa-glacio ring-wuwa-glacio',
  [Element.PHYSICAL]: 'bg-wuwa-spectro ring-wuwa-spectro',
  [Element.ETHER]: 'bg-wuwa-havoc ring-wuwa-havoc',
}

export const SkillIcon = {
  'Basic Attack': '/asset/talent/Icon_Normal.webp',
  Dodge: '/asset/talent/Icon_Evade.webp',
  'Assist Attack': '/asset/talent/Icon_Switch.webp',
  'Special Attack': '/asset/talent/Icon_SpecialReady.webp',
  'Chain Attack': '/asset/talent/Icon_UltimateReady.webp',
  'Core Skill': '/asset/talent/Icon_CoreSkill.webp',
}

export const TalentIcon = observer(
  ({
    talent,
    element,
    size,
    tooltipSize,
    level,
    showLevel,
    upgraded,
    showUpgrade,
    type,
    active = true,
    hideTip,
    modal,
  }: TalentIconProps) => {
    const IconComp = () => (
      <div className="relative">
        <div
          className={classNames(
            'rounded-full bg-opacity-25 ring-2 ring-offset-2 duration-200 ring-offset-primary-darker flex justify-center items-center shrink-0 bg-primary-light ring-primary-lighter',
            size || 'w-12 h-12',
            { 'group-hover:ring-offset-4': !hideTip }
          )}
        >
          <img src={SkillIcon[type]} className="w-full h-full scale-[90%]" loading="lazy" />
          <div className="hidden">?</div>
        </div>
        {hideTip && showUpgrade && !!upgraded && (
          <div className="absolute flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full -bottom-2 -right-2 bg-cyan-600 text-white">
            +{upgraded ? 3 : 0}
          </div>
        )}
      </div>
    )

    if (hideTip) return <IconComp />

    const Wrapper = modal ? TooltipModal : Tooltip
    return (
      <Wrapper
        title={
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-normal opacity-75 text-gray">{type}</p>
              <p>{talent?.title}</p>
            </div>
            <div className="flex flex-col items-end">
              {!!level && (
                <p className="text-xs font-normal text-gray">
                  Level:{' '}
                  <span className="text-desc">
                    {level} {!!upgraded && <span className="text-blue">(+{upgraded ? 3 : 0})</span>}
                  </span>
                </p>
              )}
            </div>
          </div>
        }
        body={
          typeof talent?.content === 'string' ? (
            <p dangerouslySetInnerHTML={{ __html: talent?.content }} />
          ) : (
            talent?.content
          )
        }
        style={tooltipSize || 'w-[35dvw] mobile:w-[400px]'}
      >
        <div className="relative group">
          <IconComp />
          {!!level && showLevel && (
            <div
              className={classNames(
                'absolute flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full -bottom-1 -right-3 text-white',
                upgraded ? 'bg-cyan-600' : 'bg-primary-light'
              )}
            >
              {level + (upgraded ? 3 : 0)}
            </div>
          )}
          {!showLevel && showUpgrade && !!upgraded && (
            <div className="absolute flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full -bottom-2 -right-2 bg-cyan-600 text-white">
              +{upgraded ? 3 : 0}
            </div>
          )}
        </div>
      </Wrapper>
    )
  }
)

export const ScalingWrapper = observer(({ children, talent, element, level, compare }: ScalingWrapperProps) => {
  return (
    <div className="flex w-full mobile:flex-col">
      <div className="flex flex-col items-center justify-center w-1/5 px-2 py-5 mobile:w-full mobile:flex-row mobile:justify-center gap-y-2 gap-x-4 mobile:px-5 mobile:py-3">
        <TalentIcon talent={talent} element={element} level={level} type={talent?.trace} modal />
        <div className="flex flex-col items-center w-full">
          <p className="w-full font-bold text-center mobile:w-2/3">{talent?.title}</p>
          {level && (
            <p className="text-xs text-gray">
              Level <span className="text-gray">{level}</span>
            </p>
          )}
        </div>
      </div>
      <div className="w-4/5 mobile:w-full space-y-0.5">
        {!!_.size(children as any) &&
          (compare ? (
            <div className="items-center hidden grid-cols-6 gap-2 py-1 pr-2 text-xs font-bold mobile:grid bg-primary-dark">
              <p className="col-start-3 text-center">Main</p>
              <p className="text-center">Sub 1</p>
              <p className="text-center">Sub 2</p>
              <p className="text-center">Sub 3</p>
            </div>
          ) : (
            <div className="items-center hidden grid-cols-5 gap-2 py-1 pr-2 text-xs font-bold mobile:grid bg-primary-dark">
              <p className="col-start-3 text-center">Base</p>
              <p className="text-center">Crit</p>
              <p className="text-center">Average</p>
            </div>
          ))}
        {children}
      </div>
    </div>
  )
})

//crowned={level === 10}
