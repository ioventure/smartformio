/**
 * @file Validation utilities for form fields
 * @module Events/ValidationUtils
 * @description Provides utility functions for managing form field validation states
 * and error handling with accessibility support.
 */

/**
 * CSS part names for styling elements
 * @constant
 */
const PARTS = {
  ERROR: {
    BASE: "error-text",
    VISIBLE: "error-text-visible",
  },
  HELP: {
    BASE: "help-text",
    HIDDEN: "help-text-hidden",
  },
  INPUT: {
    INVALID: "input-invalid",
  },
} as const;

/**
 * Applies error state to a form field
 * @description Updates the visual and accessibility states of a form field to indicate an error condition
 *
 * @param {NodeListOf<HTMLInputElement>} inputs - The input elements to mark as invalid
 * @param {HTMLElement} errorElement - The element to display the error message
 * @param {HTMLElement} [helpElement] - Optional help text element to hide during error state
 * @param {string} [message] - The error message to display
 *
 * @example
 * ```typescript
 * const inputs = form.querySelectorAll('[name="email"]');
 * const errorEl = form.querySelector('[data-error="email"]');
 * const helpEl = form.querySelector('[data-help="email"]');
 *
 * applyErrorState(inputs, errorEl, helpEl, 'Please enter a valid email address');
 * ```
 */
export function applyErrorState(
  inputs: NodeListOf<HTMLInputElement>,
  errorElement: HTMLElement,
  helpElement?: HTMLElement,
  message?: string
): void {
  // Update error message
  errorElement.textContent = message || "";
  errorElement.setAttribute(
    "part",
    `${PARTS.ERROR.BASE} ${PARTS.ERROR.VISIBLE}`
  );

  // Hide help text if present
  if (helpElement) {
    helpElement.setAttribute("part", `${PARTS.HELP.BASE} ${PARTS.HELP.HIDDEN}`);
  }

  // Mark inputs as invalid
  inputs.forEach((input) => {
    const inputParts = input.getAttribute("part")?.split(" ") || [];
    if (!inputParts.includes(PARTS.INPUT.INVALID)) {
      inputParts.push(PARTS.INPUT.INVALID);
    }
    input.setAttribute("part", inputParts.join(" "));
    input.setAttribute("aria-invalid", "true");
  });
}

/**
 * Clears error state from a form field
 * @description Resets the visual and accessibility states of a form field to its normal state
 *
 * @param {NodeListOf<HTMLInputElement>} inputs - The input elements to unmark as invalid
 * @param {HTMLElement} errorElement - The element containing the error message
 * @param {HTMLElement} [helpElement] - Optional help text element to restore
 *
 * @example
 * ```typescript
 * const inputs = form.querySelectorAll('[name="email"]');
 * const errorEl = form.querySelector('[data-error="email"]');
 * const helpEl = form.querySelector('[data-help="email"]');
 *
 * clearErrorState(inputs, errorEl, helpEl);
 * ```
 */
export function clearErrorState(
  inputs: NodeListOf<HTMLInputElement>,
  errorElement: HTMLElement,
  helpElement?: HTMLElement
): void {
  // Clear error message
  errorElement.textContent = "";
  errorElement.setAttribute("part", PARTS.ERROR.BASE);

  // Restore help text if present
  if (helpElement) {
    helpElement.setAttribute("part", PARTS.HELP.BASE);
  }

  // Remove invalid state from inputs
  inputs.forEach((input) => {
    const inputParts = input.getAttribute("part")?.split(" ") || [];
    const filteredParts = inputParts.filter((p) => p !== PARTS.INPUT.INVALID);
    input.setAttribute("part", filteredParts.join(" "));
    input.setAttribute("aria-invalid", "false");
  });
}
