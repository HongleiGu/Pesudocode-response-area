import { z } from 'zod';

export type ExpectedAnswer = z.infer<typeof ExpectedAnswerSchema>;

/* ============================================================
 * EvaluationParams
 * ============================================================
 */

export const EvaluationParamsSchema = z.object({
  // What to evaluate
  analyze_pseudocode: z
    .boolean()
    .default(true)
    .describe('Whether to parse and analyze the pseudocode'),

  require_time_complexity: z
    .boolean()
    .default(true)
    .describe('Whether time complexity answer is required'),

  require_space_complexity: z
    .boolean()
    .default(true)
    .describe('Whether space complexity answer is required'),

  // Scoring options
  partial_credit: z
    .boolean()
    .default(true)
    .describe('Allow partial marks for partially correct answers'),

  time_weight: z
    .number()
    .min(0)
    .max(1)
    .default(0.5)
    .describe('Weight for time complexity in total score'),

  space_weight: z
    .number()
    .min(0)
    .max(1)
    .default(0.5)
    .describe('Weight for space complexity in total score'),

  // Comparison options
  complexity_equivalence: z
    .boolean()
    .default(true)
    .describe('Treat equivalent complexities as equal (O(2n) == O(n))'),

  case_sensitive: z
    .boolean()
    .default(false)
    .describe('Case sensitive comparison (O(N) vs O(n))'),

  strict_notation: z
    .boolean()
    .default(false)
    .describe('Require exact Big-O notation format'),

  // Feedback options
  show_detailed_feedback: z
    .boolean()
    .default(true)
    .describe('Provide detailed analysis feedback'),

  show_correct_answer: z
    .boolean()
    .default(true)
    .describe('Show expected answer if student is wrong'),

  show_detected_complexity: z
    .boolean()
    .default(true)
    .describe('Show complexity detected from pseudocode analysis'),

  show_ast: z
    .boolean()
    .default(false)
    .describe('Include AST in response (for debugging)'),

  // Parser options
  pseudocode_style: z
    .enum(['auto', 'python', 'pascal', 'c'])
    .default('auto')
    .describe('Pseudocode style'),

  strict_parsing: z
    .boolean()
    .default(false)
    .describe('Fail on parse errors vs. best effort'),

  // Advanced options
  max_nesting_depth: z
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10)
    .describe('Maximum loop nesting depth to analyze'),

  timeout_seconds: z
    .number()
    .min(0.1)
    .max(60)
    .default(5.0)
    .describe('Analysis timeout in seconds'),
});

export type EvaluationParams = z.infer<typeof EvaluationParamsSchema>;

/* ============================================================
 * StudentResponse
 * ============================================================
 */

export const StudentResponseSchema = z.object({
  pseudocode: z
    .string()
    .min(1, 'Pseudocode cannot be empty')
    .refine((v) => v.trim().length > 0, {
      message: 'Pseudocode cannot be empty',
    })
    .describe('The pseudocode submitted by the student'),

  time_complexity: z
    .string()
    .optional()
    .nullable()
    .describe("Student's answer for time complexity, e.g., 'O(n^2)'"),

  space_complexity: z
    .string()
    .optional()
    .nullable()
    .describe("Student's answer for space complexity, e.g., 'O(1)'"),

  explanation: z
    .string()
    .optional()
    .nullable()
    .describe("Student's explanation of their complexity analysis"),
});

export type StudentResponse = z.infer<typeof StudentResponseSchema>;

/* ============================================================
 * ExpectedAnswer
 * ============================================================
 */

export const ExpectedAnswerSchema = z.object({
  expected_time_complexity: z
    .string()
    .default('O(1)')
    .describe('Expected time complexity in Big-O notation'),

  expected_space_complexity: z
    .string()
    .default('O(1)')
    .describe('Expected space complexity in Big-O notation'),

  acceptable_time_alternatives: z
    .array(z.string())
    .default([])
    .describe('Alternative acceptable time complexity representations'),

  acceptable_space_alternatives: z
    .array(z.string())
    .default([])
    .describe('Alternative acceptable space complexity representations'),

  algorithm_description: z
    .string()
    .optional()
    .describe('Description of the expected algorithm'),

  algorithm_type: z
    .string()
    .optional()
    .describe('Type of algorithm: sorting, searching, graph, etc.'),

  expected_constructs: z
    .array(z.string())
    .default([])
    .describe('Expected code constructs: nested_loop, recursion, etc.'),

  time_complexity_weight: z
    .number()
    .min(0)
    .max(1)
    .default(0.5)
    .describe('Weight for time complexity in scoring'),

  space_complexity_weight: z
    .number()
    .min(0)
    .max(1)
    .default(0.5)
    .describe('Weight for space complexity in scoring'),
  // 🔑 Teacher-only
  evaluation_params: EvaluationParamsSchema.default({}),
});