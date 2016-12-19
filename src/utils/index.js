/**
 * Copyright (c) 2016 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { isFunction, isArray, find } from 'lodash';
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
  const hasFunction = find(arr, (val) => isFunction(arr[val]));

  return !!hasFunction;
}

/**
 * Flattens an n-dimensional array
 *
 * @param  {Array} arr Collection of arrays to flatten
 * @return {Array}     Flattened array
 * @public
 */
export function flatten(arr) {
  return arr.reduce((flat, toFlatten) =>
    flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), []);
}

/**
 * Called if theme styles or vars are functions that need to be executed
 *
 * @param  {Array} arrayToResolve  The raw array passed in
 * @param  {Array} args            Callback functions to execute
 * @return {Object}                Contains only flat properties, no functions
 * @public
 */
export function resolve(arrayToResolve, ...args) {
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
