/**
 * Copyright (c) 2016 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { isFunction, isObject } from 'lodash';
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
 * Loops through object and checks to see if any values are of type function
 *
 * @param  {Object}  obj The array to scan
 * @return {Boolean}     If any values are of type function
 * @public
 */
export function objectHasFunction(obj = {}) {
  const hasFunction = Object.keys(obj).find((val) => {
    return isFunction(obj[val]);
  });

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
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

/**
 * Called if theme styles or vars are functions that need to be executed
 *
 * @param  {Array} arrayToResolve  The raw array passed in
 * @param  {Array} args            Callback functions to execute
 * @return {Object}                Contains only flat properties, no functions
 * @public
 */
export function resolve(obj, ...args) {
  if (isFunction(obj)) {
    obj = obj(...args);
  }

  if (isObject(obj)) {
    for (let prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (isFunction(obj[prop])) {
          obj[prop] = obj[prop](...args);
        }

        if (isObject(obj[prop])) {
          obj[prop] = resolve(obj[prop], ...args);
        }
      }
    }
  }

  return obj;
}
