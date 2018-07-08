# Getting Started to Webpack

# v1.1 Core Concept (git checkout v1.1-core-concepts)

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

# v1.2 Configuration file Basics (git checkout v1.2-webpack.config-basics)

## Node server

For this module we're going to use a simple node server. Also i created a new folder ./public that have a index.html which will be served by node.

You have to install 2 new dev dependencies

```
yarn add --dev express nodemon
```

## Configuration file

Out of the box, webpack won't require you to use a configuration file. However, it will assume the entry point of your project is src/index and will output the result in dist/main.js minified and optimized for production.

Usually your projects will need to extend this functionality, for this you can create a webpack.config.js file in the root folder and webpack will automatically use it.

it's in this file where we've got all the power of webpack that allow us to make what ever we want to do with the language. But of course the intention of this quick tuto is configure it to bussiness and production purposes see. let's start with a basic configuration.

in the root of the project add a new file webpack.config.js

bash:

```
touch webpack.config.js
```

what expect webpack is that we export the configuration object it need to understand your requirements.

so let's code.

webpack.config.js :

```
const path = require("path");

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: "./app.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
    publicPath: "/"
  }
};
```

## Entry & Context:

The context is an absolute string to the directory that contains the entry files.

so in this. we don't have to specify the entry folder in the entry property since thanks context now webpack knows which is the entry folder.

the entry point could be a single path in a string or multiple string in array in order of use.
for example:

```
entry: ["babel-polyfill", "./app.js"],
```

since app could need some value of the babel-polyfill you need to include it before app.js.

## output

now in output you have path which specify the folder of the output and the filename which will be the name of the file webpack will produce

and finally we have the publicPath to "/"

### Relative vs absolute paths generated assets in html

be sure publicPath is set to "/" in the webpack output option. since this prevent generate relative assets. instead we want absolute path for all our address.

this is relevant. Especially when you're working with React Router

```
output: {
  path: path.resolve (__dirname, publicFile),
  filename: 'bundle.js',
  publicPath: '/', // <- this is important
},
```

You don't need to add publicPath: '/' to webpack-dev-server

In order to react-router-dom works properly. it needs to have the script tag src path absolute and not relative. since when the route will change the path of the script tag src will change too

this is a bad idea (relative)

```
<script src="bundle.js"></script>
```

If you have a second or a bigger level path in routes. example.

/blog/new

this will relate also the script path to http//localhost:3000/blog/bundle.js and will crash the route since the path doesn't exist.

This is good solution(absolute)

```
<script src="/bundle.js"></script>
```

now the route will be http//localhost:3000/bundle.js (same but static) and accesible to all routes.

## watch mode

with watch mode you can make webpack to listen changes in your code and process it in real time.
and combine this with your server you don't have to execute the script everytime you need to run webpack
in your localhost just refresh the browser and see? like old school development :)!

# v1.3 loaders Part 1 (git checkout v1.3-loaders-part-1)

Loaders are piece of configuration setting that allow us to process chunk of code syntax and translate to one the browser could understand.

for example CSS preprocessors or Javascript compilers.

At a high level, loaders have two properties in your webpack configuration:

The test property identifies which file or files should be transformed.
The use property indicates which loader should be used to do the transforming.

Let's start including one of the most essential loaders we use in modern frontend development

Babel which is a toolchain that is mainly used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in old browsers or environments.

[Futher Reading](https://babeljs.io/docs/en/index.html)

first of all let's install dependencies that we need to run babel propertly

```
yarn add --dev babel-loader babel-core babel-preset-env
```

in order to add the loaders we are adding a new property to our config object: module and inside a rules array which will contain all of test (file extensions) and rules (loaders) we want to use to process our files

```
{
  module: {
    rules [

    ]
  }
}
```

and now. inside rules let's add our first loader; Babel-Loader

```
  {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: "babel-loader"
    }
  }
```

Yes, it is really this easy...

now webpack process our javascript files since _test_ property expect or a string with a file extension or an Regular Expression.
then we exclude all of folders and files we don't want babel process. in this case node_modules or bower_components.
Finally we use babel loader.

but some important thing is still missing. We need to configure babel with its presets and plugins.

There are many ways to declare this. we can even declare this confi here in the loader section as options. but this will make our webpack config longer and we can divide this in a different file to configure babel.

in our root folder add

.babelrc

and now following the documentation of babel we can make all the configuration we think we're going to need for our project

```
{
  "presets": [
    [
      "env",
      {
        "targets": {
          "browsers": "last 2 versions"
        },
        "modules": false,
        "loose": true
      }
    ]
  ]
}
```

this says use the env plugin to use the latest features of Javascript available and which will be compatible with at least the last 2 versions of browsers.

[Read more about .babelrc here.](https://babeljs.io/docs/en/babelrc)

and now. we're done.

Adding a loader it's really this easy. and now let's follow with another common set of loaders related to styles.

## CSS in Webpack

this is key. process your styles is fundamental of any website

let's install the loaders we're going to need for this part:

```
yarn add --dev style-loader css-loader
```

### Loader chaininng

the use property can expect either a single object with a loader or an array of object loaders
in this case to process css correctly we'll need 2 loaders; style-loader and css-loader

we have to include both in order of priority

```
  {
    test: /\.css$/,
    exclude: /(node_modules|bower_components)/,
    use: [
      {
        loader: "style-loader"
      },
      {
        loader: "css-loader"
      }
    ]
  }
```

then in src folder create a new folder call "styles" you can call it how you want and also you can put youe css files wherever you want inside the entry context (src) the important thing here is that you have to import it to the app.js (the entry point file).

app.js

```
import "./styles/index.css";
```

notice that more css files you'll need to make more import, this will solve soon when we add SASS loader and have Sass an scss files support in our project.

and that is.

run your build and server script and see the results in localhost:3000/
