import {
  FormFieldSchema,
  FormRendererOptions,
  FormSchema,
} from "../interfaces/form.interface";

/**
 * Renders a single form field based on its schema.
 */
export function renderField(field: FormFieldSchema): string {
  switch (field.type) {
    case "text":
    case "email":
    case "password":
    case "number":
      return `
        <div class="field" part="field">
          <label for="${field.name}" part="label">${
        field.label || field.name
      }</label>
          <input type="${field.type}" id="${field.name}" name="${field.name}" ${
        field.required ? "required" : ""
      } part="input"/>
        </div>
      `;
    case "select":
      return `
        <div class="field" part="field">
          <label for="${field.name}" part="label">${
        field.label || field.name
      }</label>
          <select id="${field.name}" name="${field.name}" ${
        field.required ? "required" : ""
      } part="select">
            ${(field.options || [])
              .map((option) => `<option value="${option}">${option}</option>`)
              .join("")}
          </select>
        </div>
      `;
    default:
      return `<div class="field" part="field">Unsupported field type: ${field.type}</div>`;
  }
}

/**
 * Renders the form markup (HTML) without including any style block.
 */
export function renderFormMarkup(schema: FormSchema): string {
  const fieldsHtml = schema.fields.map(renderField).join("");
  return `
    <div class="smartformio-container" part="container">
      ${schema.title ? `<h2 part="title">${schema.title}</h2>` : ""}
      <form id="smartform" part="form">
        ${fieldsHtml}
        <button type="submit" part="button">Submit</button>
      </form>
    </div>
  `;
}

/**
 * Asynchronously renders the complete form.
 *
 * This function returns only the markup without injecting any default styles.
 *
 * @param schema - The form schema to render.
 * @param options - Renderer options (currently unused).
 * @returns A promise that resolves to the complete HTML string.
 */
export async function renderForm(
  schema: FormSchema,
  options?: FormRendererOptions
): Promise<string> {
  // Simply return the markup; default styling must be provided externally.
  return renderFormMarkup(schema);
}
