import React from 'react'

import { EvaluationParams } from '../types/input'
import { usePseudocodeStyles } from '../utils/styles'

interface EvaluationParamsPanelProps {
  value: EvaluationParams
  onChange: (next: EvaluationParams) => void
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

export const EvaluationParamsPanel: React.FC<EvaluationParamsPanelProps> = ({
  value,
  onChange,
  collapsed,
  setCollapsed,
}) => {
  const { classes } = usePseudocodeStyles()

  const update = <K extends keyof EvaluationParams>(
    key: K,
    val: EvaluationParams[K],
  ) => {
    onChange({
      ...value,
      [key]: val,
    })
  }

  return (
    <div className={classes.evalParams}>
      <button
        type="button"
        className={classes.evalParamsToggle}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? '▶ Evaluation Parameters' : '▼ Evaluation Parameters'}
      </button>

      {!collapsed && (
        <div className={classes.evalParamsContent}>
          <fieldset className={classes.evalParamsSection}>
            <legend>Evaluation</legend>

            <label className={classes.evalParamsRow}>
              <input
                type="checkbox"
                checked={value.analyze_pseudocode}
                onChange={(e) =>
                  update('analyze_pseudocode', e.target.checked)
                }
              />
              Analyze pseudocode
            </label>

            <label className={classes.evalParamsRow}>
              <input
                type="checkbox"
                checked={value.require_time_complexity}
                onChange={(e) =>
                  update('require_time_complexity', e.target.checked)
                }
              />
              Require time complexity
            </label>

            <label className={classes.evalParamsRow}>
              <input
                type="checkbox"
                checked={value.require_space_complexity}
                onChange={(e) =>
                  update('require_space_complexity', e.target.checked)
                }
              />
              Require space complexity
            </label>
          </fieldset>

          <fieldset className={classes.evalParamsSection}>
            <legend>Scoring</legend>

            <label className={classes.evalParamsRow}>
              <input
                type="checkbox"
                checked={value.partial_credit}
                onChange={(e) =>
                  update('partial_credit', e.target.checked)
                }
              />
              Allow partial credit
            </label>
          </fieldset>

          <fieldset className={classes.evalParamsSection}>
            <legend>Parser</legend>

            <label className={classes.evalParamsRow}>
              Style
              <select
                className={classes.field}
                value={value.pseudocode_style}
                onChange={(e) =>
                  update('pseudocode_style', e.target.value as any)
                }
              >
                <option value="auto">Auto</option>
                <option value="python">Python</option>
                <option value="pascal">Pascal</option>
                <option value="c">C</option>
              </select>
            </label>
          </fieldset>
        </div>
      )}
    </div>
  )
}
