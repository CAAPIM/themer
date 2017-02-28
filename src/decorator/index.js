/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/* eslint-disable import/prefer-default-export */

import { themer } from '../';
import { mapThemeProps } from '../utils';

export function createDecorator(customThemer) {
  const themerInstance = customThemer || themer;
  return rawTheme => inputSnippet => {
    const { snippet, theme } = themerInstance.resolveAttributes(inputSnippet, [rawTheme]);
    return (props) => snippet(mapThemeProps(props, theme));
  };
}
