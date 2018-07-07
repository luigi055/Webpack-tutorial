# Getting Started to Webpack

At its core, webpack is a static module bundler for modern JavaScript applications. When webpack processes your application, it internally builds a dependency graph which maps every module your project needs and generates one or more bundles.

## Core Concepts of webpack

- Entry An entry point indicates which module webpack should use to begin building out its internal dependency graph, webpack will figure out which other modules and libraries that entry point depends on (directly and indirectly).
- Output: The output property tells webpack where to emit the bundles it creates and how to name these file(default value is "./src/main.js")
- Loaders: allow webpack to process other types of files and converting them into valid modules that can be consumed by your application and added to the dependency graph.
- Plugins: plugins can be leveraged to perform a wider range of tasks like bundle optimization, assets management and injection of environment variables.

## Modes

Identify and process diferently your bundle depending on the mode you are. By default webpack mode is production.
other posible values are:

- development
- none
- production (default)

## Browser Compatibility

webpack supports all browsers that are ES5-compliant (IE8 and below are not supported). webpack needs Promise for import() and require.ensure(). If you want to support older browsers, you will need to load a polyfill before using these expressions.

## Further Reading

[Webpack Documentation Core concepts](https://webpack.js.org/concepts/)
