/**
 * Jest setup file for SmartFormIO tests
 */

// Mock CustomEvent for jsdom environment
class CustomEventPolyfill extends Event {
  detail: any;

  constructor(type: string, options?: CustomEventInit) {
    super(type, options);
    this.detail = options?.detail;
  }
}

// Add CustomEvent to global scope if not available
if (typeof window.CustomEvent !== 'function') {
  window.CustomEvent = CustomEventPolyfill as any;
}

// Mock Web Components API
if (!window.customElements) {
  window.customElements = {
    define: jest.fn(),
    get: jest.fn(),
    upgrade: jest.fn(),
    whenDefined: jest.fn(),
    getName: jest.fn()
  } as unknown as CustomElementRegistry;
}

// Create a basic mock for Element
const ElementMock = {
  innerHTML: '',
  getAttribute: jest.fn(),
  setAttribute: jest.fn(),
  removeAttribute: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  appendChild: jest.fn(),
  removeChild: jest.fn(),
  replaceChild: jest.fn(),
  cloneNode: jest.fn(),
  // Add other Element properties as needed
} as unknown as Element;

// Mock ShadowRoot
if (!window.ShadowRoot) {
  const shadowRootBase = {
    ...ElementMock,
    mode: 'open' as ShadowRootMode,
    host: ElementMock,
    activeElement: null,
    adoptedStyleSheets: [],
    fullscreenElement: null,
    pictureInPictureElement: null,
    pointerLockElement: null,
    styleSheets: [] as unknown as StyleSheetList,
    innerHTML: '',
    delegatesFocus: false,
    slotAssignment: 'manual' as SlotAssignmentMode,
    onslotchange: null,
  };

  class ShadowRootMock {
    constructor() {
      Object.assign(this, shadowRootBase);
    }
  }

  (window as any).ShadowRoot = ShadowRootMock;
}

// Mock IntersectionObserver
const IntersectionObserverMock = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: jest.fn()
}));

window.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

// Add any additional test setup or mocks below
beforeAll(() => {
  // Setup code that runs before all tests
  jest.useFakeTimers();
});

afterAll(() => {
  // Cleanup code that runs after all tests
  jest.useRealTimers();
});

beforeEach(() => {
  // Reset any mocks before each test
  jest.clearAllMocks();
  document.body.innerHTML = '';
});

afterEach(() => {
  // Clean up after each test
  jest.clearAllTimers();
});

// Export types and mocks for test files
export {
  CustomEventPolyfill,
  ElementMock,
  IntersectionObserverMock
};
