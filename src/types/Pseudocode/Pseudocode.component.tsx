// PseudocodeInput.tsx
import { foldGutter, foldService, StreamLanguage, syntaxHighlighting } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { placeholder } from '@codemirror/view';
import { EditorView, basicSetup } from 'codemirror';
import { useEffect, useRef, useState } from 'react';

import { BaseResponseAreaProps } from '../base-props.type';

import { autoIndentAfterColon } from './plugins/autoIndent';
import { pseudocodeFoldFunc } from './plugins/fold';
import { pseudocodeHighlightStyle } from './plugins/highlight';
import { pseudocodeLanguage } from './plugins/language';
import { pseudocodeTheme } from './plugins/pseudocode.theme';
import { StudentResponse } from './types/input';
import { usePseudocodeInputStyles } from './utils/styles';

type PseudocodeInputProps = Omit<BaseResponseAreaProps, 'handleChange' | 'answer'> & {
  handleChange: (val: StudentResponse) => void;
  answer?: StudentResponse;
  isTeacherMode?: boolean;
};

export const PseudocodeInput: React.FC<PseudocodeInputProps> = ({
  handleChange,
  answer,
  isTeacherMode = false,
}) => {
  const { classes } = usePseudocodeInputStyles();
  const [internalAnswer, setInternalAnswer] = useState<StudentResponse>(answer ?? {
    pseudocode: '',
    time_complexity: null,
    space_complexity: null,
    explanation: null,
  });

  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);

  // Sync external answer only when it changes
  useEffect(() => {
    if (!answer) return;
    setInternalAnswer(answer);
  }, [answer]);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: internalAnswer.pseudocode ?? '',
      extensions: [
        foldGutter(),
        foldService.of(pseudocodeFoldFunc),
        autoIndentAfterColon,
        basicSetup,
        pseudocodeLanguage,
        syntaxHighlighting(pseudocodeHighlightStyle),
        pseudocodeTheme,
        placeholder('Write your pseudocode here...'),
        EditorView.updateListener.of((update) => {
          if (!update.docChanged) return;
          const newCode = update.state.doc.toString();
          setInternalAnswer((prev) => ({ ...prev, pseudocode: newCode }));
        }),
        EditorView.theme({
          '&': { height: '100%' },
          '.cm-scroller': { overflow: 'auto' },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  // Debounced / onBlur submit
  const reportChange = () => {
    handleChange({
      pseudocode: internalAnswer.pseudocode ?? '',
      time_complexity: internalAnswer.time_complexity ?? null,
      space_complexity: internalAnswer.space_complexity ?? null,
      explanation: internalAnswer.explanation ?? null,
    });
  };

  return (
    <div className={classes.root}>
      <div ref={editorRef} className={classes.editor} />

      <input
        className={classes.field}
        value={internalAnswer.time_complexity ?? ''}
        placeholder="Time Complexity"
        onChange={(e) => setInternalAnswer((prev) => ({ ...prev, time_complexity: e.target.value }))}
        onBlur={reportChange}
      />

      <input
        className={classes.field}
        value={internalAnswer.space_complexity ?? ''}
        placeholder="Space Complexity"
        onChange={(e) => setInternalAnswer((prev) => ({ ...prev, space_complexity: e.target.value }))}
        onBlur={reportChange}
      />

      <textarea
        className={classes.textarea}
        value={internalAnswer.explanation ?? ''}
        placeholder="Explanation"
        onChange={(e) => setInternalAnswer((prev) => ({ ...prev, explanation: e.target.value }))}
        onBlur={reportChange}
      />

      {isTeacherMode && <div className={classes.teacherSlot} />}
    </div>
  );
};