/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

// @flow

import {
  createThemer as create,
  mapThemeProps,
  applyVariantsProps,
} from './utils';
import { createDecorator } from './decorator';

// export flow type for theme props
export type { ProvidedThemeProps } from './utils';

const themer = create();

export {
  themer,
  create,
  createDecorator,
  mapThemeProps,
  applyVariantsProps,
};

export default createDecorator(themer);
