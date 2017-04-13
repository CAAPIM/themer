/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

// @flow

import { create, mapThemeProps } from '../../src';
import { createDecorator } from '../../src/decorator';
import {
  testThemeSimple,
  testThemeVariants,
  snippet,
} from '../fixtures';

const themerDecorator = createDecorator();

describe('decorator', () => {
  it('should return a decorated snippet that receives styles as props', () => {
    const decoratedSnippet = themerDecorator(testThemeSimple)(snippet);
    const testProps = { content: 'Hello' };
    expect(decoratedSnippet(testProps)).toBe('<h1 class="big-text-class">Hello</h1>');
  });

  it('should allow to decorate multiple components', () => {
    const testTheme1 = { styles: { root: 'test-1' } };
    const testTheme2 = { styles: { root: 'test-2' } };
    const decoratedSnippet1 = themerDecorator(testTheme1)(snippet);
    const decoratedSnippet2 = themerDecorator(testTheme2)(snippet);
    const testProps = { content: 'Hello' };
    expect(decoratedSnippet1(testProps)).toBe('<h1 class="test-1">Hello</h1>');
    expect(decoratedSnippet2(testProps)).toBe('<h1 class="test-2">Hello</h1>');
  });

  it('should provide the rendered attibutes with styles resolved and mapped with variant support', () => {
    const decoratedSnippet = themerDecorator(testThemeVariants)(snippet);
    const testProps = { content: 'Hello', stop: true, go: true };
    expect(decoratedSnippet(testProps)).toBe('<h1 class="big-text-class red-black-class green-grass-class">Hello</h1>');
  });

  it('should should apply variants after middlewares are resolved', () => {
    const testTheme = { styles: { root: 'root-123', test: 'test-123' } };
    const customThemer = create();

    const testMiddleware = (middlewareSnippet, middlewareTheme) => {
      const mappedTheme = { ...middlewareTheme, variants: { test: true } };
      return (props) => middlewareSnippet(mapThemeProps(props, mappedTheme));
    };

    customThemer.setMiddleware(testMiddleware);
    const customThemerDecorator = createDecorator(customThemer);
    const decoratedSnippet = customThemerDecorator(testTheme)(snippet);
    const testProps = { content: 'Hello', test: true };
    expect(decoratedSnippet(testProps)).toBe('<h1 class="root-123 test-123">Hello</h1>');
  });
});
