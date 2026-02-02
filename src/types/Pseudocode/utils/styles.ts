import { makeStyles } from "@styles";

/* -------------------- Styles -------------------- */
export const usePseudocodeInputStyles = makeStyles()((theme) => ({
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
  teacherSlot: {
    minHeight: 0,
  },
}));
