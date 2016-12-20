# Themer
[![Build Status](https://travis-ci.org/CAAPIM/themer.svg?branch=master)](https://travis-ci.org/CAAPIM/themer)
[![codecov](https://codecov.io/gh/CAAPIM/themer/branch/master/graph/badge.svg)](https://codecov.io/gh/CAAPIM/themer)
[![dependencies](https://david-dm.org/CAAPIM/themer.svg)](https://david-dm.org/CAAPIM/themer)
[![devDependency Status](https://david-dm.org/CAAPIM/themer/dev-status.svg)](https://david-dm.org/CAAPIM/themer#info=devDependencies)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Installation

```js
npm install themer --save
```

## Usage

### Snippet Usage
```js
import themer from 'themer';
import theme from './styles.css';

const headerHtmlSnippet = (props) => {
  const { styles } = props.theme;

  return `
    <div class="${styles.root}">
      <h1 class="${styles.title}">'${props.content}'</p>
    </div>
  `;
};

export default themer(headerHtmlSnippet, theme);
```
<!--
### API Usage
```js
import { resolveThemes, getThemeVariables, getThemeStyles } from 'themer';

const resolvedTheme = resolveThemes(theme);
const resolvedThemeVars = getThemeVariables(resolvedTheme || {});
const resolvedThemeStyles = getThemeStyles(resolvedTheme, resolvedThemeVars);
```
 -->
 ************************************************************

## Development

|`npm run <script>`|Description|
|------------------|-----------|
|`lint`| Runs eslint against all `.js` files in `./src` folder.|
|`test`|Runs [Mocha](https://github.com/mochajs/mocha) against all `./src/*.spec.js` files.|
|`test:watch`|Runs long running `test` command.|
|`test:coverage`|Runs `test` command and generates coverage report.|
|`deploy`|Runs `lint`, `test` commands.|
|`commit`|Uses [commitizen](https://github.com/commitizen/cz-cli) to do proper tagged commits.|
|`release`|Uses [semantic-release](https://github.com/semantic-release/semantic-release) to trigger releases.|

************************************************************

## How Can You Contribute
Your contributions are welcome and much appreciated. To learn more, see the [Contribution Guidelines](https://github.com/CAAPIM/react-themer/blob/master/CONTRIBUTING.md).

This project supports `commitizen`. You can use `npm run commit` to run the local instance of `commitizen` or `git cz` if you have it installed globally.

Alternatively, if you are simply using `git commit`, you must follow this format:
`git commit -m "<type>: <subject>"`
************************************************************

## License
Copyright (c) 2016 CA. All rights reserved.
This software may be modified and distributed under the terms of the MIT license. To learn more, see the [License](https://github.com/CAAPIM/react-themer/blob/master/LICENSE.md)

