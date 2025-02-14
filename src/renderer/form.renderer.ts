import { FormSchema, FormFieldSchema } from "../interfaces/form.interface";
import { renderTextInput } from "./inputs/text-input";
import { renderDateInput } from "./inputs/date-input";
import { renderFileInput } from "./inputs/file-input";
import { renderSelect } from "./inputs/select-input";
import { renderRadio } from "./inputs/radio-input";
import { renderCheckbox } from "./inputs/checkbox-input";

// Error handler that can be overridden in tests
export const errorHandler = {
  handleError: (error: Error, context: string) => {
    if (process.env.NODE_ENV !== "test") {
      console.error(`Error ${context}:`, error);
    }
  },
};

/**
 * Renders a form field based on its type.
 */
function renderField(field: FormFieldSchema): string {
  if (!field) {
    return `<div class="field error" part="field">
              <p part="error-text">Field configuration is missing.</p>
            </div>`;
  }

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
    errorHandler.handleError(error as Error, "rendering field");
    return `
      <div class="field error" part="field">
        <p part="error-text">Error rendering field: ${field.name || "unknown"}</p>
      </div>
    `;
  }
}

/**
 * Renders the form markup (HTML) without including any style block.
 */
export function renderFormMarkup(schema: FormSchema): string {
  try {
    if (!schema || !schema.fields) {
      throw new Error("Invalid schema provided");
    }

    const fieldsHtml = schema.fields
      .map((field: FormFieldSchema) => renderField(field))
      .join("");

    return `
      <div class="smartformio-container" part="container">
        ${schema.title ? `<h2 part="title" id="form-title">${schema.title}</h2>` : ""}
        ${schema.description ? `<p part="description" id="form-desc">${schema.description}</p>` : ""}
        <form 
          id="smartform" 
          part="form"
          ${schema.title ? 'aria-labelledby="form-title"' : ""}
          ${schema.description ? 'aria-describedby="form-desc"' : ""}
          novalidate
        >
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
    errorHandler.handleError(error as Error, "rendering form");
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
 */
export async function renderForm(schema: FormSchema): Promise<string> {
  try {
    return renderFormMarkup(schema);
  } catch (error) {
    errorHandler.handleError(error as Error, "in renderForm");
    return `
      <div class="smartformio-container error" part="container">
        <p part="error-text">An error occurred while rendering the form.</p>
      </div>
    `;
  }
}
