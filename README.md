# vue-editable

[![](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org)

In-place editing for Vue.js 2.

> This plugin is still under active development. Do not use in production projects.

## Usage

### app.js

The vue-editable plugin needs to "know" the "parent" vue instance

```
    app = new Vue(...);
    editable.parent = app;
```

### Template

Add the directive `v-editable` with the name of the property you want to bind to.

``` 
    <label v-editable="message">{{ message }}</label> 
```

If your property is nested, you can use `"foo.bar.barz"` as the value.

## License

MIT