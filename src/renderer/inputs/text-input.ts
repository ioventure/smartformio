import { TextField } from "../../interfaces/form.interface";
import { renderAttr, renderFieldLabel } from "../helper";

/**
 * Builds common attributes for text-like inputs.
 */
function buildCommonAttributes(field: TextField) {
  return {
    placeholder: renderAttr("placeholder", field.placeholder),
    required: field.required ? "required" : "",
    disabled: field.disabled ? "disabled" : "",
    pattern: field.pattern ? `pattern="${field.pattern}" ` : "",
    validationMessage: field.validationMessage
      ? `title="${field.validationMessage}" `
      : "",
    defaultValue:
      field.defaultValue !== undefined && field.type !== "textarea"
        ? renderAttr("value", field.defaultValue as string | number)
        : "",
    classAttr: field.className ? `class="${field.className}" ` : "",
  };
}

/**
 * Builds HTML for leading and trailing icons.
 */
function buildIconHtml(field: TextField): {
  leadingIcon: string;
  trailingIcon: string;
} {
  return {
    leadingIcon: field.leadingIcon
      ? `<span part="leading-icon">${field.leadingIcon}</span>`
      : "",
    trailingIcon: field.trailingIcon
      ? `<span part="trailing-icon">${field.trailingIcon}</span>`
      : "",
  };
}

/**
 * Renders a text-like input field (including textarea) with advanced features.
 * External styling is applied via `part` attributes.
 */
export function renderTextInput(field: TextField): string {
  const {
    placeholder,
    required,
    disabled,
    pattern,
    validationMessage,
    defaultValue,
    classAttr,
  } = buildCommonAttributes(field);
  const { leadingIcon, trailingIcon } = buildIconHtml(field);

  // If hiddenLabel is true, add a "sr-only" class to the label.
  const labelClass = field.hiddenLabel ? "sr-only" : "";
  const labelHtml = renderFieldLabel(field, field.name, labelClass);

  // Help text and validation (error) message
  const helpTextHtml = field.helpText
    ? `<p part="help-text">${field.helpText}</p>`
    : "";
  // Use validationMessage for both the title attribute and inline error display.
  const errorTextHtml = field.validationMessage
    ? `<p part="error-text">${field.validationMessage}</p>`
    : "";

  // Determine the input part name based on icon presence.
  let inputPart = "input";
  if (field.leadingIcon) inputPart += " input-leading-icon";
  if (field.trailingIcon) inputPart += " input-trailing-icon";

  // Render a textarea if the field type is "textarea".
  if (field.type === "textarea") {
    const initialValue = field.defaultValue ?? "";
    return `
      <div class="field" part="field">
        ${labelHtml}
        <div class="input-wrapper" part="input-wrapper">
          ${leadingIcon}
          <textarea 
            id="${field.name}" 
            name="${field.name}" 
            ${required}
            ${disabled}
            ${placeholder}
            ${classAttr}
            ${pattern}
            ${validationMessage}
            part="${inputPart}"
          >${initialValue}</textarea>
          ${trailingIcon}
        </div>
        ${helpTextHtml}
        ${errorTextHtml}
      </div>
    `;
  }

  // Render a standard input for other types.
  return `
    <div class="field" part="field">
      ${labelHtml}
      <div class="input-wrapper" part="input-wrapper">
        ${leadingIcon}
        <input 
          type="${field.type}" 
          id="${field.name}" 
          name="${field.name}" 
          ${required}
          ${disabled}
          ${placeholder}
          ${defaultValue}
          ${pattern}
          ${validationMessage}
          ${classAttr}
          part="${inputPart}"
        />
        ${trailingIcon}
      </div>
      ${helpTextHtml}
      ${errorTextHtml}
    </div>
  `;
}
