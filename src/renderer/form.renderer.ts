import { IFormSchema } from "@interfaces/core.interface";
import { IFormFieldSchema } from "@interfaces/field.interface";
import { renderTextInput } from "@renderer/inputs/text-input";
import { renderDateInput } from "@renderer/inputs/date-input";
import { renderFileInput } from "@renderer/inputs/file-input";
import { renderSelect } from "@renderer/inputs/select-input";
import { renderRadio } from "@renderer/inputs/radio-input";
import { renderCheckbox } from "@renderer/inputs/checkbox-input";
import { logger } from "@services/logger.service";

/**
 * Singleton FormRenderer Service
 * Handles form rendering in both static and SSR environments
 */
export class FormRenderer {
  private static instance: FormRenderer;
  private readonly logContext = "FormRenderer";

  private constructor() {
    logger.info("FormRenderer singleton initialized", this.logContext);
  }

  /**
   * Get the singleton instance of FormRenderer
   */
  public static getInstance(): FormRenderer {
    if (!FormRenderer.instance) {
      FormRenderer.instance = new FormRenderer();
    }
    return FormRenderer.instance;
  }

  /**
   * Renders a field based on its type
   */
  private renderField(field: IFormFieldSchema): string {
    const fieldType = field.type;
    logger.debug(
      `Rendering field: ${field.name} (type: ${fieldType})`,
      this.logContext
    );
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
        logger.warn(`Unsupported field type: ${fieldType}`, this.logContext);
        return "";
    }
  }

  /**
   * Renders a complete form based on the provided schema
   */
  public async render(schema: IFormSchema): Promise<string> {
    logger.info(
      `Rendering form with ${schema.fields.length} fields`,
      this.logContext
    );

    logger.debug(
      `Form configuration: ${JSON.stringify({
        hasTitle: !!schema.title,
        hasDescription: !!schema.description,
        submitButtonText: schema.submitButtonText || "Submit",
      })}`,
      this.logContext
    );

    try {
      const fields = schema.fields.map((field: IFormFieldSchema) =>
        this.renderField(field)
      );

      const form = `
        <form id="smartform" part="container">
          ${schema.title ? `<h2 part="title">${schema.title}</h2>` : ""}
          ${schema.description ? `<p part="description">${schema.description}</p>` : ""}
          ${fields.join("\n")}
          <button type="submit" part="button" disabled>${schema.submitButtonText || "Submit"}</button>
        </form>
      `;

      logger.info("Form rendered successfully", this.logContext);
      logger.debug(
        `Generated form HTML length: ${form.length} characters`,
        this.logContext
      );
      return form;
    } catch (error) {
      logger.error(
        "Error rendering form",
        error instanceof Error ? error : new Error(String(error)),
        this.logContext
      );
      throw error;
    }
  }
}

// Export singleton instance
export const formRenderer = FormRenderer.getInstance();
