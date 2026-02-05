import { ExpectedAnswer, StudentResponse } from "../types/input";

/* -------------------- Default StudentResponse -------------------- */
export const defaultStudentResponse: StudentResponse = {
  pseudocode: '',
  time_complexity: undefined,
  space_complexity: undefined,
  explanation: undefined,
};

export const defaultExpectedAnswer: ExpectedAnswer = {
  expected_time_complexity: '',
  expected_space_complexity: 'O(1)',

  acceptable_time_alternatives: [],
  acceptable_space_alternatives: [],

  algorithm_description: '',
  algorithm_type: '',
  expected_constructs: [],

  time_complexity_weight: 0.5,
  space_complexity_weight: 0.5,

  evaluation_params: {
    analyze_pseudocode: true,
    require_time_complexity: true,
    require_space_complexity: true,

    partial_credit: true,
    time_weight: 0.5,
    space_weight: 0.5,

    complexity_equivalence: true,
    case_sensitive: false,
    strict_notation: false,

    show_detailed_feedback: true,
    show_correct_answer: true,
    show_detected_complexity: true,
    show_ast: false,

    pseudocode_style: 'auto',
    strict_parsing: false,

    max_nesting_depth: 10,
    timeout_seconds: 5,
  },
};
