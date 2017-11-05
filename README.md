# babel-plugin-transform-react-render-parameters

Allow props and state as render() parameters

## Example

**In**

```js
// input code
```

**Out**

```js
"use strict";

// output code
```

## Installation

```sh
$ npm install babel-plugin-transform-react-render-parameters
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["babel-plugin-transform-react-render-parameters"]
}
```

### Via CLI

```sh
$ babel --plugins babel-plugin-transform-react-render-parameters script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["babel-plugin-transform-react-render-parameters"]
});
```
