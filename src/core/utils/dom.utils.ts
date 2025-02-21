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

interface PartOptions {
  add?: string[];
  remove?: string[];
  set?: string;
}

export class DOMUtils {
  /**
   * Create element with attributes and properties
   */
  static createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    options: ElementOptions<K> = {}
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);
    const safeOptions = CollectionUtils.deepClone(options);

    // Set attributes
    if (safeOptions.attributes) {
      CollectionUtils.entries(safeOptions.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    // Set properties
    if (safeOptions.properties) {
      Object.assign(element, safeOptions.properties);
    }

    // Set part
    if (typeof safeOptions.part === 'string') {
      element.setAttribute('part', safeOptions.part);
    }

    // Set innerHTML
    if (safeOptions.html) {
      element.innerHTML = safeOptions.html;
    }

    // Set textContent
    if (safeOptions.text !== undefined) {
      element.textContent = String(safeOptions.text);
    }

    // Append children
    if (safeOptions.children) {
      safeOptions.children.forEach((child) => {
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
    const safeOptions = CollectionUtils.deepClone(options);

    // Handle direct set
    if (typeof safeOptions.set === 'string') {
      element.setAttribute('part', safeOptions.set);
      return;
    }

    // Get current parts
    const currentParts = (element.getAttribute('part') || '').split(' ').filter(Boolean);
    const parts = [...currentParts];

    // Remove parts if specified
    if (Array.isArray(safeOptions.remove) && safeOptions.remove.length > 0) {
      const removeSet = new Set(safeOptions.remove);
      const filteredParts = parts.filter((part) => !removeSet.has(part));
      parts.length = 0;
      parts.push(...filteredParts);
    }

    // Add parts if specified
    if (Array.isArray(safeOptions.add) && safeOptions.add.length > 0) {
      parts.push(...safeOptions.add);
    }

    // Update attribute with unique parts
    if (parts.length > 0) {
      element.setAttribute('part', CollectionUtils.unique(parts).join(' '));
    } else {
      element.removeAttribute('part');
    }
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
    const safeOptions = CollectionUtils.deepClone(options);

    const svgAttributes = {
      width: String(safeOptions.width ?? 24),
      height: String(safeOptions.height ?? 24),
      viewBox: safeOptions.viewBox ?? '0 0 24 24',
      fill: safeOptions.fill ?? 'none',
      stroke: safeOptions.stroke ?? 'currentColor',
      ...(typeof safeOptions.part === 'string' ? { part: safeOptions.part } : {}),
    };

    CollectionUtils.entries(svgAttributes).forEach(([key, value]) => {
      svg.setAttribute(key, value || '');
    });

    svg.innerHTML = path;
    return svg;
  }

  /**
   * Create icon element
   */
  static createIcon(svg: string, options: IconOptions = {}): HTMLElement {
    const safeOptions = CollectionUtils.deepClone(options);
    const icon = this.createElement('span', { html: svg });

    if (typeof safeOptions.part === 'string') {
      icon.setAttribute('part', safeOptions.part);
    }

    if (typeof safeOptions.size === 'number') {
      icon.style.width = `${safeOptions.size}px`;
      icon.style.height = `${safeOptions.size}px`;
    }

    if (typeof safeOptions.className === 'string') {
      icon.className = safeOptions.className;
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
    return this.createElement('style', { text: css });
  }

  /**
   * Create template element
   */
  static createTemplate(html: string): HTMLTemplateElement {
    return this.createElement('template', { html });
  }
}
