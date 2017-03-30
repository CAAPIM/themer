/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

// @flow

import uuid from 'uuid';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import {
  resolveValue,
  combineByAttributes,
} from './../utils';

export default class Theme {

  /**
   * Creates a new Theme instance
   */
  constructor(themes) {
    this.theme = {};

    this.setup(themes);
  }

  /**
   * Run setup actions
   *
   * @param  {Array} themes Themes collection passed as constructor prop
   * @return {Theme}
   */
  setup(themes) {
    if (themes && themes.length) {
      this.theme = Theme.combine(themes);
    }

    return this;
  }

  /**
   * Returns the unresolved theme object
   *
   * @return {Object} this.theme object
   */
  get() {
    return this.theme;
  }

  /**
   * Validates that a theme object exists and is of the expected types
   *
   * @param  {*}     theme The theme object
   * @throws {Error}       If the theme object does not exist or is of wrong type
   */
  static validate(theme) {
    if (!isPlainObject(theme) && !isFunction(theme)) {
      throw new Error('Theme must either an object or function');
    }

    return true;
  }


  /**
   * Validates and parses a theme object and extracts
   * styles and variable properties if they exist
   *
   * @param  {Object} theme The theme object
   * @return {*}            The validated theme object
   * @throws {Error}        If the theme object has not been passed in
   * @public
   */
  static parse(theme) {
    Theme.validate(theme);

    if (theme.styles || theme.variables) {
      return theme;
    }

    return {
      styles: theme,
    };
  }

  /**
   * Accepts any number of theme objects. Validates that they're of the expected
   * schema type and formats the style and variable objects if they exist.
   *
   * @param  {Array} themes Array of theme objects
   * @return {Array}        Array of combined and formatted theme objects
   */
  static combine(themes) {
    if (!themes || !themes.length) {
      return {};
    }

    const truthy = val => val;

    const resolvedTheme = themes
      .map(Theme.parse)
      .filter(truthy)
      .reduce((previousTheme, currentTheme) => ({
        styles: combineByAttributes('styles', previousTheme, currentTheme),
        variables: combineByAttributes('variables', previousTheme, currentTheme),
        variants: combineByAttributes('variants', previousTheme, currentTheme),
      }), {});

    resolvedTheme.id = uuid();

    return resolvedTheme;
  }

  /**
   * Returns the current themes ID property
   *
   * @return {uuid} Current themes unique ID
   */
  getId() {
    return this.theme.id;
  }

  resolve(globalVars) {
    const variables = resolveValue(this.theme.variables, globalVars);
    const styles = resolveValue(this.theme.styles, variables);
    const variants = resolveValue(this.theme.variants);
    return {
      variables,
      styles,
      variants,
    };
  }
}
