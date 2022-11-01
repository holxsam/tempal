import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { flexCenter } from "../../../styles/utility-styles.css";
import { hsla } from "../../../styles/theme.util";
import { theme, lightTheme, darkTheme } from "../../../styles/themes.css";

export const row = style({
  width: "100%",
  height: "min-content",

  display: "flex",
  gap: "0.25rem",
});

export const contentRow = styleVariants({
  row: [row, { flexDirection: "row" }],
  column: [row, { flexDirection: "column" }],
});

export const traitContainer = style({
  maxHeight: "100%",

  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

export const traitLabel = style({
  backgroundColor: hsla(theme.colors.white[3]),

  borderRadius: 5,
  padding: "3px 6px",
  width: "min-content",

  whiteSpace: "nowrap",

  color: hsla(theme.colors.black[10], 0.7),
  fontWeight: 500,
  fontSize: 12,
});

export const traitEffect = style({
  paddingLeft: 6,

  overflow: "hidden",

  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 4,
  lineClamp: 4,

  color: hsla(theme.colors.black[10]),

  fontStyle: "italic",
  fontSize: 11,
});