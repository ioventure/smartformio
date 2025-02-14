import { TextField } from "../../interfaces/form.interface";
import { renderAttr, renderFieldLabel } from "../helper";

/**
 * Builds common attributes for text-like inputs.
 */
function buildCommonAttributes(field: TextField): string {
  if (!field) {
    return "";
  }

  const attrs = [
    renderAttr("placeholder", field.placeholder),
    field.required ? "required" : "",
    field.disabled ? "disabled" : "",
    field.className ? `class="${field.className}"` : "",
    // Add ARIA attributes
    field.required ? 'aria-required="true"' : 'aria-required="false"',
    'aria-invalid="false"',
    field.helpText ? `aria-describedby="help-${field.name}"` : "",
    `aria-labelledby="label-${field.name}"`,
    // Add validation message
    field.validationMessage
      ? `validationMessage="${field.validationMessage}"`
      : "",
  ];

  // Add type-specific validation attributes
  if (field.type === "number") {
    attrs.push('step="any"');
    if (field.min !== undefined) attrs.push(renderAttr("min", field.min));
    if (field.max !== undefined) attrs.push(renderAttr("max", field.max));
  } else {
    if (field.pattern) attrs.push(renderAttr("pattern", field.pattern));
    if (field.minLength) attrs.push(renderAttr("minlength", field.minLength));
    if (field.maxLength) attrs.push(renderAttr("maxlength", field.maxLength));
  }

  return attrs.filter(Boolean).join(" ");
}

/**
 * Builds HTML for leading and trailing icons.
 */
function buildIconHtml(field: TextField): {
  leading: string;
  trailing: string;
} {
  return {
    leading: field.leadingIcon
      ? `<span part="leading-icon">${field.leadingIcon}</span>`
      : "",
    trailing: field.trailingIcon
      ? `<span part="trailing-icon">${field.trailingIcon}</span>`
      : "",
  };
}

/**
 * Determines the input parts based on icon presence.
 */
function getInputParts(field: TextField, isTextarea: boolean = false): string {
  const parts = ["input"];

  if (isTextarea) {
    parts.push("input-textarea");
  }

  if (field.leadingIcon) {
    parts.push("input-leading-icon");
  }

  if (field.trailingIcon) {
    parts.push("input-trailing-icon");
  }

  return parts.join(" ");
}

/**
 * Renders help and error text elements.
 */
function renderHelpAndError(field: TextField): string {
  return `
    ${field.helpText ? `<div part="help-text" id="help-${field.name}" data-help="${field.name}" style="display: block;">${field.helpText}</div>` : ""}
    <div part="error-text" id="error-${field.name}" data-error="${field.name}" style="display: none;"></div>
  `;
}

/**
 * Renders a textarea input with validation support.
 */
function renderTextarea(
  field: TextField,
  attributes: string,
  icons: { leading: string; trailing: string }
): string {
  const parts = getInputParts(field, true);
  return `
    <div class="field" part="field">
      ${renderFieldLabel(field, field.name, field.hiddenLabel ? "sr-only" : "")}
      <div class="input-wrapper" part="input-wrapper">
        ${icons.leading}
        <textarea 
          id="${field.name}" 
          name="${field.name}" 
          ${attributes}
          part="${parts}"
          exportparts="${parts}, input-invalid"
        ></textarea>
        ${icons.trailing}
      </div>
      ${renderHelpAndError(field)}
    </div>
  `;
}

/**
 * Renders a standard text input with validation support.
 */
function renderTextInputField(
  field: TextField,
  attributes: string,
  icons: { leading: string; trailing: string }
): string {
  const parts = getInputParts(field);
  return `
    <div class="field" part="field">
      ${renderFieldLabel(field, field.name, field.hiddenLabel ? "sr-only" : "")}
      <div class="input-wrapper" part="input-wrapper">
        ${icons.leading}
        <input 
          type="${field.type}" 
          id="${field.name}" 
          name="${field.name}" 
          ${attributes}
          part="${parts}"
          exportparts="${parts}, input-invalid"
        />
        ${icons.trailing}
      </div>
      ${renderHelpAndError(field)}
    </div>
  `;
}

/**
 * Main function to render a text-like input field with validation.
 */
export function renderTextInput(field: TextField): string {
  if (!field) {
    return `<div class="field error" part="field">
              <p part="error-text">Field configuration is missing.</p>
            </div>`;
  }

  const attributes = buildCommonAttributes(field);
  const icons = buildIconHtml(field);

  return field.type === "textarea"
    ? renderTextarea(field, attributes, icons)
    : renderTextInputField(field, attributes, icons);
}
