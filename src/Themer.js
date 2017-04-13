/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

// @flow

import Middleware from './middleware';
import Theme from './theme';

type Options = {
  middleware?: Array<Function>,
};

export default class Themer {

  /**
   * Themer options
   * @type {Options}
   */
  options: Options;

  /**
   * Themer middleware
   * @type {Middleware}
   */
  middleware: Middleware;

  /**
   * Creates a new Themer instance
   *
   * @param {Options} options Themer options
   */
  constructor(options?: Options = {}) {
    this.options = options;
    this.middleware = new Middleware(this.options.middleware);
  }

  /**
   * Return all registered middleware
   *
   * @return {Array} Collections of middleware functions
   */
  getMiddleware() {
    return this.middleware.get();
  }

  /**
   * Register middleware. Passed function will be invoked.
   *
   * @param  {Function} func Function to invoke
   * @return {Themer}
   */
  setMiddleware(...middlewares: Array<Function>) {
    this.middleware.set(...middlewares);
    return this;
  }

  /**
   * Resolves all theme properties and middlewares
   *
   * @param  {any} snippet to be decorated
   * @param  {array} themes  Array of themes
   * @param  {object} globalVars  global variables to use when resolving theme variables
   * @return {Object}         Resolved theme and snippet attrs
   */
  resolveAttributes(snippet: any, themes: Array<Object>, globalVars?: Object) {
    const theme = new Theme(themes);
    const resolvedTheme = theme.resolve(globalVars);
    const resolvedSnippet = this.middleware.resolve(snippet, resolvedTheme);
    return {
      snippet: resolvedSnippet,
      theme: resolvedTheme,
    };
  }
}
