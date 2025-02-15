import { CheckboxField, CheckboxOption } from "@interfaces/field.interface";
import { renderAttr, renderFieldWrapper } from "@renderer/helper";

/**
 * Renders a checkbox input or group based on the provided schema
 */
export function renderCheckbox(field: CheckboxField): string {
  // Handle single checkbox
  if (!field.options) {
    const input = `
      <div part="checkbox-wrapper">
        <label part="checkbox-container">
          <input 
            type="checkbox" 
            part="checkbox-input" 
            ${renderAttr({
              name: field.name,
              required: field.required,
              disabled: field.disabled,
              "data-testid": `input-${field.name}`,
              "aria-label": field.label,
              "aria-required": field.required ? "true" : undefined,
              "aria-describedby": field.description
                ? `description-${field.name}`
                : undefined,
              "aria-invalid": "false",
              checked: field.defaultValue ? "true" : undefined, // Use defaultValue for pre-filling
            })} 
          />
          <div part="checkbox-content">
            <span part="checkbox-label">${field.label}</span>
            ${field.description ? `<span part="checkbox-description" id="description-${field.name}">${field.description}</span>` : ""}
          </div>
        </label>
      </div>
    `;
    return renderFieldWrapper(field, input);
  }

  // Handle checkbox group
  const groupParts = ["checkbox-group"];
  if (field.display) {
    groupParts.push(`checkbox-group-${field.display}`);
  } else {
    groupParts.push("checkbox-group-vertical"); // default to vertical
  }

  const input = `
    <div part="${groupParts.join(" ")}" role="group" aria-label="${field.label}">
      ${
        field.required
          ? `
        <input 
          type="hidden" 
          name="${field.name}-required" 
          data-required-group="${field.name}" 
          required
          ${field.minSelect ? `data-min-select="${field.minSelect}"` : ""}
          ${field.maxSelect ? `data-max-select="${field.maxSelect}"` : ""}
        />
      `
          : ""
      }
      ${field.options
        .map((option, index) => {
          const value = typeof option === "string" ? option : option.value;
          const label = typeof option === "string" ? option : option.label;
          const description =
            typeof option === "string" ? undefined : option.description;
          const isChecked =
            Array.isArray(field.defaultValue) &&
            field.defaultValue.includes(value);

          return `
          <label part="checkbox-container">
            <input 
              type="checkbox" 
              part="checkbox-input" 
              ${renderAttr({
                name: `${field.name}[]`,
                value: value,
                required: field.required,
                disabled: field.disabled,
                "data-testid": `input-${field.name}-${index}`,
                "data-group": field.name,
                "aria-label": label,
                "aria-describedby": description
                  ? `description-${field.name}-${index}`
                  : undefined,
                "aria-invalid": "false",
                checked: isChecked ? "true" : undefined, // Use defaultValue for pre-filling
              })} 
            />
            <div part="checkbox-content">
              <span part="checkbox-label">${label}</span>
              ${description ? `<span part="checkbox-description" id="description-${field.name}-${index}">${description}</span>` : ""}
            </div>
          </label>
        `;
        })
        .join("")}
    </div>
  `;

  return renderFieldWrapper(field, input);
}
