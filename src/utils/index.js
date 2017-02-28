/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { find, isArray, isFunction } from 'lodash';
import forEach from 'lodash/forEach';
import extend from 'lodash/extend';
import isPlainObject from 'lodash/isPlainObject';
import objectAssign from 'object-assign';
import Themer from './../Themer';

/**
 * Creates a new Themer instance
 *
 * @param  {Object} options Themer options
 * @return {Themer}
 */
export function createThemer(options = {}) {
  return new Themer(options);
}

/**
 * Loops through array and checks to see if any values are of type function
 *
 * @param  {array}  arr The array to scan
 * @return {Boolean}    If any values are of type function
 * @public
 */
export function arrayHasFunction(arr = []) {
  const hasFunction = find(arr, (val) => isFunction(val));

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
export function resolveArray(arrayToResolve, ...args) {
  const arr = isArray(arrayToResolve) ? arrayToResolve : [arrayToResolve];

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
export function resolveValue(attr, ...args) {
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
export function combineByAttributes(attr, obj1 = {}, obj2 = {}) {
  if (!obj1[attr] && !obj2[attr]) {
    return {};
  }

  if (obj1[attr] && !obj2[attr]) {
    return obj1[attr];
  }

  if (!obj1[attr] && obj2[attr]) {
    return obj2[attr];
  }

  return objectAssign(obj2[attr], obj1[attr]);
}

/**
 * Append variants passed as "true" props to the root style element
 *
 * @param {Object} props             The props passed to the render method
 * @param {Object} theme             The theme as calculated
 * @return {Object}                  The styles as per post-variant processing
 * @public
 */
export function applyVariantsProps(props, resolvedTheme) {
  const variants = resolvedTheme.variants;
  const mappedStyles = extend({ root: '' }, resolvedTheme.styles);
  const mappedProps = extend({}, props);
  const renderedVariants = {};

  forEach(variants, (variantValue, variantKey) => {
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
      if (props[variantPropKey] !== variantPropValue) {
        variantActive = false;
      }
    });

    // apply variant class to root, if variant is active
    if (variantActive && mappedStyles[variantKey]) {
      mappedStyles.root += ` ${mappedStyles[variantKey]}`;
      renderedVariants[variantKey] = true;
    }
  });

  const mappedTheme = extend({}, resolvedTheme, {
    variants: renderedVariants,
    styles: mappedStyles,
  });

  return { ...mappedProps, theme: mappedTheme };
}

export function mapThemeProps(props, resolvedTheme) {
  if (resolvedTheme.variants && resolvedTheme.styles) {
    const variantsProps = applyVariantsProps(props, resolvedTheme);
    return variantsProps;
  }
  return { ...props, theme: resolvedTheme };
}
