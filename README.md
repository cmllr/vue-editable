# vue-editable

[![](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org)
[![Build Status](https://travis-ci.org/cmllr/vue-editable.svg?branch=master)](https://travis-ci.org/cmllr/vue-editable)


![](https://raw.githubusercontent.com/cmllr/vue-editable/master/example/example.gif)
 
In-place editing for Vue.js 2.

> This plugin is still under active development. Do not use in production projects.

## Bootstrap

1. Include `vue-editable.min.js` and `vue-editable.min.css` from https://github.com/cmllr/vue-editable/releases
2. Include the plugin via `Vue.use(editable)`

## Core features

The directive `v-editable=dataMember` is the main directive. The attribute value is a existing property. If `dataMember` is a nested structure, simply use a `foo.bar.barz`-like syntax.

```
<label v-editable="message">{{ message }}</label> 
```

### Danger ahead: Iterated edit

If you want to edit objects out of an loop, e. g. `v-for`, you have to inform the library what the given index of the object is.

For this purpose, you can use the `data-index` attribute. Note the `:` just before the attribute's name!

```
:data-index="key"
```

If your array does contain objects, not scalar types (like number or string), you also have to attribute the property which should be edited. For this purpose, you can use the attribute `data-property=name`. Please note: There is no `:` before the attribute name.

```
data-property="customerName"
```

## Attributes

If you want to control the display of the displayed input, e. g. with `input type='number'`, you can do this with the suffix `data-`. E. g. `type` becomes `data-type`, the content remains the same.

## Events

```
vm.$on(name,function(e){
    //do something
});

```

|Event-Name|e|
|-|-|
|editable-changed|An object with members `newValue` and `oldValue` (dereferenced)|
|editable-opened|the element which is currently edited|
|editable-aborted|the element which should be edited|

## Type keeping

The library tries to guess the old value type and converts the new value according to the determined type. There is currently not settings for turning this on or off or in case of switching types, e. g. form `int` to `float`.

## Problems

- `v-for` expression do not work overall
- not pretty at all
- kinda buggy
- no tests
- options missing
- ES6 compalibity unknown

## License

MIT