import { z } from "zod";

/* =======================
   ENUMS
======================= */

export const NodeType = z.enum([
  "program",
  "function",
  "block",
  "loop",
  "conditional",
  "assignment",
  "return",
  "function_call",
  "recursive_call",
  "variable",
  "literal",
  "binary_op",
  "unary_op",
  "array_access",
  "expression",
]);
export type NodeType = z.infer<typeof NodeType>;

export const LoopType = z.enum([
  "for",
  "for_each",
  "while",
  "do_while",
  "repeat_until",
  "unknown",
]);
export type LoopType = z.infer<typeof LoopType>;

export const OperatorType = z.enum([
  "+",
  "-",
  "*",
  "/",
  "%",
  "^",
  "//",
  "==",
  "!=",
  "<",
  "<=",
  ">",
  ">=",
  "and",
  "or",
  "not",
  "=",
  "+=",
  "-=",
  "*=",
  "/=",
]);
export type OperatorType = z.infer<typeof OperatorType>;

/* =======================
   SOURCE LOCATION
======================= */

export const SourceLocationSchema = z.object({
  line: z.number(),
  column: z.number(),
  end_line: z.number().optional(),
  end_column: z.number().optional(),
});
export type SourceLocation = z.infer<typeof SourceLocationSchema>;

/* =======================
   BASE AST NODE
======================= */

export const ASTNodeBaseSchema = z.object({
  node_type: NodeType,
  location: SourceLocationSchema.optional(),
  metadata: z.record(z.any()).default({}),
}).passthrough();

/* =======================
   EXPRESSIONS
======================= */

export const ExpressionNodeSchema = ASTNodeBaseSchema.extend({
  node_type: z.literal("expression"),
});
export type ExpressionNode = z.infer<typeof ExpressionNodeSchema>;

export const VariableNodeSchema = ExpressionNodeSchema.extend({
  node_type: z.literal("variable"),
  name: z.string(),
});
export type VariableNode = z.infer<typeof VariableNodeSchema>;

export const LiteralNodeSchema = ExpressionNodeSchema.extend({
  node_type: z.literal("literal"),
  value: z.any().optional(),
  literal_type: z.string().default("unknown"),
});
export type LiteralNode = z.infer<typeof LiteralNodeSchema>;

export const BinaryOpNodeSchema: z.ZodType<any> = z.lazy(() =>
  ExpressionNodeSchema.extend({
    node_type: z.literal("binary_op"),
    operator: OperatorType,
    left: ExpressionNodeUnion.optional(),
    right: ExpressionNodeUnion.optional(),
  })
);
export type BinaryOpNode = z.infer<typeof BinaryOpNodeSchema>;

export const UnaryOpNodeSchema: z.ZodType<any> = z.lazy(() =>
  ExpressionNodeSchema.extend({
    node_type: z.literal("unary_op"),
    operator: OperatorType,
    operand: ExpressionNodeUnion.optional(),
  })
);
export type UnaryOpNode = z.infer<typeof UnaryOpNodeSchema>;

export const ArrayAccessNodeSchema: z.ZodType<any> = z.lazy(() =>
  ExpressionNodeSchema.extend({
    node_type: z.literal("array_access"),
    array: ExpressionNodeUnion.optional(),
    index: ExpressionNodeUnion.optional(),
  })
);
export type ArrayAccessNode = z.infer<typeof ArrayAccessNodeSchema>;

/* =======================
   FUNCTION CALLS
======================= */

export const FunctionCallNodeSchema: z.ZodType<any> = z.lazy(() =>
  ASTNodeBaseSchema.extend({
    node_type: z.literal("function_call"),
    function_name: z.string(),
    arguments: z.array(ExpressionNodeUnion).default([]),
    is_recursive: z.boolean().default(false),
  })
);
export type FunctionCallNode = z.infer<typeof FunctionCallNodeSchema>;

export const RecursiveCallNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    node_type: z.literal("recursive_call"),
    function_name: z.string(),
    arguments: z.array(ExpressionNodeUnion).default([]),
    is_recursive: z.boolean().default(false),

    reduction_pattern: z.string().optional(),
    branching_factor: z.number().default(1),
  }).passthrough()
);

export type RecursiveCallNode = z.infer<typeof RecursiveCallNodeSchema>;


/* =======================
   STATEMENTS
======================= */

export const AssignmentNodeSchema: z.ZodType<any> = z.lazy(() =>
  ASTNodeBaseSchema.extend({
    node_type: z.literal("assignment"),
    target: z.union([VariableNodeSchema, ArrayAccessNodeSchema]).optional(),
    value: ExpressionNodeUnion.optional(),
    operator: OperatorType.default("="),
  })
);
export type AssignmentNode = z.infer<typeof AssignmentNodeSchema>;

export const ReturnNodeSchema: z.ZodType<any> = z.lazy(() =>
  ASTNodeBaseSchema.extend({
    node_type: z.literal("return"),
    value: ExpressionNodeUnion.optional(),
  })
);
export type ReturnNode = z.infer<typeof ReturnNodeSchema>;

export const BlockNodeSchema: z.ZodType<any> = z.lazy(() =>
  ASTNodeBaseSchema.extend({
    node_type: z.literal("block"),
    statements: z.array(ASTNodeUnion).default([]),
  })
);
export type BlockNode = z.infer<typeof BlockNodeSchema>;

/* =======================
   LOOPS
======================= */

export const LoopNodeSchema: z.ZodType<any> = z.lazy(() =>
  ASTNodeBaseSchema.extend({
    node_type: z.literal("loop"),
    loop_type: LoopType.default("for"),

    iterator: VariableNodeSchema.optional(),
    start: ExpressionNodeUnion.optional(),
    end: ExpressionNodeUnion.optional(),
    step: ExpressionNodeUnion.optional(),

    collection: ExpressionNodeUnion.optional(),
    condition: ExpressionNodeUnion.optional(),

    body: BlockNodeSchema.optional(),

    estimated_iterations: z.string().optional(),
    nesting_level: z.number().default(0),
  })
);
export type LoopNode = z.infer<typeof LoopNodeSchema>;

/* =======================
   CONDITIONALS
======================= */

export const ConditionalNodeSchema: z.ZodType<any> = z.lazy(() =>
  ASTNodeBaseSchema.extend({
    node_type: z.literal("conditional"),
    condition: ExpressionNodeUnion.optional(),
    then_branch: BlockNodeSchema.optional(),
    else_branch: BlockNodeSchema.optional(),
    elif_branches: z.array(z.lazy(() => ConditionalNodeSchema)).default([]),
  })
);
export type ConditionalNode = z.infer<typeof ConditionalNodeSchema>;

/* =======================
   FUNCTIONS
======================= */

export const FunctionNodeSchema: z.ZodType<any> = z.lazy(() =>
  ASTNodeBaseSchema.extend({
    node_type: z.literal("function"),
    name: z.string(),
    parameters: z.array(VariableNodeSchema).default([]),
    body: BlockNodeSchema.optional(),
    return_type: z.string().optional(),
    is_recursive: z.boolean().default(false),
  })
);
export type FunctionNode = z.infer<typeof FunctionNodeSchema>;

/* =======================
   PROGRAM ROOT
======================= */

export const ProgramNodeSchema = ASTNodeBaseSchema.extend({
  node_type: z.literal("program"),
  functions: z.array(FunctionNodeSchema).default([]),
  global_statements: BlockNodeSchema.optional(),
});
export type ProgramNode = z.infer<typeof ProgramNodeSchema>;

/* =======================
   UNIONS
======================= */

export const ExpressionNodeUnion = z.lazy(() =>
  z.union([
    VariableNodeSchema,
    LiteralNodeSchema,
    BinaryOpNodeSchema,
    UnaryOpNodeSchema,
    ArrayAccessNodeSchema,
  ])
);

export const ASTNodeUnion: z.ZodType<any> = z.lazy(() =>
  z.union([
    ProgramNodeSchema,
    FunctionNodeSchema,
    BlockNodeSchema,
    LoopNodeSchema,
    ConditionalNodeSchema,
    AssignmentNodeSchema,
    ReturnNodeSchema,
    FunctionCallNodeSchema,
    RecursiveCallNodeSchema,
    VariableNodeSchema,
    LiteralNodeSchema,
    BinaryOpNodeSchema,
    UnaryOpNodeSchema,
    ArrayAccessNodeSchema,
  ])
);
