import { z } from 'zod'

import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
} from '../base-props.type'
import { ResponseAreaTub } from '../response-area-tub'

import { PseudocodeInput } from './Pseudocode.component'

export class PseudocodeResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'PSEUDOCODE'

  public readonly displayWideInput = true

  protected answerSchema = z.string()

  protected answer?: string

  InputComponent = (props: BaseResponseAreaProps) => {
    const parsedAnswer = this.answerSchema.safeParse(props.answer)
    return PseudocodeInput({
      ...props,
      answer: parsedAnswer.success ? parsedAnswer.data : undefined,
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    return PseudocodeInput({
      ...props,
      answer: this.answer,
      handleChange: (answer: string) => {
        props.handleChange({
          responseType: this.responseType,
          answer,
        })
      },
    })
  }
}
