/**
 * @file Path aliases for the SmartFormIO project
 * These paths should be used for imports to maintain consistency
 * and make refactoring easier.
 */

export const Paths = {
  '@events': 'src/events',
  '@interfaces': 'src/interfaces',
  '@renderer': 'src/renderer',
  '@utils': 'src/utils',
  '@web-components': 'src/web-components',
  '@wrappers': 'src/wrappers',
  '@renderer/inputs': 'src/renderer/inputs',
  '@wrappers/next': 'src/wrappers/Next',
  '@wrappers/react': 'src/wrappers/React'
} as const;

// Usage example:
// import { FormSchema } from '@interfaces/form.interface';
// import { validateField } from '@utils/validation';
