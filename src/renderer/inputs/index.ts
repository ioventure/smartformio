/**
 * @file Input renderers index
 * @module Renderer/Inputs
 * @description Centralizes exports for all input renderer implementations.
 * Each renderer is responsible for rendering a specific type of form input.
 */

/**
 * Checkbox input renderer
 * @see {@link CheckboxInputRenderer}
 */
export {
  checkboxInputRenderer,
  renderCheckbox,
} from "@renderer/inputs/checkbox-input";

/**
 * Date input renderer
 * @see {@link DateInputRenderer}
 */
export {
  dateInputRenderer,
  renderDateInput,
} from "@renderer/inputs/date-input";

/**
 * File input renderer
 * @see {@link FileInputRenderer}
 */
export {
  fileInputRenderer,
  renderFileInput,
} from "@renderer/inputs/file-input";

/**
 * Radio input renderer
 * @see {@link RadioInputRenderer}
 */
export { radioInputRenderer, renderRadio } from "@renderer/inputs/radio-input";

/**
 * Select input renderer
 * @see {@link SelectInputRenderer}
 */
export {
  selectInputRenderer,
  renderSelect,
} from "@renderer/inputs/select-input";

/**
 * Text input renderer
 * @see {@link TextInputRenderer}
 */
export {
  textInputRenderer,
  renderTextInput,
} from "@renderer/inputs/text-input";

/**
 * @example
 * ```typescript
 * // Import specific renderers
 * import { textInputRenderer, dateInputRenderer } from '@renderer/inputs';
 *
 * // Import render helper functions
 * import { renderTextInput, renderDateInput } from '@renderer/inputs';
 *
 * // Or import all renderers
 * import * as inputRenderers from '@renderer/inputs';
 * ```
 */
