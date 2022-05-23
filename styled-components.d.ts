// ./styled-components.d.ts
import { theme } from "./src/theme";

export type CustomTheme = typeof theme;

declare module "styled-components" {
  export interface DefaultTheme extends CustomTheme {}
}
