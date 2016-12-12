# Themer

[![Build Status](https://travis-ci.org/shanedasilva/themer.svg?branch=master)](https://travis-ci.org/shanedasilva/themer)
[![codecov](https://codecov.io/gh/shanedasilva/themer/branch/master/graph/badge.svg)](https://codecov.io/gh/shanedasilva/themer)
[![dependencies](https://david-dm.org/shanedasilva/themer.svg)](https://david-dm.org/shanedasilva/themer)
[![devDependency Status](https://david-dm.org/shanedasilva/themer/dev-status.svg)](https://david-dm.org/shanedasilva/themer#info=devDependencies)

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

## Contributing

What is the process for contributing to this project?
