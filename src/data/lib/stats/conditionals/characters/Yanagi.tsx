import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, StatsObject, StatsObjectKeys } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty, Specialty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'
import { MiniSkillIcon } from '@src/presentation/genshin/components/skill_icon'

const Yanagi = (c: number, t: ITalentLevel, team: ITeamChar[]) => {
  const { normal, assist, chain, core, dodge, special } = t

  const talents: ITalent = {
    normal: {
      level: normal,
      trace: `Basic Attack`,
      content: (
        <div>
          <p className="font-bold">Basic Attack: Tsukuyomi Kagura</p>
          <p>
            Yanagi has two stances: <b className="text-cyan-300">Jougen</b> and <b className="text-orange-300">Kagen</b>
            .
          </p>
          <div>
            Press <MiniSkillIcon type="Basic Attack" /> to activate:
          </div>
          <p>
            Execute up to five forward slashes based on the current stance, causing{' '}
            <b className="text-physical">Physical DMG</b> and <b className="text-electric">Electric DMG</b>.
          </p>
          <p>During combat, Yanagi gains the corresponding stance buff based on her current stance:</p>
          <p>
            <b className="text-cyan-300">Jougen</b> stance buff: <b className="text-electric">Electric DMG</b> increases
            by <span className="text-desc">10%</span>. Anti-Interrupt Level increases during <b>Basic Attacks</b>.
          </p>
          <p>
            <b className="text-orange-300">Kagen</b> stance buff: PEN Ratio increases by{' '}
            <span className="text-desc">10%</span>. Interrupt Level increases for <b>Basic Attacks</b>.
          </p>
          <p>
            For <span className="text-desc">8</span>s after switching stances, Yanagi retains the bonus from the
            previous stance.
          </p>
        </div>
      ),
    },
    dodge: {
      level: dodge,
      trace: `Dodge`,
      content: (
        <div>
          <p className="font-bold">Dodge: Wandering Breeze</p>
          <div>
            Press <MiniSkillIcon type="Dodge" /> to activate:
          </div>
          <p>A quick dash dodge.</p>
          <p>Character is invulnerable while using this skill.</p>
          <p className="pt-4 font-bold">Dash Attack: Fleeting Flight</p>
          <div>
            Press <MiniSkillIcon type="Basic Attack" /> during a dodge to activate:
          </div>
          <p>
            Slashes enemies in front, dealing <b className="text-physical">Physical DMG</b>.
          </p>
          <p className="pt-4 font-bold">Dash Counter: Rapid Retaliation</p>
          <div>
            Press <MiniSkillIcon type="Basic Attack" /> during a <b>Perfect Dodge</b> to activate:
          </div>
          <p>
            Slashes enemies in front, dealing <b className="text-electric">Electric DMG</b>.
          </p>
          <p>Character is invulnerable while using this skill.</p>
          <p>
            After using this skill, you can immediately follow up with the 3rd hit of the current stance's{' '}
            <b>Basic Attack</b>.
          </p>
        </div>
      ),
    },
    assist: {
      level: assist,
      trace: `Assist Attack`,
      content: (
        <div>
          <p className="font-bold">Quick Assist: Blade of Elegance</p>
          <div>
            When the on-field character is launched, press <MiniSkillIcon type="Assist Attack" /> to activate:
          </div>
          <p>
            Slashes enemies in front, dealing <b className="text-electric">Electric DMG</b>.
          </p>
          <p>Character is invulnerable while using this skill.</p>
          <p>
            After using this skill, you can immediately follow up with the 3rd hit of the current stance's{' '}
            <b>Basic Attack</b>.
          </p>
          <p className="pt-4 font-bold">Defensive Assist: Radiant Reversal</p>
          <div>
            When the on-field character is about to be attacked, press <MiniSkillIcon type="Assist Attack" /> to
            activate:
          </div>
          <p>Parries the enemy's attack, dealing massive Daze.</p>
          <p>Character is invulnerable while using this skill.</p>
          <p className="pt-4 font-bold">Assist Follow-Up: Weeping Willow Stab</p>
          <div>
            Press <MiniSkillIcon type="Basic Attack" /> after a <b>Defensive Assist</b> to activate:
          </div>
          <p>
            Switch stances, and quickly deliver multiple slashes to enemies in front, dealing{' '}
            <b className="text-electric">Electric DMG</b>.
          </p>
          <p>Character is invulnerable while using this skill.</p>
          <p>
            After using this skill, you can immediately follow up with the 3rd hit of the current stance's{' '}
            <b>Basic Attack</b>.
          </p>
        </div>
      ),
      image: 'SP_IconQiushuiC1',
    },
    special: {
      level: special,
      trace: `Special Attack`,
      content: (
        <div>
          <p className="font-bold">Special Attack: Ruten</p>
          <div>
            Press <MiniSkillIcon type="Special Attack" /> to activate:
          </div>
          <p>
            Perform a forward slash, dealing <b className="text-electric">Electric DMG</b>, and switch the current
            stance.
          </p>
          <p>Anti-Interrupt level is increased while using this skill.</p>
          <p>
            If activated after the 3rd, 4th, or 5th hit of a <b>Basic Attack</b>, it activates <b>Swift Ruten</b>,
            speeding up the slashes while switching her current stance.
          </p>
          <p>
            Block enemy attacks while <b>Swift Ruten</b> is active.
          </p>
          <p>
            Upon activating <b>Swift Ruten</b>, Yanagi can immediately follow up with the 3rd hit of the current
            stance's <b>Basic Attack</b>.
          </p>
          <p className="pt-4 font-bold">EX Special Attack: Gekka Ruten</p>
          <div>
            With enough Energy, hold <MiniSkillIcon type="Special Attack" /> to activate:
          </div>
          <p>
            Charge up power for a quick forward thrust, followed by a downward attack, dealing massive{' '}
            <b className="text-electric">Electric DMG</b>.
          </p>
          <p>
            Upon executing the thrust, Yanagi switches stances and enters the <b>Shinrabanshou</b> state, lasting{' '}
            <span className="text-desc">15</span>s. For the duration of this state, when following up with a subsequent{' '}
            <b>Basic Attack</b> from the 5th hit of a <b>Basic Attack</b>
            or other skills, the combo will begin directly from the 3rd hit of the <b>Basic Attack</b>.
          </p>
          <p>
            If the downward attack hits an enemy suffering an <b>Anomaly</b>, it triggers a special <b>Disorder</b>{' '}
            effect, <b>Polarity Disorder</b>, dealing <span className="text-desc">15%</span> of the original{' '}
            <b>Disorder</b> effect's DMG to the target, plus an additional <span className="text-desc">730%</span> of
            Yanagi's Anomaly Proficiency. <b>Polarity Disorder</b> will not remove the target's <b>Anomaly</b>.
          </p>
          <p>Character is invulnerable while using this skill.</p>
        </div>
      ),
      image: 'SP_IconQiushuiY',
    },
    chain: {
      level: chain,
      trace: `Chain Attack`,
      content: (
        <div>
          <p className="font-bold">Chain Attack: Celestial Harmony</p>
          <div>
            When a <b>Chain Attack</b> is triggered, select the character to activate:
          </div>
          <p>
            Switch stances and unleash a powerful slash on enemies in front, dealing massive{' '}
            <b className="text-electric">Electric DMG</b>.
          </p>
          <p>Character is invulnerable while using this skill.</p>
          <p>
            After using this skill, Yanagi can immediately follow up with the 3rd hit of the current stance's{' '}
            <b>Basic Attack</b>.
          </p>
          <p className="pt-4 font-bold">Ultimate: Raiei Tenge</p>
          <div>
            When Decibel Rating is at Maximum, press <MiniSkillIcon type="Chain Attack" /> to activate:
          </div>
          <p>
            Yanagi unleashes her potential and delivers a powerful slash to a large area of enemies in front in a very
            short time, followed by an additional lightning strike, dealing massive{' '}
            <b className="text-electric">Electric DMG</b>.
          </p>
          <p>
            When the lightning strike hits an enemy affected by an <b>Attribute Anomaly</b>, it triggers a special{' '}
            <b>Disorder</b>
            effect called <b>Polarity Disorder</b>. This deals DMG equal to <span className="text-desc">15%</span> of
            the original <b>Disorder</b> effect plus an additional <span className="text-desc">730%</span> of Yanagi's
            Anomaly Proficiency. <b>Polarity Disorder</b> will not remove the target's <b>Anomaly</b>.
          </p>
          <p>Character is invulnerable while using this skill.</p>
          <p>
            After using this skill, Yanagi can immediately follow up with the 3rd hit of the current stance's{' '}
            <b>Basic Attack</b>
          </p>
        </div>
      ),
      image: 'SP_IconQiushuiQTE',
    },
    core: {
      level: core,
      trace: `Core Skill`,
      content: (
        <div>
          <p className="font-bold">Core Passive: Lunar Eclipse</p>
          <div>
            After Yanagi activates her <b>EX Special Attack</b>, the DMG multiplier of <b>Disorder</b> is increased by{' '}
            <span className="text-desc">250%</span> when any squad member applies the <b>Disorder</b> effect to an
            enemy, lasting <span className="text-desc">15</span>s.
          </div>
          <p>
            When her <b>EX Special Attack</b> hits an enemy, Yanagi's <b className="text-electric">Electric DMG</b>{' '}
            against the target is increased by <span className="text-desc">20%</span> for
            <span className="text-desc">15</span>s.
          </p>
          <p className="pt-4 font-bold">Additional Ability: Gessou</p>
          <div>When another character in your squad is an Anomaly character or shares the same attribute:</div>
          <p>
            After switching stances, when Yanagi hits an enemy with <b>Basic Attack: Tsukuyomi Kagura</b>,{' '}
            <b className="text-electric">Electric Anomaly Buildup</b> increases by{' '}
            <span className="text-desc">45%</span> for <span className="text-desc">8</span>s.
          </p>
        </div>
      ),
      image: 'SP_IconQiushuiT',
    },
    c1: {
      trace: `Mindscape 1`,
      title: `Know Thy Self, Know Thy Enemy`,
      content: `The cooldown of Resonance Skill <b>Shift Trick</b> is reduced by <span class="text-desc">4</span>s.`,
      image: 'T_IconDevice_QiushuiM1_UI',
    },
    c2: {
      trace: `Mindscape 2`,
      title: `Outstanding Adaptability`,
      content: `<b>Mist Avatar</b> inherits <span class="text-desc">100%</span> more HP from Aalto. When Aalto attacks targets taunted by the <b>Mist Avatar(s)</b>, his ATK is increased by <span class="text-desc">15%</span>.`,
      image: 'T_IconDevice_QiushuiM2_UI',
    },
    c3: {
      trace: `Mindscape 3`,
      title: `Tsukishiro Style Management`,
      content: `<b>Basic Attack</b>, <b>Dodge</b>, <b>Assist</b>, <b>Special Attack</b>, and <b>Chain Attack</b> Lv. <span class="text-desc">+2</span>`,
      image: 'T_IconDevice_QiushuiM3_UI',
    },
    c4: {
      trace: `Mindscape 4`,
      title: `Chessmaster`,
      content: `The damage of Resonance Skill <b>Mist Bullets</b> is increased by <span class="text-desc">30%</span>; Aalto receives <span class="text-desc">30%</span> less DMG in his Forte Circuit <b>Mistcloak Dash</b> state.`,
      image: 'T_IconDevice_QiushuiM4_UI',
    },
    c5: {
      trace: `Mindscape 5`,
      title: `"Other Mother"`,
      content: `<b>Basic Attack</b>, <b>Dodge</b>, <b>Assist</b>, <b>Special Attack</b>, and <b>Chain Attack</b> Lv. <span class="text-desc">+2</span>`,
      image: 'T_IconDevice_QiushuiM5_UI',
    },
    c6: {
      trace: `Mindscape 6`,
      title: `Inhuman Blood`,
      content: `Resonance Liberation <b>Flower in the Mist</b> now additionally increases Crit. Rate by <span class="text-desc">8%</span>. When Aalto's Heavy Attack passes through the <b class="text-teal-200">Gate of Quandary</b>, the damage dealt is additionally increased by <span class="text-desc">50%</span>.`,
      image: 'T_IconDevice_QiushuiM6_UI',
    },
  }

  const content: IContent[] = []

  const teammateContent: IContent[] = []

  return {
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: 'Stage 1 DMG',
          value: [{ scaling: calcScaling(0.16, normal), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.BA,
        },
        {
          name: 'Stage 2 DMG',
          value: [{ scaling: calcScaling(0.2667, normal), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.BA,
        },
        {
          name: 'Stage 3 DMG',
          value: [{ scaling: calcScaling(0.24, normal), multiplier: Stats.ATK, hits: 2 }],
          element: Element.ELECTRIC,
          property: TalentProperty.BA,
        },
        {
          name: 'Stage 4 DMG',
          value: [{ scaling: calcScaling(0.2534, normal), multiplier: Stats.ATK, hits: 2 }],
          element: Element.ELECTRIC,
          property: TalentProperty.BA,
        },
        {
          name: 'Stage 5 DMG',
          value: [{ scaling: calcScaling(0.904, normal), multiplier: Stats.ATK }],
          element: Element.ELECTRIC,
          property: TalentProperty.BA,
        },
      ]

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      return base
    },
    postCompute: (
      base: StatsObject,
      form: Record<string, any>,
      allBase: StatsObject[],
      allForm: Record<string, any>[]
    ) => {
      return base
    },
  }
}

export default Yanagi
