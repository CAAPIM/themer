/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import {
  createThemer,
  arrayHasFunction,
  resolveArray,
  resolveValue,
  combineByAttributes,
  applyVariantsProps,
  mapThemeProps,
} from '../../src/utils';

describe('utils', () => {
  describe('createThemer', () => {
    it('should be a funciton', () => {
      expect(typeof createThemer).toBe('function');
    });
  });

  describe('arrayHasFunction', () => {
    it('should be a funciton', () => {
      expect(typeof arrayHasFunction).toBe('function');
    });
  });

  describe('resolveArray', () => {
    it('should be a funciton', () => {
      expect(typeof resolveArray).toBe('function');
    });
    it('should resolve to item if not a function', () => {
      expect(resolveArray('test-item-to-resolve')).toBe('test-item-to-resolve');
    });
    it('should skip item in array if falsy', () => {
      expect(resolveArray(['test', null, (val) => `${val}-item`])).toBe('test-item');
    });
  });

  describe('resolveValue', () => {
    it('should be a funciton', () => {
      expect(typeof resolveValue).toBe('function');
    });
  });

  describe('combineByAttributes', () => {
    it('should return an empty object if no argument is passed', () => {
      const combinedObj = combineByAttributes();
      expect(combinedObj).toEqual({});
    });
  });

  describe('applyVariantsProps', () => {
    it('should be a funciton', () => {
      expect(typeof applyVariantsProps).toBe('function');
    });
    it('should map simple variants to root class', () => {
      const testResolvedTheme = { styles: { root: 'root-class-123', test: 'test-123' }, variants: { test: true } };
      const testProps = { content: 'Hello', test: true };
      const mappedProps = {
        content: 'Hello',
        theme: { styles: { root: 'root-class-123 test-123', test: 'test-123' }, variants: { test: true } },
      };
      expect(applyVariantsProps(testProps, testResolvedTheme)).toEqual(mappedProps);
    });
    it('should not map variants if class does not exist', () => {
      const testResolvedTheme = { styles: { root: 'root-class-123' }, variants: { test: true } };
      const testProps = { content: 'Hello', test: true };
      const mappedProps = {
        content: 'Hello',
        theme: { styles: { root: 'root-class-123' }, variants: {} },
      };
      expect(applyVariantsProps(testProps, testResolvedTheme)).toEqual(mappedProps);
    });
    it('should map complex variants to root class', () => {
      const testResolvedTheme = {
        styles: { root: 'root-class-123', test: 'test-123' },
        variants: {
          test: { prop1: 'prop1Value', prop2: true },
        },
      };
      const testProps = { content: 'Hello', prop1: 'prop1Value', prop2: true };
      const mappedProps = {
        content: 'Hello',
        theme: { styles: { root: 'root-class-123 test-123', test: 'test-123' }, variants: { test: true } },
      };
      expect(applyVariantsProps(testProps, testResolvedTheme)).toEqual(mappedProps);
    });
    it('should not map complex variants if not all prop-checks pass', () => {
      const testResolvedTheme = {
        styles: { root: 'root-class-123', test: 'test-123' },
        variants: {
          test: { prop1: 'prop1Value', prop2: true },
        },
      };
      const testProps = { content: 'Hello', prop1: 'prop1Value' };
      const mappedProps = {
        content: 'Hello',
        theme: { styles: { root: 'root-class-123', test: 'test-123' }, variants: {} },
      };
      expect(applyVariantsProps(testProps, testResolvedTheme)).toEqual(mappedProps);
    });
  });

  describe('mapThemeProps', () => {
    it('should be a funciton', () => {
      expect(typeof mapThemeProps).toBe('function');
    });

    it('should map theme prop', () => {
      const testResolvedTheme = { styles: { root: 'root-class-123' } };
      const testProps = { content: 'Hello' };
      const mappedProps = mapThemeProps(testProps, testResolvedTheme);
      expect(mappedProps).toEqual({ ...testProps, theme: testResolvedTheme });
    });

    it('should map variants props, if defined', () => {
      const testResolvedTheme = { styles: { root: 'root-class-123', test: 'test-123' }, variants: { test: true } };
      const testProps = { content: 'Hello', test: true };
      const mappedProps = mapThemeProps(testProps, testResolvedTheme);
      expect(mappedProps).toEqual({
        content: 'Hello',
        theme: { styles: { root: 'root-class-123 test-123', test: 'test-123' }, variants: { test: true } },
      });
    });
  });
});
