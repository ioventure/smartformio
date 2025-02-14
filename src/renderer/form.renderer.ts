import { FormFieldSchema, FormSchema } from "../interfaces/form.interface";
import { renderTextInput } from "./inputs/text-input";
import { renderDateInput } from "./inputs/date-input";
import { renderFileInput } from "./inputs/file-input";
import { renderSelect } from "./inputs/select-input";
import { renderRadio } from "./inputs/radio-input";
import { renderCheckbox } from "./inputs/checkbox-input";

/**
 * Renders a form field based on its type.
 * Maps each field type to its corresponding renderer.
 *
 * @param field - The field configuration
 * @returns HTML string for the rendered field
 * @throws Error if field type is not supported
 */
function renderField(field: FormFieldSchema): string {
  try {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
      case "textarea":
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
        throw new Error(`Unsupported field type: ${(field as any).type}`);
    }
  } catch (error) {
    console.error(`Error rendering field ${field.name}:`, error);
    return `
      <div class="field error" part="field">
        <p part="error-text">Error rendering field: ${field.name}</p>
      </div>
    `;
  }
}

/**
 * Renders the form markup (HTML) without including any style block.
 *
 * @param schema - The form schema containing all field definitions
 * @returns HTML string for the complete form
 */
export function renderFormMarkup(schema: FormSchema): string {
  try {
    const fieldsHtml = schema.fields
      .map((field: FormFieldSchema) => renderField(field))
      .join("");

    return `
      <div class="smartformio-container" part="container">
        ${schema.title ? `<h2 part="title">${schema.title}</h2>` : ""}
        ${
          schema.description
            ? `<p part="description">${schema.description}</p>`
            : ""
        }
        <form id="smartform" part="form">
          ${fieldsHtml}
          ${
            schema.showSubmitButton !== false
              ? `
            <button type="submit" part="button">
              ${schema.submitButtonText || "Submit"}
            </button>
          `
              : ""
          }
        </form>
      </div>
    `;
  } catch (error) {
    console.error("Error rendering form:", error);
    return `
      <div class="smartformio-container error" part="container">
        <p part="error-text">Error rendering form. Please check the schema.</p>
      </div>
    `;
  }
}

/**
 * Renders the complete form.
 * Since styling is controlled externally, this function only returns the markup.
 *
 * @param schema - The form schema to render
 * @returns Promise that resolves to the complete HTML string
 */
export async function renderForm(schema: FormSchema): Promise<string> {
  try {
    return renderFormMarkup(schema);
  } catch (error) {
    console.error("Error in renderForm:", error);
    return `
      <div class="smartformio-container error" part="container">
        <p part="error-text">An error occurred while rendering the form.</p>
      </div>
    `;
  }
}
