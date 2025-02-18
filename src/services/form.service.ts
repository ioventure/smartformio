import { IFormSchema } from "@interfaces/core.interface";
import { formApiHandler } from "@events/form.api.events";
import { logger } from "@services/logger.service";

/**
 * Singleton FormService class
 * Manages form instances and their configurations
 */
export class FormService {
  private static instance: FormService;
  private formInstances: Map<
    string,
    {
      form: HTMLFormElement;
      schema: IFormSchema;
    }
  >;
  private readonly logContext = "FormService";

  private constructor() {
    this.formInstances = new Map();
    logger.info("FormService singleton initialized", this.logContext);
  }

  /**
   * Get the singleton instance of FormService
   */
  public static getInstance(): FormService {
    if (!FormService.instance) {
      FormService.instance = new FormService();
    }
    return FormService.instance;
  }

  /**
   * Register a new form instance
   */
  public registerForm(
    id: string,
    form: HTMLFormElement,
    schema: IFormSchema
  ): void {
    if (this.formInstances.has(id)) {
      logger.warn(
        `Form with ID ${id} already exists. Updating configuration.`,
        this.logContext
      );
    }
    this.formInstances.set(id, { form, schema });
    logger.info(`Form ${id} registered successfully`, this.logContext);
  }

  /**
   * Unregister a form instance
   */
  public unregisterForm(id: string): void {
    if (this.formInstances.delete(id)) {
      logger.info(`Form ${id} unregistered successfully`, this.logContext);
    }
  }

  /**
   * Get a form instance by ID
   */
  public getForm(
    id: string
  ): { form: HTMLFormElement; schema: IFormSchema } | undefined {
    return this.formInstances.get(id);
  }

  /**
   * Handle form submission
   */
  public async submit(
    id: string,
    formData: Record<string, any>
  ): Promise<void> {
    const instance = this.formInstances.get(id);
    if (!instance) {
      throw new Error(`Form with ID ${id} not found`);
    }

    const { form, schema } = instance;

    try {
      if (schema.api) {
        await formApiHandler.handleSubmission(form, schema, formData, id);
      } else {
        // If no API config, just reset form
        form.reset();
      }
    } catch (error) {
      logger.error(
        `Form submission failed for ${id}`,
        error instanceof Error ? error : new Error(String(error)),
        this.logContext
      );
      throw error;
    }
  }

  /**
   * Update form UI state during submission
   */
  public updateSubmitButtonState(id: string, isSubmitting: boolean): void {
    const instance = this.formInstances.get(id);
    if (!instance) {
      return;
    }

    const submitButton = instance.form.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    if (submitButton) {
      submitButton.disabled = isSubmitting;
      if (isSubmitting) {
        submitButton.setAttribute("aria-busy", "true");
      } else {
        submitButton.removeAttribute("aria-busy");
      }
    }
  }
}

// Export singleton instance
export const formService = FormService.getInstance();
