import { makeStyles } from "@styles";

/* -------------------- Styles -------------------- */
export const usePseudocodeStyles = makeStyles()((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  editor: {
    width: '100%',
    minHeight: 200,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#fff',
    '& .cm-editor': { outline: 'none' },
    '& .cm-content': {
      fontFamily: '"Fira Code", "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.6,
      padding: '10px 0',
    },
    '& .cm-gutters': {
      backgroundColor: '#f7f7f7',
      borderRight: `1px solid ${theme.palette.divider}`,
    },
  },
  field: {
    padding: '6px 8px',
    borderRadius: 4,
    border: `1px solid ${theme.palette.divider}`,
    fontSize: 14,
    width: '100%',
  },
  textarea: {
    padding: '6px 8px',
    borderRadius: 4,
    border: `1px solid ${theme.palette.divider}`,
    fontSize: 14,
    width: '100%',
    minHeight: 80,
    resize: 'vertical',
  },
  // eval params panel
  evalParams: {
    border: '1px solid var(--border-muted)',
    borderRadius: 6,
    marginBottom: 8,
    background: 'var(--bg-subtle)',
  },

  evalParamsToggle: {
    width: '100%',
    textAlign: 'left',
    padding: '6px 10px',
    fontWeight: 600,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },

  evalParamsContent: {
    maxHeight: 320,
    overflow: 'auto',
    padding: '8px 10px',
  },

  evalParamsSection: {
    border: 'none',
    marginBottom: 8,

    '& legend': {
      fontSize: 12,
      opacity: 0.7,
      marginBottom: 4,
    },
  },

  evalParamsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    marginBottom: 4,
  }
}));
