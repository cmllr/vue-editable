# vue-editable

[![](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org)

![](https://raw.githubusercontent.com/cmllr/vue-editable/master/example/example.gif)
 


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

### v-for

You can use vue-editable in a `v-for` use case, too. In this case, you need more attributes to tell the plugin what to do.

```
<table>
    <tr>
        <th>Name</th>
    </tr>
    <tr v-for="(value,key) in staff">
        <td v-editable="staff" data-property="name" :data-index="key">
            {{ value.name }}
        </td>
    </tr>
</table>
```

In this example, you tell vue-editable to allow in place editing for `staff[index].name`. Please note that `data-index` is bound via `:` or `v-bind` to get the index at runtime.

## Problems

- `v-for` expression do not work overall
- not pretty at all
- ES6 compalibity unknown

## License

MIT