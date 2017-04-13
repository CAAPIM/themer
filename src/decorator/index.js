/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/* eslint-disable import/prefer-default-export */
// @flow

import { themer } from '../';
import { mapThemeProps, applyVariantsProps } from '../utils';

function variantsWrapper(snippet: Function) {
  return (props: Object) => snippet(applyVariantsProps(props));
}

export function createDecorator(customThemer?: Object) {
  const themerInstance = customThemer || themer;
  return (rawTheme: Object) => (inputSnippet: Function) => {
    const snippetWithVariants = variantsWrapper(inputSnippet);
    const { snippet, theme } = themerInstance.resolveAttributes(snippetWithVariants, [rawTheme]);
    return (props: Object) => snippet(mapThemeProps(props, theme));
  };
}
