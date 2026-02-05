import { useState } from "react";

import { EvaluationParamsPanel } from "./components/EvaluationParamsPanel";
import { ExpectedAnswer } from "./types/input";
import { usePseudocodeStyles } from "./utils/styles";

type WizardConfigProps = {
  answer: ExpectedAnswer;
  handleChange: (val: ExpectedAnswer) => void;
};

export const PseudocodeWizard: React.FC<WizardConfigProps> = ({
  answer,
  handleChange,
}) => {
  const { classes } = usePseudocodeStyles();
  const [open, setOpen] = useState(true);

  const update = <K extends keyof ExpectedAnswer>(
    key: K,
    val: ExpectedAnswer[K],
  ) => {
    handleChange({ ...answer, [key]: val });
  };

  return (
    <div className={classes.evalParams}>
      <button
        className={classes.evalParamsToggle}
        onClick={() => setOpen((o) => !o)}
      >
        Evaluation Configuration
      </button>

      <div className={classes.evalParamsContent}>
        {/* ---- Expected Complexity ---- */}
        <fieldset className={classes.evalParamsSection}>
          <legend>Expected Complexity</legend>
          <p>Expected Time Complexity</p>
          <input
            className={classes.field}
            placeholder="Expected Time Complexity"
            value={answer.expected_time_complexity}
            onChange={(e) =>
              update('expected_time_complexity', e.target.value)
            }
          />
          <p>Expected Space Complexity</p>
          <input
            className={classes.field}
            placeholder="Expected Space Complexity"
            value={answer.expected_space_complexity}
            onChange={(e) =>
              update('expected_space_complexity', e.target.value)
            }
          />
        </fieldset>

        {/* ---- Evaluation Params ---- */}
        <EvaluationParamsPanel
          collapsed={open}
          setCollapsed={setOpen}
          value={answer.evaluation_params}
          onChange={(p) => update('evaluation_params', p)}
        />
      </div>
      
    </div>
  );
};
