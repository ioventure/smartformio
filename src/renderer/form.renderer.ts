import { FormFieldSchema, FormSchema } from "../interfaces/form.interface";
import { renderTextInput } from "./inputs/text-input";
import { renderDateInput } from "./inputs/date-input";
import { renderFileInput } from "./inputs/file-input";
import { renderSelect } from "./inputs/select-input";
import { renderRadio } from "./inputs/radio-input";
import { renderCheckbox } from "./inputs/checkbox-input";

/**
 * Renders the form markup (HTML) without including any style block.
 */
export function renderFormMarkup(schema: FormSchema): string {
  const fieldsHtml = schema.fields
    .map((field: FormFieldSchema) => {
      switch (field.type) {
        case "text":
        case "email":
        case "password":
        case "number":
          return renderTextInput(field);
        case "date":
          return renderDateInput(field);
        case "file":
          return renderFileInput(field);
        case "select":
          return renderSelect(field);
        case "radio":
          return renderRadio(field);
        case "checkbox":
          return renderCheckbox(field);
        default:
          return `<div class="field" part="field">Unsupported field type: ${field.type}</div>`;
      }
    })
    .join("");
  return `
    <div class="smartformio-container" part="container">
      ${schema.title ? `<h2 part="title">${schema.title}</h2>` : ""}
      <form id="smartform" part="form">
        ${fieldsHtml}
        <button type="submit" part="button">${
          schema.submitButtonText || "Submit"
        }</button>
      </form>
    </div>
  `;
}

/**
 * Renders the complete form.
 *
 * Since styling is controlled externally, this function only returns the markup.
 *
 * @param schema - The form schema to render.
 * @returns A promise that resolves to the complete HTML string.
 */
export async function renderForm(schema: FormSchema): Promise<string> {
  return renderFormMarkup(schema);
}
