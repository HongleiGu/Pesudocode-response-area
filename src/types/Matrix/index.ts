import { z } from 'zod';

import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
} from '../base-props.type';
import { PseudocodeInput } from '../Pseudocode/Pseudocode.component';
import { EvaluationResult, EvaluationResultSchema } from '../Pseudocode/types/output';
import { ResponseAreaTub } from '../response-area-tub';

/* ============================================================
 * Helpers
 * ============================================================
 */

/**
 * Safely parse + validate EvaluationResult from a JSON string.
 * Returns undefined if anything fails.
 */
function safeParseEvaluationResult(
  value: unknown
): EvaluationResult | undefined {
  if (typeof value !== 'string') return undefined;

  try {
    const json = JSON.parse(value);
    const parsed = EvaluationResultSchema.safeParse(json);
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Minimal safe default.
 * This ensures legacy systems always receive valid JSON.
 */
function createDefaultEvaluationResult(): EvaluationResult {
  return {
    is_correct: false,
    score: 0,
    feedback: '',
    feedback_items: [],
    warnings: [],
    errors: [],
    metadata: {},
  };
}

/* ============================================================
 * PseudocodeResponseAreaTub
 * ============================================================
 */

export class PseudocodeResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'PSEUDOCODE';

  public readonly displayWideInput = true;

  /**
   * Legacy constraint:
   * Stored answer must be a string (JSON-encoded)
   */
  protected answerSchema = z.string();

  /**
   * Stored answer (JSON string)
   */
  protected answer?: string;

  /* ----------------------------------------------------------
   * Lifecycle: Initialization
   * ---------------------------------------------------------- */

  /**
   * Ensure we always start with a valid JSON payload.
   * Called when the response area is first created.
   */
  initWithDefault = () => {
    if (!this.answer) {
      this.answer = JSON.stringify(createDefaultEvaluationResult());
      return;
    }

    // If existing answer is invalid, reset safely
    const parsed = safeParseEvaluationResult(this.answer);
    if (!parsed) {
      this.answer = JSON.stringify(createDefaultEvaluationResult());
    }
  }

  /* ----------------------------------------------------------
   * Lifecycle: Pre-submission Validation
   * ---------------------------------------------------------- */

  /**
   * Runs before every submission.
   * Throwing here blocks submission.
   */
  customCheck = () => {
    const parsed = safeParseEvaluationResult(this.answer);

    if (!parsed) {
      throw new Error(
        'Invalid pseudocode evaluation payload. Please re-enter your response.'
      );
    }

    // Optional extra safety checks (cheap, but valuable)
    if (parsed.score < 0 || parsed.score > 1) {
      throw new Error('Evaluation score must be between 0 and 1.');
    }

    if (!Array.isArray(parsed.feedback_items)) {
      throw new Error('Feedback items must be an array.');
    }
  }

  /* ----------------------------------------------------------
   * Student / Read-only View
   * ---------------------------------------------------------- */

  InputComponent = (props: BaseResponseAreaProps) => {
    const evaluationResult = safeParseEvaluationResult(props.answer);

    return PseudocodeInput({
      ...props,
      answer: evaluationResult,
      isTeacherMode: false,
    });
  };

  /* ----------------------------------------------------------
   * Wizard / Editable View
   * ---------------------------------------------------------- */

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    const evaluationResult = safeParseEvaluationResult(this.answer);

    return PseudocodeInput({
      ...props,
      answer: evaluationResult,
      isTeacherMode: true,
      handleChange: (result: EvaluationResult) => {
        props.handleChange({
          responseType: this.responseType,
          answer: JSON.stringify(result),
        });
      },
    });
  };
}
