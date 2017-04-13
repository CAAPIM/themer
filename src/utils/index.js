/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

// @flow

import isFunction from 'lodash/isFunction';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import extend from 'lodash/extend';
import isPlainObject from 'lodash/isPlainObject';
import assign from 'lodash/assign';
import Themer from './../Themer';

/**
 * Creates a new Themer instance
 *
 * @param  {Object} options Themer options
 * @return {Themer}
 */
export function createThemer(options?: Object = {}) {
  return new Themer(options);
}

/**
 * Loops through array and checks to see if any values are of type function
 *
 * @param  {array}  arr The array to scan
 * @return {Boolean}    If any values are of type function
 * @public
 */
export function arrayHasFunction(arr: Array<any> = []) {
  const hasFunction = find(arr, (val: any) => isFunction(val));

  return !!hasFunction;
}

/**
 * Called if theme styles or vars are functions that need to be executed
 *
 * @param  {Array} arrayToResolve  The raw array passed in
 * @param  {Array} args            Callback functions to execute
 * @return {Object}                Contains only flat properties, no functions
 * @public
 */
export function resolveArray(arrayToResolve: any, ...args: Array<any>) {
  const arr = Array.isArray(arrayToResolve) ? arrayToResolve : [arrayToResolve];

  return arr.reduce((accumulator, val) => {
    if (!val) {
      return accumulator;
    }

    if (isFunction(val)) {
      return val(accumulator, ...args);
    }

    return val;
  }, {});
}

/**
 * Returns a flattened variables object based on the global and local variables passed in.
 * The flattened object will give priority to local variable definitions if they conflict
 * with global vars.
 *
 * @param  {Object} globalVariables Variables defined by the gloval application theme
 * @return {Object}           Resolved theme variables, where local vars take priority
 */
export function resolveValue(attr: any, ...args: Array<any>) {
  if (isFunction(attr) || arrayHasFunction(attr)) {
    return resolveArray(attr, ...args);
  }

  return attr;
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
export function combineByAttributes(attr: string, obj1: Object = {}, obj2: Object = {}) {
  if (!obj1[attr] && !obj2[attr]) {
    return {};
  }

  if (obj1[attr] && !obj2[attr]) {
    return obj1[attr];
  }

  if (!obj1[attr] && obj2[attr]) {
    return obj2[attr];
  }

  if (isPlainObject(obj1[attr]) && isPlainObject(obj2[attr])) {
    return assign(obj1[attr], obj2[attr]);
  }

  if (Array.isArray(obj1[attr])) {
    return obj1[attr].concat(obj2[attr]);
  }

  return [obj1[attr], obj2[attr]];
}

/**
 * Type definition for theme-related props
 * @type {ProvidedThemeProps}
 */
export type ProvidedThemeProps = { theme: Object, classes: Object };

/**
 * Map resolved theme to snippet props
 *
 * @param {Object} props         The props passed to the snippet
 * @param {Object} resolvedTheme The resolved theme object
 * @return {Object}              The mapped themed props
 * @public
 */
export function mapThemeProps<OriginalProps: Object>(
  props: OriginalProps,
  resolvedTheme: Object,
): OriginalProps & ProvidedThemeProps {
  return { ...props, theme: resolvedTheme, classes: resolvedTheme.styles };
}

/**
 * Check if variant value matches corresponding prop value
 *
 * @param {any} variantPropVal The variant value
 * @param {any} propVal        The corresponding prop value
 * @return {boolean}           true if values match
 * @public
 */
function verifyVariantPropValue(variantPropVal: any, propVal: any) {
  return (variantPropVal === propVal) || (!variantPropVal && !propVal);
}

/**
 * Append variants passed as "true" props to the root style element
 *
 * @param {T:Object} props The props passed to the render method
 * @return {T}             The styles as per post-variant processing
 * @public
 */
export function applyVariantsProps<T: Object>(props: T): T {
  const resolvedTheme = props.theme;
  if (!resolvedTheme || !resolvedTheme.variants || !resolvedTheme.styles) {
    return props;
  }

  const mappedStyles = extend({ root: '' }, resolvedTheme.styles);
  const mappedProps: T = extend({}, props);
  const renderedVariants = {};

  forEach(resolvedTheme.variants, (variantValue, variantKey) => {
    if (!mappedStyles[variantKey]) {
      return;
    }

    // get variant props as object
    let variantProps;
    if (isPlainObject(variantValue)) {
      variantProps = variantValue;
    } else {
      variantProps = { [variantKey]: variantValue };
    }

    // check if variant props are all satisfied
    let variantActive = true;
    forEach(variantProps, (variantPropValue, variantPropKey) => {
      delete mappedProps[variantPropKey];
      if (!verifyVariantPropValue(variantPropValue, props[variantPropKey])) {
        variantActive = false;
        return false;
      }
      return true;
    });

    // apply variant class to root, if variant is active
    if (variantActive) {
      mappedStyles.root += ` ${mappedStyles[variantKey]}`;
      renderedVariants[variantKey] = true;
    }
  });

  const mappedTheme = extend({}, resolvedTheme, {
    variants: renderedVariants,
    styles: mappedStyles,
  });

  return mapThemeProps(mappedProps, mappedTheme);
}
