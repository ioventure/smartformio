// events/validation.utils.ts

/**
 * Validation Utilities
 *
 * Contains helper functions to apply or clear error states on form inputs,
 * ensuring consistent error handling and accessibility across all input types.
 */

/**
 * Applies error state to a field by updating the error element,
 * hiding the help element, and marking inputs as invalid.
 * @param inputs NodeList of input elements
 * @param errorElement The error message container element
 * @param helpElement (Optional) The help text element
 * @param message The error message to display
 */
export function applyErrorState(
  inputs: NodeListOf<HTMLInputElement>,
  errorElement: HTMLElement,
  helpElement?: HTMLElement,
  message?: string
): void {
  errorElement.textContent = message || "";
  errorElement.setAttribute("part", "error-text error-text-visible");

  if (helpElement) {
    helpElement.setAttribute("part", "help-text help-text-hidden");
  }

  inputs.forEach((input) => {
    const inputParts = input.getAttribute("part")?.split(" ") || [];
    if (!inputParts.includes("input-invalid")) {
      inputParts.push("input-invalid");
    }
    input.setAttribute("part", inputParts.join(" "));
    input.setAttribute("aria-invalid", "true");
  });
}

/**
 * Clears error state from a field by resetting the error and help elements
 * and removing the invalid marker from the input elements.
 * @param inputs NodeList of input elements
 * @param errorElement The error message container element
 * @param helpElement (Optional) The help text element
 */
export function clearErrorState(
  inputs: NodeListOf<HTMLInputElement>,
  errorElement: HTMLElement,
  helpElement?: HTMLElement
): void {
  errorElement.textContent = "";
  errorElement.setAttribute("part", "error-text");

  if (helpElement) {
    helpElement.setAttribute("part", "help-text");
  }

  inputs.forEach((input) => {
    const inputParts = input.getAttribute("part")?.split(" ") || [];
    const filteredParts = inputParts.filter((p) => p !== "input-invalid");
    input.setAttribute("part", filteredParts.join(" "));
    input.setAttribute("aria-invalid", "false");
  });
}
