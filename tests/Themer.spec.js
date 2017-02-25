/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import themerDecorator, { create, themer as themerInstance } from '../src';
import Themer from '../src/Themer';

let testInstance = null;

const testTheme = {
  styles: {
    root: 'big-text-class',
    stop: 'red-black-class',
    go: 'green-grass-class',
  },
  variables: () => ({
    color: 'red',
  }),
  variants: {
    stop: false,
    go: false,
  },
};

const snippet = (props) =>
  `<h1 class="${props.styles.root}">${props.content}</h1>`;

describe('Themer', () => {
  describe('exports', () => {
    describe('default', () => {
      it('should export the result of Themer.render()', () => {
        const result = themerDecorator(snippet, testTheme)({ content: 'Hello' });
        expect(result).toBe('<h1 class="big-text-class">Hello</h1>');
      });

      it('should give access to the default instance of themer', () => {
        expect(themerInstance).toBeInstanceOf(Themer);
      });
    });

    describe('create', () => {
      it('should export create function that creates a new Themer instance', () => {
        expect(typeof create).toBe('function');
        expect(create()).toBeInstanceOf(Themer);
      });

      it('should allow for the creation of multiple Themer instances', () => {
        const testInstance1 = create();
        const testInstance2 = create();

        expect(testInstance1.id).not.toBe(testInstance2.id);
      });
    });
  });

  describe('middleware', () => {
    it('should accept middleware functions in the constructor options', () => {
      const spy1 = jest.fn();
      const spy2 = jest.fn();

      testInstance = create({ middleware: [spy1, spy2] });
      expect(testInstance.getMiddleware()).toHaveLength(2);
    });

    it('should provide a setter method to set middleware', () => {
      const spy1 = jest.fn();
      const spy2 = jest.fn();

      testInstance = create();
      testInstance.setMiddleware(spy1, spy2);

      expect(testInstance.getMiddleware()).toHaveLength(2);
    });
  });

  describe('theme', () => {
    it('should be an object', () => {
      expect(typeof themerInstance.theme).toBe('object');
    });

    it('should provide a setter method to set a theme', () => {
      testInstance = create();

      expect(typeof testInstance.setTheme).toBe('function');
    });

    it('should provide a getter methods for theme id, variables, variants, and styles', () => {
      testInstance = create({ themes: [testTheme] });

      expect(typeof testInstance.getThemeId).toBe('function');
      expect(typeof testInstance.getThemeStyles).toBe('function');
      expect(typeof testInstance.getThemeVariables).toBe('function');
      expect(typeof testInstance.getVariants).toBe('function');
    });

    it('accepts a non keyed array of theme attributes and adds styles key', () => {
      const nonKeyedTheme = { test: 'test' };
      testInstance = create({ themes: [nonKeyedTheme] });

      expect(typeof testInstance.getThemeId).toBe('function');
      expect(typeof testInstance.getThemeStyles).toBe('function');
      expect(testInstance.getThemeVariables()).toEqual({});
      expect(testInstance.getVariants()).toEqual({});
    });

    it('will use theme1.styles if theme2.styles does not exist', () => {
      testInstance = create({ themes: [testTheme, {}] });
      const resolvedStyles = testInstance.getThemeStyles();

      expect(resolvedStyles).toEqual(testTheme.styles);
    });

    it('should throw an error if theme is not an object or function', () => {
      testInstance = create();
      expect(() => testInstance.setTheme([1])).toThrow();
    });

    it('should return an object of variants if supplied', () => {
      testInstance = create({ themes: [testTheme] });
      const variantObj = testInstance.getVariants();
      const expectedResult = { stop: false, go: false };
      expect(variantObj).toEqual(expectedResult);
    });

    it('should generated a new theme object when using .setTheme() on an existing Themer', () => {
      testInstance = create({ themes: [testTheme] });
      const oldThemeId = testInstance.getThemeId();
      testInstance.setTheme([testTheme]);

      expect(testInstance.getThemeId()).not.toBe(oldThemeId);
    });

    it('should accept theme.styles and theme.variables as functions', () => {
      const testFunctionTheme = {
        styles: () => ({ test: 'test' }),
        variables: () => ({ color: 'red' }),
      };

      testInstance = create({ themes: [testFunctionTheme] });
      const renderedSnippet = testInstance.render(snippet, { content: 'Hello' });
      expect(renderedSnippet).toBe(`<h1 class="${testFunctionTheme.styles().root}">Hello</h1>`);
    });

    it('should return the resolved snippet and theme attributes', () => {
      testInstance = create();
      const resolvedAttrs = testInstance.resolveAttributes(snippet, [testTheme]);

      expect(typeof resolvedAttrs).toBe('object');
      expect(resolvedAttrs.theme).toBeTruthy();
      expect(resolvedAttrs.snippet).toBeTruthy();
    });

    it('should use global variables when resolving theme variables and styles', () => {
      const testFunctionTheme = {
        styles: (_, vars) => ({ test: { color: vars.color } }),
        variables: (_, globalVars) => ({ color: globalVars.color || 'red' }),
      };

      const globalTheme = {
        variables: {
          color: 'blue',
        },
      };

      testInstance = create();
      const resolvedAttrs = testInstance.resolveAttributes(
        snippet, [testFunctionTheme], globalTheme.variables);

      expect(typeof resolvedAttrs).toBe('object');
      expect(resolvedAttrs.theme).toBeTruthy();
      expect(resolvedAttrs.snippet).toBeTruthy();
      expect(resolvedAttrs.theme.styles).toEqual(
        testFunctionTheme.styles(null, globalTheme.variables)
      );
    });
  });

  it('should accept theme.styles as a function', () => {
    const testFuncTheme = {
      styles: () => ({ color: 'red' }),
    };

    testInstance = create({ themes: [testFuncTheme] });
    const resolvedStyles = testInstance.getThemeStyles();

    expect(resolvedStyles).toEqual(testFuncTheme.styles());
  });

  describe('render', () => {
    it('should provide the rendered HTML snippet with styles resolved and mapped', () => {
      testInstance = create({ themes: [testTheme] });
      const renderedSnippet = testInstance.render(snippet, { content: 'Hello' });

      expect(renderedSnippet).toBe('<h1 class="big-text-class">Hello</h1>');
    });

    it('should provide the rendered HTML snippet with styles resolved and mapped with variant support', () => {
      testInstance = create({ themes: [testTheme] });
      const renderedSnippet = testInstance.render(snippet, { content: 'Hello', stop: true, go: true });

      expect(renderedSnippet).toBe('<h1 class="big-text-class red-black-class green-grass-class">Hello</h1>');
    });

    it('should run the middleware functions before render', () => {
      const spy1 = jest.fn().mockImplementation((component) => component);
      const spy2 = jest.fn().mockImplementation((component) => component);
      testInstance = create({ themes: [testTheme], middleware: [spy1, spy2] });
      testInstance.render(snippet);

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });
});
