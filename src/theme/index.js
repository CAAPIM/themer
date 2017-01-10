/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import uuid from 'uuid';
import objectAssign from 'object-assign';
import { isObject, isFunction } from 'lodash';
import { arrayHasFunction, resolve } from './../utils';

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
      this.theme = this.combine(themes);
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
    if (!isObject(theme) && !isFunction(theme)) {
      throw new Error('Theme must either an object or function');
    }

    return true;
  }

  /**
   * Accepts two theme objects and an attribute they should have in common.
   * If both objects contain the attribute, move the attribute value from
   * both themes into a single array.
   *
   * @param  {String} attr   The attribute theme1 and theme2 should both contain
   * @param  {Object} theme1 The first theme object
   * @param  {Object} theme2 The second theme object
   * @return {Array}         Array containing both attribute value from both themes
   * @public
   */
  static combineByAttributes(attr, theme1 = {}, theme2 = {}) {
    if (!theme1[attr] && !theme2[attr]) {
      return {};
    }

    if (theme1[attr] && !theme2[attr]) {
      return theme1[attr];
    }

    if (!theme1[attr] && theme2[attr]) {
      return theme2[attr];
    }

    return objectAssign(theme2[attr], theme1[attr]);
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
  combine(themes = []) {
    const truthy = val => val;

    const resolvedTheme = themes
      .map(Theme.parse)
      .filter(truthy)
      .reduce((previousTheme, currentTheme) => ({
        styles: Theme.combineByAttributes('styles', previousTheme, currentTheme),
        variables: Theme.combineByAttributes('variables', previousTheme, currentTheme),
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

  /**
   * Returns a flattened variables object based on the global and local variables passed in.
   * The flattened object will give priority to local variable definitions if they conflict
   * with global vars.
   *
   * @param  {Object} variables Variables defined by the gloval application theme
   * @return {Object}           Resolved theme variables, where local vars take priority
   */
  getVariables(variables = {}) {
    if (isFunction(this.theme.variables) || arrayHasFunction(this.theme.variables)) {
      return resolve(this.theme.variables, variables);
    }

    return this.theme.variables;
  }

  /**
   * Returns a flattened styles object based on the raw theme and vars that were passed in
   *
   * @param  {Object} variables The resolved local theme variables
   * @return {Object}           Resolved styles object
   */
  getStyles(variables = {}) {
    if (isFunction(this.theme.styles) || arrayHasFunction(this.theme.styles)) {
      return resolve(this.theme.styles, variables);
    }

    return this.theme.styles;
  }

}
