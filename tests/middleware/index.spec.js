/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { create } from '../../src';

describe('middleware', () => {
  it('should accept middleware functions in the constructor options', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();

    const testInstance = create({ middleware: [spy1, spy2] });
    expect(testInstance.getMiddleware()).toHaveLength(2);
  });

  it('should provide a setter method to set middleware', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();

    const testInstance = create();
    testInstance.setMiddleware(spy1, spy2);

    expect(testInstance.getMiddleware()).toHaveLength(2);
  });
});
