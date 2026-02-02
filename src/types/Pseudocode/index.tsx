// PseudocodeResponseAreaTub.ts
import { z } from 'zod';

import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
} from '../base-props.type';
import { ResponseAreaTub } from '../response-area-tub';

import { PseudocodeInput } from './Pseudocode.component';
import { StudentResponse, StudentResponseSchema } from './types/input';
import { defaultStudentResponse } from './utils/consts';
// import { validatePseudocode, PseudocodeFeedback, CheckPhase } from './validatePseudocode';

/* ===========================================================
 * PseudocodeResponseAreaTub
 * =========================================================== */
export class PseudocodeResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'PSEUDOCODE';
  public readonly displayWideInput = true;

  protected answerSchema = StudentResponseSchema;
  protected answer: StudentResponse = defaultStudentResponse;

  private response: StudentResponse | null = null;
  // private previewFeedback: PseudocodeFeedback | null = null;
  // private phase: CheckPhase = CheckPhase.Idle;

  public readonly delegateFeedback = false;
  public readonly delegateLivePreview = true;

  initWithConfig = (config: any) => {
    const parsed = this.answerSchema.safeParse(this.answer);
    this.answer = parsed.success ? parsed.data : defaultStudentResponse;
  };

  /* -------------------- Pre-submission validation -------------------- */
  customCheck = () => {
    // if (this.previewFeedback) {
    //   throw new Error('Preview validation failed');
    // }
    // this.previewFeedback = null;
  };

  /* -------------------- Student / read-only input -------------------- */
  public InputComponent = (props: BaseResponseAreaProps): JSX.Element => {
    const parsed = this.answerSchema.safeParse(props.answer);
    const validAnswer = parsed.success ? parsed.data : defaultStudentResponse;

    this.response = validAnswer;

    /* ---------- Extract submitted feedback (if any) ---------- */
    // const submittedFeedback: PseudocodeFeedback | null = (() => {
    //   const raw = props.feedback?.feedback;
    //   if (!raw) return null;

    //   try {
    //     const jsonPart = raw.split('<br>')[1]?.trim();
    //     if (!jsonPart) return null;
    //     return JSON.parse(jsonPart);
    //   } catch {
    //     return null;
    //   }
    // })();

    // const effectiveFeedback = this.previewFeedback ?? submittedFeedback;

    return (
      <PseudocodeInput
        {...props}
        answer={validAnswer}
        // feedback={effectiveFeedback ?? undefined}
        isTeacherMode={false}
        handleChange={(val: StudentResponse) => {
          // Update preview and call handleChange for live student updates
          console.log(val, props.answer)
          props.handleChange(val);

          // const preview = validatePseudocode(val);
          // if (preview.errors.length > 0) {
          //   this.previewFeedback = preview;
          //   this.phase = CheckPhase.PreviewError;
          // } else {
          //   this.previewFeedback = null;
          //   this.phase = CheckPhase.Idle;
          // }
        }}
      />
    );
  };

  /* -------------------- Wizard / teacher-editable input -------------------- */
  public WizardComponent = (props: BaseResponseAreaWizardProps): JSX.Element => {
    return (
      <PseudocodeInput
        {...props}
        answer={this.answer}
        // feedback={null}
        isTeacherMode={true}
        handleChange={(val: StudentResponse) => {
          // Update internal answer
          this.answer = val;

          // Normalize for legacy system: no undefined, only null
          const normalizedAnswer = {
            pseudocode: val.pseudocode ?? '',
            time_complexity: val.time_complexity ?? null,
            space_complexity: val.space_complexity ?? null,
            explanation: val.explanation ?? null,
          };

          console.log('Normalized answer:', normalizedAnswer);

          // Send shallow object to backend
          props.handleChange({
            responseType: this.responseType,
            answer: normalizedAnswer,
          });
        }}
      />
    );
  };
}
