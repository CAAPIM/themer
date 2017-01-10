/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { flowRight } from 'lodash';

export default class Middleware {

  /**
   * Creates a new Middleware instance
   *
   * @param {Array}  middleware middleware functions to run
   */
  constructor(middleware = []) {
    this.registry = [];

    middleware.forEach(func => this.set(func));
  }

  /**
   * Returns the middleware registry array
   *
   * @return {Array} Collections of middleware functions
   */
  get() {
    return this.registry;
  }

  /**
   * Register middleware. Passed function will be invoked
   *
   * @param {Function[]} func
   */
  set(...middlewares) {
    middlewares.forEach(func => this.registry.push(func));
  }

  /**
   * Executes all of the methods in the middleware registry. Middleware methods
   * expect the snippet and them.styles to be passed in as properties
   *
   * @param  {Function} snippet Function that returns valid HTML markup
   * @param  {Object}   styles  Executes all middleware function on snippet
   * @return {Function}         Resolved results of all middleware methods
   */
  resolve(snippet, styles) {
    return flowRight(this.registry)(snippet, styles);
  }

}
