// PseudocodeResponseAreaTub.ts
import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
} from '../base-props.type'
import { ResponseAreaTub } from '../response-area-tub'

import { PseudocodeInput } from './Pseudocode.component'
import { PseudocodeWizard } from './PseudocodeWizard.component'
import {
  StudentResponse,
  StudentResponseSchema,
  ExpectedAnswer,
  ExpectedAnswerSchema,
} from './types/input'
import { defaultExpectedAnswer, defaultStudentResponse } from './utils/consts'

/* ===========================================================
 * PseudocodeResponseAreaTub
 * =========================================================== */

export class PseudocodeResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'PSEUDOCODE'
  public readonly displayWideInput = true

  /* ---------- STUDENT ---------- */

  protected answerSchema = ExpectedAnswerSchema//StudentResponseSchema
  private response: StudentResponse | null = null

  /* ---------- TEACHER ---------- */

  protected answer: ExpectedAnswer = defaultExpectedAnswer

  public readonly delegateFeedback = false
  public readonly delegateLivePreview = true

  /* -------------------- Init -------------------- */

  initWithConfig = (config: any) => {
    const parsed = ExpectedAnswerSchema.safeParse(config?.answer)
    this.answer = parsed.success
      ? parsed.data
      : defaultExpectedAnswer
  }

  /* -------------------- Validation -------------------- */

  customCheck = () => {
    // reserved for later (AST / static analysis)
  }

  /* =====================================================
   * Student Input
   * ===================================================== */

  public InputComponent = (props: BaseResponseAreaProps): JSX.Element => {
    const parsed = StudentResponseSchema.safeParse(props.answer)
    const validAnswer = parsed.success
      ? parsed.data
      : defaultStudentResponse

    this.response = validAnswer

    return (
      <PseudocodeInput
        {...props}
        answer={validAnswer}
        handleChange={(val: StudentResponse) => {
          this.response = val
          console.log("response", this.response)
          props.handleChange(val)
        }}
      />
    )
  }

  /* =====================================================
   * Wizard / Teacher Input
   * ===================================================== */

  public WizardComponent = (
    props: BaseResponseAreaWizardProps,
  ): JSX.Element => {
    return (
      <>
      <p>Wizard</p>
      <PseudocodeWizard
        answer={this.answer}
        handleChange={(val: ExpectedAnswer) => {
          this.answer = val

          console.log("answer", this.answer)

          props.handleChange({
            responseType: this.responseType,
            answer: val,
          })
        }}
      />
      </>
    )
  }
}
