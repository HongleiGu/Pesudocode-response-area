import { StreamLanguage } from "@codemirror/language";

export const pseudocodeLanguage = StreamLanguage.define({
  token(stream) {
    if (stream.match(/IF|THEN|ELSE|ELSEIF|ENDIF|WHILE|FOR|TO|STEP|NEXT|REPEAT|UNTIL|FUNCTION|PROCEDURE|BEGIN|END|RETURN|PRINT|INPUT/i)) {
      return 'keyword';
    }
    if (stream.match(/TRUE|FALSE|NULL/i)) {
      return 'bool';
    }
    if (stream.match(/-?\d+(\.\d+)?/)) {
      return 'number';
    }
    if (stream.match(/(["'])(?:\\.|(?!\1).)*?\1/)) {
      return 'string';
    }
    if (stream.match(/\/\/.*/)) {
      return 'comment';
    }

    stream.next();
    return null;
  },
});