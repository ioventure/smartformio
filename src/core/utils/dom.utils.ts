/**
 * @file DOM utility functions
 */

import { ARIA_ATTRIBUTES } from '@core/constants/component.constants';

interface ElementOptions<K extends keyof HTMLElementTagNameMap> {
  attributes?: Record<string, string>;
  properties?: Partial<HTMLElementTagNameMap[K]>;
  part?: string | undefined;
  children?: (string | Node)[];
  html?: string | undefined;
  text?: string | undefined;
}

interface IconOptions {
  part?: string | undefined;
  size?: number | undefined;
  className?: string | undefined;
}

interface SVGOptions {
  width?: number | undefined;
  height?: number | undefined;
  viewBox?: string | undefined;
  fill?: string | undefined;
  stroke?: string | undefined;
  part?: string | undefined;
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

    // Set attributes
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    // Set properties
    if (options.properties) {
      Object.assign(element, options.properties);
    }

    // Set part
    if (options.part !== undefined) {
      element.setAttribute('part', options.part);
    }

    // Set innerHTML
    if (options.html !== undefined) {
      element.innerHTML = options.html;
    }

    // Set textContent
    if (options.text !== undefined) {
      element.textContent = options.text;
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
    Object.entries(attributes).forEach(([key, value]) => {
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
  static updatePart(
    element: Element,
    options: {
      add?: string[];
      remove?: string[];
      set?: string;
    }
  ): void {
    if (options.set !== undefined) {
      element.setAttribute('part', options.set);
      return;
    }

    const parts = new Set((element.getAttribute('part') || '').split(' ').filter(Boolean));

    if (options.remove) {
      options.remove.forEach((part) => parts.delete(part));
    }

    if (options.add) {
      options.add.forEach((part) => parts.add(part));
    }

    element.setAttribute('part', Array.from(parts).join(' '));
  }

  /**
   * Set ARIA attributes
   */
  static setARIA(
    element: Element,
    attributes: Partial<Record<keyof typeof ARIA_ATTRIBUTES, string | null>>
  ): void {
    Object.entries(attributes).forEach(([key, value]) => {
      const ariaKey = ARIA_ATTRIBUTES[key as keyof typeof ARIA_ATTRIBUTES];
      if (value === null) {
        element.removeAttribute(ariaKey);
      } else {
        element.setAttribute(ariaKey, value);
      }
    });
  }

  /**
   * Create SVG element
   */
  static createSVG(path: string, options: SVGOptions = {}): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    svg.setAttribute('width', String(options.width ?? 24));
    svg.setAttribute('height', String(options.height ?? 24));
    svg.setAttribute('viewBox', options.viewBox ?? '0 0 24 24');
    svg.setAttribute('fill', options.fill ?? 'none');
    svg.setAttribute('stroke', options.stroke ?? 'currentColor');

    if (options.part !== undefined) {
      svg.setAttribute('part', options.part);
    }

    svg.innerHTML = path;
    return svg;
  }

  /**
   * Create icon element
   */
  static createIcon(svg: string, options: IconOptions = {}): HTMLElement {
    const icon = this.createElement('span', {
      html: svg,
    });

    if (options.part !== undefined) {
      icon.setAttribute('part', options.part);
    }

    if (options.size !== undefined) {
      icon.style.width = `${options.size}px`;
      icon.style.height = `${options.size}px`;
    }

    if (options.className !== undefined) {
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
    Object.entries(listeners).forEach(([event, handler]) => {
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
    Object.entries(listeners).forEach(([event, handler]) => {
      element.removeEventListener(event as K, handler as EventListener);
    });
  }

  /**
   * Create style element
   */
  static createStyle(css: string): HTMLStyleElement {
    return this.createElement('style', {
      text: css,
    });
  }

  /**
   * Create template element
   */
  static createTemplate(html: string): HTMLTemplateElement {
    return this.createElement('template', {
      html,
    });
  }
}
