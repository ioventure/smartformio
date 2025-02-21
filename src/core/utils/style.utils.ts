/**
 * @file Style utility functions
 */

import { COMPONENT_PARTS } from '@core/constants/component.constants';
import { CollectionUtils } from './collection.utils';

type CSSProperties = Partial<CSSStyleDeclaration>;

interface StyleOptions {
  prefix?: string;
  suffix?: string;
  important?: boolean;
}

interface ComponentStyles {
  root?: CSSProperties;
  [key: string]: CSSProperties | undefined;
}

export class StyleUtils {
  /**
   * Convert camelCase to kebab-case
   */
  static toKebabCase(str: string): string {
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
      .toLowerCase();
  }

  /**
   * Convert object of styles to CSS string
   */
  static toCSS(styles: CSSProperties, options: StyleOptions = {}): string {
    const cssEntries = CollectionUtils.entries(styles as Record<string, string>)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        const property = this.toKebabCase(key);
        const important = options.important ? ' !important' : '';
        return `${property}: ${value}${important};`;
      });

    return cssEntries.join('\n');
  }

  /**
   * Create CSS rule
   */
  static createRule(selector: string, styles: CSSProperties, options: StyleOptions = {}): string {
    const prefix = options.prefix || '';
    const suffix = options.suffix || '';
    const css = this.toCSS(styles, options);
    return css ? `${prefix}${selector}${suffix} {\n${css}\n}` : '';
  }

  /**
   * Create component styles
   */
  static createComponentStyles(name: string, styles: ComponentStyles): string {
    const rules: string[] = [];

    // Base styles
    if (styles['root']) {
      rules.push(this.createRule(':host', styles['root']));
    }

    // Part styles
    CollectionUtils.entries(styles).forEach(([part, css]) => {
      if (part === 'root' || !css) return;
      rules.push(this.createRule(`[part~="${part}"]`, css));
    });

    // State styles
    CollectionUtils.entries(COMPONENT_PARTS.states).forEach(([state, className]) => {
      const stateStyles = styles[state];
      if (stateStyles) {
        rules.push(this.createRule(`:host(.${className})`, stateStyles));
        rules.push(this.createRule(`[part~="${className}"]`, stateStyles));
      }
    });

    return rules.join('\n\n');
  }

  /**
   * Create theme styles
   */
  static createThemeStyles(theme: Record<string, string | number>): string {
    const properties = CollectionUtils.entries(theme).map(([key, value]) => {
      const property = this.toKebabCase(key);
      return `--${property}: ${value};`;
    });

    return `:host {\n${properties.join('\n')}\n}`;
  }

  /**
   * Create keyframe animation
   */
  static createKeyframes(name: string, frames: Record<string, CSSProperties>): string {
    const rules = CollectionUtils.entries(frames)
      .map(([key, styles]) => this.createRule(key, styles))
      .join('\n\n');

    return `@keyframes ${name} {\n${rules}\n}`;
  }

  /**
   * Create media query
   */
  static createMediaQuery(query: string, styles: Record<string, CSSProperties>): string {
    const rules = CollectionUtils.entries(styles)
      .map(([selector, css]) => this.createRule(selector, css))
      .join('\n\n');

    return `@media ${query} {\n${rules}\n}`;
  }

  /**
   * Create CSS custom property
   */
  static createCustomProperty(
    name: string,
    value: string | number,
    options: StyleOptions = {}
  ): string {
    const property = this.toKebabCase(name);
    const important = options.important ? ' !important' : '';
    return `--${property}: ${value}${important};`;
  }

  /**
   * Get CSS custom property value
   */
  static getCustomProperty(name: string): string {
    const property = this.toKebabCase(name);
    return `var(--${property})`;
  }

  /**
   * Create focus styles
   */
  static createFocusStyles(
    options: {
      outlineWidth?: string;
      outlineColor?: string;
      outlineOffset?: string;
      outlineStyle?: string;
    } = {}
  ): CSSProperties {
    const defaultStyles = {
      outline: 'none',
      outlineWidth: '2px',
      outlineColor: 'var(--focus-color, #007bff)',
      outlineOffset: '2px',
      outlineStyle: 'solid',
    } as CSSProperties;

    return CollectionUtils.deepMerge(defaultStyles, options);
  }

  /**
   * Create disabled styles
   */
  static createDisabledStyles(
    options: {
      opacity?: string;
      cursor?: string;
    } = {}
  ): CSSProperties {
    const defaultStyles = {
      opacity: '0.6',
      cursor: 'not-allowed',
      pointerEvents: 'none',
    } as CSSProperties;

    return CollectionUtils.deepMerge(defaultStyles, options);
  }

  /**
   * Create transition
   */
  static createTransition(
    properties: string[],
    options: {
      duration?: string;
      timingFunction?: string;
      delay?: string;
    } = {}
  ): string {
    const duration = options.duration || '200ms';
    const timingFunction = options.timingFunction || 'ease';
    const delay = options.delay || '0ms';

    return properties.map((prop) => `${prop} ${duration} ${timingFunction} ${delay}`).join(', ');
  }

  /**
   * Create box shadow
   */
  static createBoxShadow(
    layers: Array<{
      x?: string;
      y?: string;
      blur?: string;
      spread?: string;
      color?: string;
      inset?: boolean;
    }>
  ): string {
    return layers
      .map((layer) => {
        const x = layer.x || '0';
        const y = layer.y || '0';
        const blur = layer.blur || '0';
        const spread = layer.spread || '0';
        const color = layer.color || 'rgba(0, 0, 0, 0.1)';
        const inset = layer.inset ? 'inset ' : '';
        return `${inset}${x} ${y} ${blur} ${spread} ${color}`;
      })
      .join(', ');
  }
}
