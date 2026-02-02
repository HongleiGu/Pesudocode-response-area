// PseudocodeInput.tsx
import { StreamLanguage, syntaxHighlighting } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { placeholder, keymap } from '@codemirror/view';
import { makeStyles } from '@styles'; // adjust to your project
import { EditorView, basicSetup } from 'codemirror';
import { useEffect, useRef } from 'react';

import { BaseResponseAreaProps } from '../base-props.type';

import { autoIndentAfterColon } from './utils/autoIndent';
import { pseudocodeHighlightStyle } from './utils/highlight';
import { pseudocodeLanguage } from './utils/language';
import { pseudocodeTheme } from './utils/pseudocode.theme';

type PseudocodeInputProps = Omit<BaseResponseAreaProps, 'handleChange' | 'answer'> & {
  handleChange: (val: string) => void;
  answer?: string;
};


export const PseudocodeInput: React.FC<PseudocodeInputProps> = ({ handleChange, answer }) => {
  const { classes } = useStyles();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: answer ?? '',
      extensions: [
        autoIndentAfterColon,
        basicSetup,
        pseudocodeLanguage,
        syntaxHighlighting(pseudocodeHighlightStyle),
        pseudocodeTheme,
        placeholder('Write your pseudocode here...'),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            handleChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": { height: "100%" },
          ".cm-scroller": { overflow: "auto" },
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

  // Update editor if answer prop changes externally
  useEffect(() => {
    if (viewRef.current && answer !== undefined) {
      const view = viewRef.current;
      if (view.state.doc.toString() !== answer) {
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: answer },
        });
      }
    }
  }, [answer]);

  return <div ref={editorRef} className={classes.editor} />;
};

const useStyles = makeStyles()((theme) => ({
  editor: {
    width: '100%',
    minHeight: '200px',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '4px',
    overflow: 'hidden',
    backgroundColor: '#fff',

    '& .cm-editor': {
      outline: 'none',
    },
    '& .cm-content': {
      fontFamily: '"Fira Code", "Courier New", monospace',
      fontSize: '14px',
      padding: '10px 0',
    },
    '& .cm-gutters': {
      backgroundColor: '#f5f5f5',
      borderRight: `1px solid ${theme.palette.divider}`,
    },
  },
}));
