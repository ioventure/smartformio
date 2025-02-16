import { FormSchema } from "@interfaces/core.interface";
import { FormFieldSchema } from "@interfaces/field.interface";
import { renderTextInput } from "@renderer/inputs/text-input";
import { renderDateInput } from "@renderer/inputs/date-input";
import { renderFileInput } from "@renderer/inputs/file-input";
import { renderSelect } from "@renderer/inputs/select-input";
import { renderRadio } from "@renderer/inputs/radio-input";
import { renderCheckbox } from "@renderer/inputs/checkbox-input";

/**
 * Renders a form based on the provided schema
 */
export async function renderForm(schema: FormSchema): Promise<string> {
  const fields = schema.fields.map((field: FormFieldSchema) => {
    const fieldType = field.type;
    switch (fieldType) {
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
        console.warn(`Unsupported field type: ${fieldType}`);
        return "";
    }
  });

  return `
    <form id="smartform" part="container">
      ${schema.title ? `<h2 part="title">${schema.title}</h2>` : ""}
      ${schema.description ? `<p part="description">${schema.description}</p>` : ""}
      ${fields.join("\n")}
      <button type="submit" part="button" disabled>${schema.submitButtonText || "Submit"}</button>
    </form>
  `;
}
