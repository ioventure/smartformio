/**
 * Sets up the form submission event listener on the provided Shadow DOM.
 * When the form is submitted, it collects the form data and calls the provided callback.
 *
 * @param shadow - The shadow root containing the form.
 * @param onSubmit - A callback function to handle the form data.
 */
export function setupFormEvents(
  shadow: ShadowRoot,
  onSubmit: (data: Record<string, any>) => void
): void {
  const form = shadow.querySelector("#smartform") as HTMLFormElement;
  if (form) {
    form.addEventListener("submit", (event: Event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const data: Record<string, any> = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      onSubmit(data);
    });
  } else {
    console.warn("Form element with id 'smartform' not found in Shadow DOM.");
  }
}
