# babel-plugin-transform-react-render-parameters

Allow props and state as render() parameters

## Example

**In**

```js
class Test extends Component {
  render(props, { a, b }) {
    return <div />;
  }
}
```

**Out**

```js
class Test extends Component {
  render() {
    const props = this.props,
          { a, b } = this.state;

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
  "plugins": ["transform-react-render-parameters"]
}
```
