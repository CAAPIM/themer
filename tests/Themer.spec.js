/**
 * Copyright (c) 2017 CA. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import themerDecorator, { create, themer as themerInstance } from '../src';
import Themer from '../src/Themer';

// use dirty chai to avoid unused expressions
chai.use(dirtyChai);
const expect = chai.expect;

let testInstance = null;

const testTheme = {
  styles: {
    root: 'big-text-class',
    stop: 'red-black-class',
    go: 'green-grass-class',
  },
  variables: () => ({
    color: 'red',
  }),
  variants: {
    stop: false,
    go: false,
  },
};

const snippet = (props) =>
  `<h1 class="${props.styles.root}">${props.content}</h1>`;

describe('Themer', () => {
  describe('exports', () => {
    describe('default', () => {
      it('should export the result of Themer.render()', () => {
        const result = themerDecorator(snippet, testTheme)({ content: 'Hello' });
        expect(result).to.equal('<h1 class="big-text-class">Hello</h1>');
      });

      it('should give access to the default instance of themer', () => {
        expect(themerInstance instanceof Themer).to.be.true();
      });
    });

    describe('create', () => {
      it('should export create function that creates a new Themer instance', () => {
        expect(create).to.be.a('function');
        expect(create() instanceof Themer).to.be.true();
      });

      it('should allow for the creation of multiple Themer instances', () => {
        const testInstance1 = create();
        const testInstance2 = create();

        expect(testInstance1.id).to.not.equal(testInstance2.id);
      });
    });
  });

  describe('middleware', () => {
    it('should accept middleware functions in the constructor options', () => {
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();

      testInstance = create({ middleware: [spy1, spy2] });
      expect(testInstance.getMiddleware().length).to.equal(2);
    });

    it('should provide a setter method to set middleware', () => {
      const spy1 = sinon.spy();
      const spy2 = sinon.spy();

      testInstance = create();
      testInstance.setMiddleware(spy1, spy2);

      expect(testInstance.getMiddleware().length).to.equal(2);
    });
  });

  describe('theme', () => {
    it('should be an object', () => {
      expect(themerInstance.theme).to.be.a('object');
    });

    it('should provide a setter method to set a theme', () => {
      testInstance = create();

      expect(testInstance.setTheme).to.be.a('function');
    });

    it('should provide a getter methods for theme id, variables, variants, and styles', () => {
      testInstance = create({ themes: [testTheme] });

      expect(testInstance.getThemeId).to.be.a('function');
      expect(testInstance.getThemeStyles).to.be.a('function');
      expect(testInstance.getThemeVariables).to.be.a('function');
      expect(testInstance.getVariants).to.be.a('function');
    });

    it('accepts a non keyed array of theme attributes and adds styles key', () => {
      const nonKeyedTheme = { test: 'test' };
      testInstance = create({ themes: [nonKeyedTheme] });

      expect(testInstance.getThemeId).to.be.a('function');
      expect(testInstance.getThemeStyles).to.be.a('function');
      expect(testInstance.getThemeVariables()).to.deep.equal({});
      expect(testInstance.getVariants()).to.deep.equal({});
    });

    it('will use theme1.styles if theme2.styles does not exist', () => {
      testInstance = create({ themes: [testTheme, {}] });
      const resolvedStyles = testInstance.getThemeStyles();

      expect(resolvedStyles).to.deep.equal(testTheme.styles);
    });

    it('should throw an error if theme is not an object or function', () => {
      testInstance = create();
      expect(() => testInstance.setTheme([1])).to.throw();
    });

    it('should return an object of variants if supplied', () => {
      testInstance = create({ themes: [testTheme] });
      const variantObj = testInstance.getVariants();
      const expectedResult = { stop: false, go: false };
      expect(variantObj).to.deep.equal(expectedResult);
    });

    it('should generated a new theme object when using .setTheme() on an existing Themer', () => {
      testInstance = create({ themes: [testTheme] });
      const oldThemeId = testInstance.getThemeId();
      testInstance.setTheme([testTheme]);

      expect(testInstance.getThemeId()).to.not.equal(oldThemeId);
    });

    it('should accept theme.styles and theme.variables as functions', () => {
      const testFunctionTheme = {
        styles: () => ({ test: 'test' }),
        variables: () => ({ color: 'red' }),
      };

      testInstance = create({ themes: [testFunctionTheme] });
      const renderedSnippet = testInstance.render(snippet, { content: 'Hello' });
      expect(renderedSnippet).to.equal(`<h1 class="${testFunctionTheme.styles().root}">Hello</h1>`);
    });

    it('should return the resolved snippet and theme attributes', () => {
      testInstance = create();
      const resolvedAttrs = testInstance.resolveAttributes(snippet, [testTheme]);

      expect(resolvedAttrs).to.be.a('object');
      expect(resolvedAttrs.theme).to.deep.exist();
      expect(resolvedAttrs.snippet).to.deep.exist();
    });
  });

  it('should accept theme.styles as a function', () => {
    const testFuncTheme = {
      styles: () => ({ color: 'red' }),
    };

    testInstance = create({ themes: [testFuncTheme] });
    const resolvedStyles = testInstance.getThemeStyles();

    expect(resolvedStyles).to.deep.equal(testFuncTheme.styles());
  });

  describe('render', () => {
    it('should provide the rendered HTML snippet with styles resolved and mapped', () => {
      testInstance = create({ themes: [testTheme] });
      const renderedSnippet = testInstance.render(snippet, { content: 'Hello' });

      expect(renderedSnippet).to.equal('<h1 class="big-text-class">Hello</h1>');
    });

    it('should provide the rendered HTML snippet with styles resolved and mapped with variant support', () => {
      testInstance = create({ themes: [testTheme] });
      const renderedSnippet = testInstance.render(snippet, { content: 'Hello', stop: true, go: true });

      expect(renderedSnippet).to.equal('<h1 class="big-text-class red-black-class green-grass-class">Hello</h1>');
    });

    it('should run the middleware functions before render', () => {
      const spy1 = sinon.spy((component) => component);
      const spy2 = sinon.spy((component) => component);
      testInstance = create({ themes: [testTheme], middleware: [spy1, spy2] });
      testInstance.render(snippet);

      expect(spy1.calledOnce).to.be.true();
      expect(spy2.calledOnce).to.be.true();
    });
  });
});
