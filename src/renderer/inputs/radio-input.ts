import { IRadioField } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";

/**
 * Renders a radio button group based on the provided schema
 */
export function renderRadio(field: IRadioField): string {
  const groupParts = ["radio-group"];
  if (field.display) {
    groupParts.push(`radio-group-${field.display}`);
  } else {
    groupParts.push("radio-group-vertical"); // default to vertical
  }

  const input = `
    <div part="${groupParts.join(" ")}" role="radiogroup" aria-label="${field.label}">
      ${field.options
        .map((option, index) => {
          const value = typeof option === "string" ? option : option.value;
          const label = typeof option === "string" ? option : option.label;
          const checked = field.value === value ? "checked" : "";

          return `
            <label part="radio-container">
              <input 
                type="radio" 
                part="radio-input" 
                ${renderAttr({
                  name: field.name,
                  value: value,
                  required: field.required,
                  disabled: field.disabled,
                  "data-testid": `input-${field.name}-${index}`,
                  "aria-label": label,
                  checked,
                })} 
              />
              <span part="radio-label">${label}</span>
            </label>
          `;
        })
        .join("")}
    </div>
  `;

  return renderFieldWrapper(field, input);
}
