/**
 * Copyright (c) 2016 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { createThemer as create } from './utils';

const themer = create();

export { themer, create };

export default (component, rawTheme) => {
  themer.setTheme([rawTheme]);

  return (props) => themer.render(component, props);
};

