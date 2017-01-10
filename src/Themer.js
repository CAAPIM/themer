/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import uuid from 'uuid';
import Middleware from './middleware';
import Theme from './theme';

export default class Themer {

  /**
   * Creates a new Themer instance
   *
   * @param {Options} options Themer options
   */
  constructor(options = {}) {
    this.id = uuid();
    this.options = options;
    this.middleware = new Middleware(this.options.middleware);
    this.theme = new Theme(this.options.themes);
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
  setMiddleware(...middlewares) {
    this.middleware.set(...middlewares);
    return this;
  }

  /**
   * Return the current themes unique ID
   *
   * @return {uuid}
   */
  getThemeId() {
    return this.theme.get().id;
  }

  /**
   * Returns a flattened variables object based on the global and local variables passed in.
   * The flattened object will give priority to local variable definitions if they conflict
   * with global vars.
   *
   * @param  {Object} variables Variables defined by the gloval application theme
   * @return {Object}           Resolved theme variables, where local vars take priority
   */
  getThemeVariables(variables = {}) {
    return this.theme.getVariables(variables);
  }

  /**
   * Returns a flattened styles object based on the raw theme and vars that were passed in
   *
   * @param  {Object} variables The resolved local theme variables
   * @return {Object}           Resolved styles object
   */
  getThemeStyles(variables = {}) {
    return this.theme.getStyles(variables);
  }

  /**
   * Register themes to be resolved
   *
   * @param  {Array} themes Themes to resolve
   * @return {Themer}
   */
  setTheme(themes = []) {
    this.theme = new Theme(themes);
    return this;
  }

  /**
   * Executes all of the methods in the middleware registry. Middleware methods
   * expect the snippet and them.styles to be passed in as properties
   *
   * @param  {Function} snippet Function that returns valid HTML markup
   * @return {Function}         Resolved results of all middleware methods
   */
  resolveMiddleware(snippet) {
    return this.middleware.resolve(snippet, this.theme.getStyles());
  }

  /**
   * Resolves all theme properties and middlewares
   *
   * @param  {Function} snippet Function that returns valid HTML markup
   * @param  {array} themes  Array of themes
   * @return {Object}         Resolved theme and snippet attrs
   */
  resolveAttributes(snippet, themes) {
    const theme = new Theme(themes);
    const variables = theme.getVariables();
    const styles = theme.getStyles(variables);
    const resolvedSnippet = this.middleware.resolve(snippet, styles);

    return {
      snippet: resolvedSnippet,
      theme: {
        variables,
        styles,
      },
    };
  }

  /**
   * Returns a snippet of HTML with a computed theme object passed into it
   *
   * @param  {Function} snippet Function that returns valid HTML markup
   * @param  {Object}   props   Any non-theme props to render into the snippet
   * @return {Object}           The rendered HTML with appended styles
   */
  render(snippet, props = {}) {
    return this.resolveMiddleware(snippet)(Object.assign(props, {
      styles: this.theme.getStyles(),
    }));
  }

}
