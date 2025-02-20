/**
 * @file Renderer module index
 * @module Renderer
 * @description Centralizes exports for all rendering functionality.
 * This includes form renderers, input renderers, and rendering utilities.
 */

/**
 * Form renderer
 * @see {@link FormRenderer}
 */
export * from "@renderer/form.renderer";

/**
 * Rendering utilities
 * @see {@link RenderHelper}
 */
export * from "@renderer/helper";

/**
 * Input renderers
 * @see {@link TextInputRenderer}
 * @see {@link DateInputRenderer}
 * @see {@link FileInputRenderer}
 * @see {@link RadioInputRenderer}
 * @see {@link SelectInputRenderer}
 * @see {@link CheckboxInputRenderer}
 */
export * from "@renderer/inputs";

/**
 * @example
 * ```typescript
 * // Import form renderer
 * import { formRenderer } from '@renderer';
 *
 * // Import specific input renderers
 * import {
 *   textInputRenderer,
 *   dateInputRenderer,
 *   fileInputRenderer,
 *   radioInputRenderer,
 *   selectInputRenderer,
 *   checkboxInputRenderer,
 * } from '@renderer';
 *
 * // Import rendering utilities
 * import { renderHelper, renderAttr, renderFieldWrapper } from '@renderer';
 *
 * // Or import everything
 * import * as renderer from '@renderer';
 * ```
 */
