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
  });

  describe('mapThemeProps', () => {
    it('should be a funciton', () => {
      expect(typeof mapThemeProps).toBe('function');
    });
  });
});
