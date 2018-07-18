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

# v1.4 loaders Part 2 (git checkout v1.4-loaders-part-2)

Let's continue with some handy loaders related to font, images and static files.
We need our webpack configuration knows how to interprete these files so we can use them in our project

so we'll need some packages

```
yarn add --dev url-loader file-loader resolve-url-loader image-webpack-loader
```

first let's give our css rules the hability to map our images from src to public folder so we can use it in our styles.

for this task will add a new loader to the css rule loader chain; resolve-url-loader

also we need to set the file-loader so webpack know this.jpeg file extension we're going to use as example.

in the css rule:

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
      },
      {
        loader: "resolve-url-loader",
        options: {
          sourceMap: true
        }
      }
    ]
  }
```

and then let's add a new rule for file loader

## File Loader:

image-webpack-loader is a great tool. which allow you optimize your images immediatly while building process so you don't need to process your images with an outside provider. webpack can do it by its own :)!

notice in the file-loader as paremeters you can assign the output folder and you can write the expected exit name and file extension for the file. in this case this will create a new folder en public whose name is assets/images and inside of it will be all our images and from here will be liked to our css thanks to resolve-url-loader. Neat!

```
  {
    test: /\.(jpe?g|png|gif)$/i,
    loaders: [
      'file-loader?limit=1024&name=assets/images/[name].[ext]',
      {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true,
          },
          gifsicle: {
            interlaced: false,
          },
          optipng: {
            optimizationLevel: 4,
          },
          pngquant: {
            quality: '65-90',
            speed: 4,
          },
        },
      },
    ],
    exclude: /node_modules/,
    include: __dirname,
  },
```

### Further Reading:

[file-loader](https://github.com/webpack-contrib/file-loader)
[resolve-url-loader](https://github.com/bholloway/resolve-url-loader)
[image-webpack-loader](https://github.com/tcoopman/image-webpack-loader)

## URL-loader + File-loader and font files.

We would also need support for font files. this is basic in any web development project.
eventthought you might no need to have the direct font file within the project maybe because you use and external provider like google-fonts or fontawesome... this is also necesary when you have unique or custom font-types that aren't available in the cloud.

In webpack.config.js add the following rules

```
  {
    test: /\.otf|woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=assets/fonts/[name].[ext]',
  },
  {
    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader?limit=10000&name=assets/fonts/[name].[ext]',
  },
```

now i added a fonts folder in src with a Gaegu font type.

in index.css we're going to add this font and use it in our project.

```
@font-face {
  font-family: Gaegu;
  src: url(../fonts/Gaegu-Regular.ttf);
}

body {
  background: url(../img/webpack.jpeg);
  font-family: Gaegu, cursive;
}
```

Done!

now our project have support to process images and font files apart of css files linked to its files dependencies it's going to use.

# v1.5 loaders Part 3 (git checkout v1.5-loaders-part-3) Advanced Styling

this is an extra module on loaders, here we're going to install and use PostCSS and Sass.

Not to complicated. in the part of PostCSS we are going to set up the autoprefixer plugin.
and then have the flexibility with the css preprocessor Sass.

packages we're going to need for this module:

```
yarn add --dev sass-loader node-sass postcss-loader autoprefixer
```

First let's setup postcss:

in the config file add a new loader in the css rule chain.
in this case postcss should be placed just after css-loader in order to already have the files linked thanks to resolve-url-loader.

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
      },
      {
        loader: "postcss-loader",
        options: {
          sourceMap: true
        }
      },
      {
        loader: "resolve-url-loader",
        options: {
          sourceMap: true
        }
      }
    ]
  },
```

now, reading the postcss documentation you'll figure it out that you need a postcss config file

in root folder add postcss.config.js:
And set autoprefixer:

```
const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [
    autoprefixer({
      browsers: ["last 2 versions", "ie >= 9", "and_chr >= 2.3"]
    })
  ]
};
```

and now we have the autoprefixer available in our project together with postcss so. we can also include some neat plugins which can help us with some sort of issues.

[Here is a website with a lot of plugins for postcss](https://www.postcss.parts/)

### Other Plugins

theres is some other basics plugins installed and working in this boilerplate
visit postcss.config.js to know more.

#### PixRem

Pixrem is a CSS post-processor that, given CSS and a root em value, returns CSS with pixel unit fallbacks or replacements. It's based on browser data so only needed fallbacks will be added. Basically, it's for IE8 or less, and for IE9 & IE10 in the font shorthand property and in pseudo-elements.

#### will-change

This plugin uses backface-visibility to force the browser to create a new layer, without overriding existing backface-visibility properties. This 3D CSS hack is commonly done with transform: translateZ(0), but backface-visibility is used here to avoid overriding the more popular transform property.

These hacks are required for browsers that do not support will-change

#### mqpacker

MQPacker optimizes your media queries into single rules when possible:

Pre-processors such as Sass make it easy to use media queries within a declaration,
To reduce file sizes and (possibly) improve parsing times, MQPacker packs multiple declarations into one @media rule

**Hot tip**: ensure the first media query declaration in your code defines all possible options in the order you want them even if there’s no actual difference. This guarantees MQPacker will define rules in the correct order.

[mqoacket source](https://www.sitepoint.com/7-postcss-plugins-to-ease-you-into-postcss/)

#### CSS Nano Plugin

cssnano compacts your CSS file to ensure the download is as small as possible in your production environment. Install it via:

```
$yarn add --dev cssnano
```

The plugin works by removing comments, whitespace, duplicate rules, outdated vendor prefixes and making other optimizations to typically save at least 50%. There are alternative options but cssnano is one of the best. Use it!

[Learn More](http://cssnano.co/)

#### Uncss Plugin

UnCSS is a tool that removes unused CSS from your stylesheets. It works across multiple files and supports Javascript-injected CSS.

```
$yarn add --dev uncss
```

[You can test this feature here](https://uncss-online.com/)

[Learn More](UnCSS is a tool that removes unused CSS from your stylesheets. It works across multiple files and supports Javascript-injected CSS.)

## Sass Loader

now let's change the rule RegExp to be able to recognize either css or scss just add a optional pattern before css

/.s?css$/

and now add the sass-loader at the end of the loaders chain in use property.

sass and file extension scss will be processes by webpack and node-sass and it's available to use it in our project.

in src inside styles let's change the index.css to index.scss and now we're going to split the content in 2 partials. \_background.scss and \_color-class.scss and import them using sass syntax within index.scss

\_background.scss:

```
@font-face {
  font-family: Gaegu;
  src: url(../fonts/Gaegu-Regular.ttf);
}

body {
  background: url(../img/webpack.jpeg);
  font-family: Gaegu, cursive;
}
```

\_color-class.scss:

```
.css-class {
  color: rebeccapurple;
}
```

index.scss:

```
@import "background";
@import "color-class";
```

and in app.js change the extension of index.css to index.scss.

app.js:

```
import "./styles/index.scss";
```

to complete the module. make your build and execute the server script and see the changes ;)

# v1.6 Plugins (git checkout v1.6-plugins)

While loaders are used to transform certain types of modules, plugins can be leveraged to perform a wider range of tasks like bundle optimization, assets management and injection of environment variables.

Check out the plugin interface and how to use it to extend webpacks capabilities.
In order to use a plugin, you need to require() it and add it to the plugins array. Most plugins are customizable through options. Since you can use a plugin multiple times in a config for different purposes, you need to create an instance of it by calling it with the new operator.

## extract-text-webpack-plugin

The first plugin we're going to install and set up is the extract-text-webpack-plugin which we'll use it to separate our css from our js. and have completely 2 different files.

for this part we will just need the extract-text-webpack-plugin.

**Warnings**: be sure to install the v4 + version of the plugin since right now the v3 is incompatible with webpack 4.

```
yarn add --dev extract-text-webpack-plugin@4.0.0-alpha.0
```

and now let's go to webpack.config.js and add a new property to our config object.

first we need to require our module in webpack.config.js to have it available in the scope of the file

```
const ExtractTextPlugin = require ('extract-text-webpack-plugin');
```

and then the new property and the plugin we want to use:

```
plugins: [
  new ExtractTextPlugin ('style.css'),
]
```

first we inherit the entire instance of the plugin and pass the name of the name of the file we want to receive as output.

One step more...

now our plugin need to process the file that we'd like to generate. and this is posible thanks to the laders. so, since we want to produce a css file we need to go the css rule in the loaders section and set the plugin there. this way extract-text-webpack-plugin will know what to do with this information.

```
{
        test: /\.s?css$/,
        exclude: /(node_modules|bower_components)/,
        loader: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader"
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true
              }
            },
            {
              loader: "resolve-url-loader",
              options: {
                sourceMap: true
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
```

And with this we have everything setted to separate our js code and css code.

## Html-webpack-plugin

Finally is time to generate our own html files directly from src folder and forget enterelly of public folder (which will be autogenerated by webpack).

we'll need some modules for this part

```
yarn add --dev html-webpack-plugin html-loader
```

The HtmlWebpackPlugin simplifies creation of HTML files to serve your webpack bundles. This is especially useful for webpack bundles that include a hash in the filename which changes every compilation. You can either let the plugin generate an HTML file for you, supply your own template using lodash templates, or use your own loader.

the html-loader will help the html-webpack-plugin to map the files you use in the html file to the output folder when generated.

in loaders add the new html-loader:

```
  {
    test: /\.html$/,
    loader: 'html-loader',
  },
```

and then in plugins use the html-webpack-plugin:

```
plugins: [
  new HTMLWebpackPlugin ({
    title: 'Home',
    filename: `index.html`, // Output name
    template: `index.html` // in src folder (input)
  })
]
```

don't forget to require the html-webpack-plugin at the top of the file.

now in src let's create (of move from public folder) a new html file which we'll generate with webpack.

here a basic template for src/index.js

```
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Webpack Tuto</title>
</head>

<body>
  <h1 id="title">Webpack 4 tuto for AXA</h1>
  <h2 id="subTitle">From Basic to intemerdiate</h2>
  <h2 class="css-class">This is a css class</h2>
</body>

</html>
```

notice that the generated index.html in public already are liked to style.css and bundle.js. Neat!

_WE DON'T NEED THE PUBLIC FOLDER ANYMORE, LET'S REMOVE IT_

# v1.6.1 Plugins autodetect multiple html files (git checkout v1.6.1-plugins-autodetect-multiple-html)

this is a little module that i would like to show you the power and flexibility that webpack config allow use to even generates things dinamically.

in src lets create /views folder which will contain all html files related to our project

before when we installed and set the html-webpack-plugin notice that every time we need to process a new html file (template) we have to add a new instance of the plugin with the options. we will simplify this making this autodetect thanks to NODE.JS **file system** and **Array.prototype.map**

with file system we will detect all the files in the views folder

```
const path = require ('path');
const fs = require ('fs');
const webpack = require ('webpack');
const ExtractTextPlugin = require ('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require ('html-webpack-plugin');

// Get All html files from /views
const htmlPages = fs.readdirSync (path.join (__dirname, 'src', 'views'));
```

so now we have an array of all the files inside views.

since the plugins property understand array we're going to iterate htmlPages and for each file generate a new instance of html-webpack-plugin and then with **Array.prototype.concat** will add the rest of the plugins to the array.

```
  plugins: htmlPages
    .map(
      page =>
        new HTMLWebpackPlugin({
          title: "Home",
          filename: `${page}`,
          template: `views/${page}`
        })
    )
    .concat([new ExtractTextPlugin("style.css")])
```

and that's it. now we don't need to come back to config to add any new html file we need since it now have the abbility to do it by its own.

# v1.7 Webpack dev server (git checkout v1.7-dev-server)

another powerful feature developed by webpack was the webpack dev server which allows you to have a development server which auto compiles in watch mode and autorefresh all changes made.

for this modulo we'll just need one package

```
yarn add --dev webpack-dev-server
```

in package.json let's add a new script:

```
  ...
    "scripts": {
      "dev:server": "node ./node_modules/webpack-dev-server/bin/webpack-dev-server.js --mode development"
    }
  ...
```

with this we're calling webpack-dev-server directly from node_modules. so this way we don't need to have it installed globally.

now go to your CLI and...

```
yarn dev:server
```

and go to localhost:8080/

of course webpack allows us to extend the basic configuration in webpack dev server

now let's go to webpack.config.js in the config object let's add a new property.

```
...
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3000,
    clientLogLevel: "none",
    historyApiFallback: true,
    open: true,
    openPage: "" // Avoid /undefined bug
  }
...
```

let's take a look at each of the option inside devServer

contentBase: will be the folder which the page will be served.
compress: (boolean) Enable gzip compression for everything served.
clientLogLevel: (string) When using inline mode, the console in your DevTools will show you messages.
historyApiFallback: When using the HTML5 History API, the index.html page will likely have to be served in place of any 404 responses.
open: open automatically default browser
openPage: Specify a page to navigate to when opening the browser.

Now webpack dev server is installed and setted. It's time to run it as script.

#Further Reading
[Webpack Dev Server](https://webpack.js.org/configuration/dev-server/)

# v1.8 Modes Enviroment (git checkout v1.8-modes-enviroments)

Since webpack v4 a new feature was added for better customizing our webpack configuration in a way you could control in the same field which chunk of config should work for any enviroment.

in this case we're going to control our webpack configuration in 2 cases.

- production enviroment
- development enviroment

by default webpack set our enviroment in production mode (not in dev server which is development mode).

there are 2 ways to add the enviroments in the config.

the first one is directly in the config file like a new option.

```
module.exports = {
  mode: 'production'
};
```

and my favourite one directly passing the option by script execution like we already have setted in our scripts in package.json.

```
...
  "scripts": {
    "start": "webpack --mode production && node server.js",
    "build": "webpack --mode production",
    "dev:server": "node ./node_modules/webpack-dev-server/bin/webpack-dev-server.js --mode development",
    "dev": "webpack --mode development",
    "dev:watch": "webpack --mode development -w",
    "server": "nodemon server.js"
  },
...
```

and why is this my favourite option?

Simply because now we can get this mode in our config as parameter and made our configuration dinamically.

for example we don't need dev server for development. so let's split this with a simple if statement.

the first is now. we need to change a little bit our export object.

to get the value of me mode we need to receive a parameter for this reason we need a function that will return the final config object. e.g.:

webpack.config.js

```
module.exports = (env, argv) => {
  const config = {
    ...
  };
  if (argv.mode === "development") {
    config.devServer = {
      ...
    }
  }
  return config;
}
```

let's do a little refactor in the config object.

```
const fs = require("fs");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

// Get All html files from /views
const htmlPages = fs.readdirSync(path.join(__dirname, "src", "views"));

module.exports = (env, argv) => {
  const config = {
    context: path.resolve(__dirname, "src"),
    entry: "./app.js",
    output: {
      path: path.resolve(__dirname, "public"),
      filename: "bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.s?css$/,
          exclude: /(node_modules|bower_components)/,
          loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader"
              },
              {
                loader: "postcss-loader",
                options: {
                  sourceMap: true
                }
              },
              {
                loader: "resolve-url-loader",
                options: {
                  sourceMap: true
                }
              },
              {
                loader: "sass-loader",
                options: {
                  sourceMap: true
                }
              }
            ]
          })
        },
        {
          test: /\.(jpe?g|png|gif)$/i,
          loaders: [
            "file-loader?limit=1024&name=assets/images/[name].[ext]",
            {
              loader: "image-webpack-loader",
              options: {
                mozjpeg: {
                  progressive: true
                },
                gifsicle: {
                  interlaced: false
                },
                optipng: {
                  optimizationLevel: 4
                },
                pngquant: {
                  quality: "65-90",
                  speed: 4
                }
              }
            }
          ],
          exclude: /node_modules/,
          include: __dirname
        },
        {
          test: /\.otf|woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader:
            "url-loader?limit=10000&mimetype=application/font-woff&name=assets/fonts/[name].[ext]"
        },
        {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "file-loader?limit=10000&name=assets/fonts/[name].[ext]"
        },
        {
          test: /\.html$/,
          loader: "html-loader"
        }
      ]
    },
    plugins: htmlPages
      .map(
        page =>
          new HTMLWebpackPlugin({
            title: "Home",
            filename: `${page}`,
            template: `views/${page}`
          })
      )
      .concat([new ExtractTextPlugin("style.css")])
  };

  if (argv.mode === "development") {
    config.devServer = {
      contentBase: path.join(__dirname, "public"),
      compress: true,
      port: 3000,
      clientLogLevel: "none",
      historyApiFallback: true,
      open: true,
      openPage: "" // Avoid /undefined bug
    };
  }

  return config;
};
```
