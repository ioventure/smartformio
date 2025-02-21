/**
 * @file Main entry point for SmartFormIO library
 */

// Export everything from core
export * from './core';

// Re-export version and library info for easy access
export { VERSION, LIBRARY_INFO } from './core';

// Export default initialize function
export { initialize as default } from './core';
