/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

// @flow

import Themer from '../src/Themer';
import {
  testThemeSimple,
  snippet,
} from './fixtures';

describe('Themer', () => {
  it('should run the middleware functions when resolving attributes', () => {
    const spy1 = jest.fn().mockImplementation((component) => component);
    const spy2 = jest.fn().mockImplementation((component) => component);
    const testInstance = new Themer();
    testInstance.setMiddleware(spy1, spy2);
    testInstance.resolveAttributes(snippet, [testThemeSimple]);

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});
