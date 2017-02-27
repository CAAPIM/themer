/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

export const testThemeSimple = {
  styles: {
    root: 'big-text-class',
  },
};

export const testThemeVariants = {
  styles: {
    root: 'big-text-class',
    stop: 'red-black-class',
    go: 'green-grass-class',
  },
  variants: {
    stop: true,
    go: true,
  },
};

export const testThemeSimpleFunction = {
  styles: () => ({
    root: { color: 'orange' },
  }),
};

export const testThemeFunction = {
  variables: {
    color: 'blue',
  },
  styles: (_, vars) => ({
    root: { color: vars.color },
  }),
};

export const snippet = (props) =>
  `<h1 class="${props.theme.styles.root}">` +
    `${props.content}` +
  '</h1>';
