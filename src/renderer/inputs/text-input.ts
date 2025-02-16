import { TextField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";

/**
 * Renders a text input field based on the provided schema
 */
export function renderTextInput(field: TextField): string {
  // Handle textarea separately as it's a different element
  if (field.type === "textarea") {
    const input = `
      <div part="input-wrapper">
        <textarea 
          part="input input-textarea" 
          ${renderAttr({
            name: field.name,
            placeholder: field.placeholder,
            required: field.required,
            readonly: field.readonly,
            disabled: field.disabled,
            "data-testid": `input-${field.name}`,
            minlength: field.minLength?.toString(),
            maxlength: field.maxLength?.toString(),
            "aria-label": field.label,
            "aria-required": field.required ? "true" : undefined,
            "aria-describedby": `help-${field.name} error-${field.name}`,
            "aria-invalid": "false",
          })}
        >${field.value || ""}</textarea>
      </div>
    `;
    return renderFieldWrapper(field, input);
  }

  // Handle specific attributes for different input types
  const typeSpecificAttrs: Record<string, any> = {
    number: {
      min: field.min?.toString(),
      max: field.max?.toString(),
      step: "1",
      inputmode: "numeric",
    },
    email: {
      pattern: field.pattern || "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      autocomplete: "email",
      inputmode: "email",
    },
    password: {
      autocomplete: "new-password",
      minlength: field.minLength?.toString(),
    },
    text: {
      pattern: field.pattern,
      autocomplete: field.name === "username" ? "username" : "off",
    },
  };

  // Build input parts
  const inputParts = ["input"];
  if (field.type) {
    inputParts.push(`input-${field.type}`);
  }
  if (field.leadingIcon) {
    inputParts.push("input-leading-icon");
  }
  if (field.trailingIcon) {
    inputParts.push("input-trailing-icon");
  }

  const input = `
    <div part="input-wrapper">
      ${field.leadingIcon ? `<span part="leading-icon">${field.leadingIcon}</span>` : ""}
      <input 
        part="${inputParts.join(" ")}"
        ${renderAttr({
          type: field.type,
          name: field.name,
          placeholder: field.placeholder,
          required: field.required,
          readonly: field.readonly,
          disabled: field.disabled,
          "data-testid": `input-${field.name}`,
          minlength: field.minLength?.toString(),
          maxlength: field.maxLength?.toString(),
          "aria-label": field.label,
          "aria-required": field.required ? "true" : undefined,
          "aria-describedby": `help-${field.name} error-${field.name}`,
          "aria-invalid": "false",
          ...(typeSpecificAttrs[field.type] || {}),
          value: field.value,
        })} 
      />
      ${field.trailingIcon ? `<span part="trailing-icon">${field.trailingIcon}</span>` : ""}
    </div>
  `;

  return renderFieldWrapper(field, input);
}
