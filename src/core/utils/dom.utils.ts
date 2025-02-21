/**
 * @file DOM utility functions
 */

import { ARIA_ATTRIBUTES } from '@core/constants/component.constants';
import { CollectionUtils } from './collection.utils';

type ElementText = string | number | boolean;

interface ElementOptions<K extends keyof HTMLElementTagNameMap> {
  attributes?: Record<string, string>;
  properties?: Partial<HTMLElementTagNameMap[K]>;
  part?: string | null;
  children?: (string | Node)[];
  html?: string;
  text?: ElementText;
}

interface IconOptions {
  part?: string;
  size?: number;
  className?: string;
}

interface SVGOptions {
  width?: number;
  height?: number;
  viewBox?: string;
  fill?: string;
  stroke?: string;
  part?: string;
}

type PartOptions = {
  add?: string[];
  remove?: string[];
  set?: string;
};

export class DOMUtils {
  /**
   * Create element with attributes and properties
   */
  static createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    options: ElementOptions<K> = {}
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);

    // Set attributes
    if (options.attributes) {
      CollectionUtils.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    // Set properties
    if (options.properties) {
      Object.assign(element, options.properties);
    }

    // Set part
    if (typeof options.part === 'string') {
      element.setAttribute('part', options.part);
    }

    // Set innerHTML
    if (options.html) {
      element.innerHTML = options.html;
    }

    // Set textContent
    if (options.text !== undefined) {
      element.textContent = String(options.text);
    }

    // Append children
    if (options.children) {
      options.children.forEach((child) => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child);
        }
      });
    }

    return element;
  }

  /**
   * Set multiple attributes on an element
   */
  static setAttributes(element: Element, attributes: Record<string, string | null>): void {
    CollectionUtils.entries(attributes).forEach(([key, value]) => {
      if (value === null) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, value);
      }
    });
  }

  /**
   * Update element part
   */
  static updatePart(element: Element, options: PartOptions): void {
    // Get current parts
    const currentParts = new Set((element.getAttribute('part') || '').split(' ').filter(Boolean));

    if (options.set) {
      // If set is provided, use it directly
      element.setAttribute('part', options.set);
      return;
    }

    // Remove parts
    if (options.remove) {
      options.remove.forEach((part) => currentParts.delete(part));
    }

    // Add parts
    if (options.add) {
      options.add.forEach((part) => currentParts.add(part));
    }

    // Update attribute
    element.setAttribute('part', Array.from(currentParts).join(' '));
  }

  /**
   * Set ARIA attributes
   */
  static setARIA(
    element: Element,
    attributes: Partial<Record<keyof typeof ARIA_ATTRIBUTES, string | null>>
  ): void {
    CollectionUtils.entries(attributes).forEach(([key, value]) => {
      const ariaKey = ARIA_ATTRIBUTES[key as keyof typeof ARIA_ATTRIBUTES];
      if (value === null) {
        element.removeAttribute(ariaKey);
      } else if (value !== undefined) {
        element.setAttribute(ariaKey, value);
      }
    });
  }

  /**
   * Create SVG element
   */
  static createSVG(path: string, options: SVGOptions = {}): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    const svgAttributes: Record<string, string> = {
      width: String(options.width ?? 24),
      height: String(options.height ?? 24),
      viewBox: options.viewBox ?? '0 0 24 24',
      fill: options.fill ?? 'none',
      stroke: options.stroke ?? 'currentColor',
    };

    if (typeof options.part === 'string') {
      svgAttributes['part'] = options.part;
    }

    CollectionUtils.entries(svgAttributes).forEach(([key, value]) => {
      svg.setAttribute(key, value);
    });

    svg.innerHTML = path;
    return svg;
  }

  /**
   * Create icon element
   */
  static createIcon(svg: string, options: IconOptions = {}): HTMLElement {
    const iconOptions: ElementOptions<'span'> = {
      html: svg,
    };

    if (typeof options.part === 'string') {
      iconOptions.part = options.part;
    }

    const icon = this.createElement('span', iconOptions);

    if (options.size) {
      icon.style.width = `${options.size}px`;
      icon.style.height = `${options.size}px`;
    }

    if (options.className) {
      icon.className = options.className;
    }

    return icon;
  }

  /**
   * Add event listeners
   */
  static addEventListeners<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    listeners: Partial<Record<K, (event: HTMLElementEventMap[K]) => void>>
  ): void {
    CollectionUtils.entries(listeners).forEach(([event, handler]) => {
      element.addEventListener(event as K, handler as EventListener);
    });
  }

  /**
   * Remove event listeners
   */
  static removeEventListeners<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    listeners: Partial<Record<K, (event: HTMLElementEventMap[K]) => void>>
  ): void {
    CollectionUtils.entries(listeners).forEach(([event, handler]) => {
      element.removeEventListener(event as K, handler as EventListener);
    });
  }

  /**
   * Create style element
   */
  static createStyle(css: string): HTMLStyleElement {
    const styleOptions: ElementOptions<'style'> = {
      text: css,
    };
    return this.createElement('style', styleOptions);
  }

  /**
   * Create template element
   */
  static createTemplate(html: string): HTMLTemplateElement {
    const templateOptions: ElementOptions<'template'> = {
      html,
    };
    return this.createElement('template', templateOptions);
  }
}
