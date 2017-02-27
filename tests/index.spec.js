/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import themerDecorator, { create, themer as themerInstance } from '../src';
import Themer from '../src/Themer';
import { testThemeSimple, snippet } from './fixtures';

describe('exports', () => {
  describe('default', () => {
    it('should export the themer decorator', () => {
      const result = themerDecorator(testThemeSimple)(snippet)({ content: 'Hello' });
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

    it('should allow for the creation of multiple independent Themer instances', () => {
      const testInstance1 = create();
      const testInstance2 = create();

      const mockMiddleware = jest.fn().mockImplementation(component => component);
      testInstance1.setMiddleware(mockMiddleware);

      testInstance1.resolveAttributes(snippet, [testThemeSimple]);
      testInstance2.resolveAttributes(snippet, [testThemeSimple]);

      expect(mockMiddleware).toHaveBeenCalledTimes(1);
    });
  });
});
