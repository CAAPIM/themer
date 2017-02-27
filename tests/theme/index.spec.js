/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import Theme from '../../src/theme';
import { testThemeSimple, testThemeVariants } from '../fixtures';

describe('theme', () => {
  it('should provide a getter method for unresolved theme, theme id and resolve function', () => {
    const theme = new Theme([testThemeSimple]);

    expect(typeof theme.getId).toBe('function');
    expect(typeof theme.resolve).toBe('function');
    expect(typeof theme.get).toBe('function');
  });

  it('should provide a getter for the unresolved theme object', () => {
    const theme = new Theme([testThemeSimple]);

    expect(theme.get().styles).toEqual(testThemeSimple.styles);
  });

  it('should provide a getter for the theme id', () => {
    const theme = new Theme([testThemeSimple]);

    const themeId = theme.getId();
    expect(typeof themeId).toBe('string');
    expect(themeId).not.toBe('');
    expect(themeId).toBeTruthy();
  });

  it('accepts a non keyed array of theme attributes and adds styles key', () => {
    const nonKeyedTheme = { test: 'test' };
    const theme = new Theme([nonKeyedTheme]);
    const resolvedTheme = theme.resolve();

    expect(typeof theme.getId).toBe('function');
    expect(typeof theme.resolve).toBe('function');
    expect(resolvedTheme.styles).toEqual(nonKeyedTheme);
    expect(resolvedTheme.variables).toEqual({});
    expect(resolvedTheme.variants).toEqual({});
  });

  it('will use theme1.styles if theme2.styles does not exist', () => {
    const theme = new Theme([testThemeSimple, {}]);
    const resolvedTheme = theme.resolve();

    expect(resolvedTheme.styles).toEqual(testThemeSimple.styles);
  });

  it('should throw an error if theme is not an object or function', () => {
    expect(() => new Theme([1])).toThrow();
  });

  it('should return an object of variants if supplied', () => {
    const theme = new Theme([testThemeVariants]);
    const resolvedTheme = theme.resolve();
    expect(resolvedTheme.variants).toEqual(testThemeVariants.variants);
  });

  it('should accept styles, variables and variants as functions', () => {
    const testFunctionTheme = {
      styles: () => ({ test: 'test' }),
      variables: () => ({ color: 'red' }),
      variants: () => ({ variant1: 'test' }),
    };

    const theme = new Theme([testFunctionTheme]);
    const resolvedTheme = theme.resolve();
    expect(resolvedTheme.styles).toEqual(testFunctionTheme.styles());
    expect(resolvedTheme.variables).toEqual(testFunctionTheme.variables());
    expect(resolvedTheme.variants).toEqual(testFunctionTheme.variants());
  });

  it('should use global variables when resolving theme variables and styles', () => {
    const testFunctionTheme = {
      styles: (_, vars) => ({ test: { color: vars.color } }),
      variables: (_, globalVars) => ({ color: globalVars.color || 'red' }),
    };

    const globalVars = { color: 'blue' };

    const theme = new Theme([testFunctionTheme]);
    const resolvedTheme = theme.resolve(globalVars);

    expect(typeof resolvedTheme).toBe('object');
    expect(resolvedTheme.styles).toEqual(
      testFunctionTheme.styles(null, globalVars)
    );
  });

  describe('combine', () => {
    it('should return an empty object if no argument is passed', () => {
      const combinedTheme = Theme.combine();
      expect(combinedTheme).toEqual({});
    });
  });
});
