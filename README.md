# babel-plugin-transform-react-render-parameters

Allow props and state as render() parameters, as in preact.

## Example

**In**

```js
class Test extends Component {
  render(props, { a, b }, ctx) {
    return <div />;
  }
}
```

**Out**

```js
class Test extends Component {
  render() {
    const props = this.props,
          { a, b } = this.state,
          ctx = this.context;

    return <div />;
  }
}
```

## Installation

```sh
$ npm install --dev babel-plugin-transform-react-render-parameters
```

## Usage

**.babelrc**

```json
{
  "plugins": ["react-render-parameters"]
}
```

The `render` method will be changed for classes with `Component` or `PureComponent` as their superclass by default. To change this, add the `superClasses` option:

```json
{
  "plugins": [
    ["react-render-parameters", {
      "superClasses": ["Component", "MyBaseComponent"]
    }]
  ]
}
```

## Limitations

This plugin currently only supports class methods defined within the `class` syntax. As a result, it won't work with `React.createClass()`. If you are using a plugin which transforms the `class` syntax, this plugin needs to come before that one in the `plugins` array. This plugin will work fine if the other plugin is part of a preset, as well.