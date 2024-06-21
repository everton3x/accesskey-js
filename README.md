# AccessKey.js
Easily and quickly assign shortcut keys to your web applications.

**AccessKey.js** detects which elements of your web application have a shortcut key defined and configures event listeners for them, all automatically.

## Dependencies

Since version 2.x, **AccessKey.js** does not depend on any other package.

## Installation

To install **AccessKey.js**, run the npm instalation command:

`npm install accesskey-js`

## Usage

To initialize **AccesKey.js** in your application, import the library and call the main function whether or not you pass the settings:

```javascript
import accesskey from 'accesskey-js';

// Configuration default.
accesskey().init();

// or (with all available options)

accesskey().setGlobalHandler(function(event, element, context){}).registerHandler('handlerName', function(event, element, context){}).setGlobalSplitter('');

```

As of version 2.0.0, all configuration is done directly in the HTML code through `accesskey-*` attributes.

See de `example` directory to samples of use.

To run examples, does:

```
cd examples/basic #or another sample directory
npm install
npm run dev --host
```

**AccessKey.js** needs two html attributes to work: `accesskey-context` and `accesskey`.

`accesskey-context` must be assigned to the context (or several contexts) in which the shortcuts will work. For example: shortcuts that must work on the entire page, the context must be the body (`<body accesskey-context>`). A shortcut that should only work on a specific form must be in the form context (`<form accesskey-context>`). Theoretically, any HTML element can be declared a context with `accesskey-context`, however, the context is identified as the focus location of the web page, so normally body and forms will be contexts.

`accesskey` defines which html element the shortcut key will be linked to and the attribute value specifies which shortcut key will be used. Only accesskey in child elements of contexts are considered by **AccessKey.js**.

## Hotkey assignment

To assign a shortcut key to some html element, simply add the [accesskey html attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey) with the shortcut key:

```html
<button accesskey="ctrl+g">Click me!</button>
<a accesskey="ctrl+a" href="https://site.to.go/">Site to go!</a>
```

In this example, when pressing ctrl+g, a [click](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event) will be performed on the button. If we press ctrl+a, the page will be redirected to https://site.to.go.

## Supported keys

The supported shortcuts are:

- alphanumeric keys ([0-9a-Z]);
- F1 ~ F12;
- Enter;
- Esc;
- Symbol keys (+, -, *, /, etc.);
- Any combination of the above keys with the ctrl, alt, shift and meta modifier keys.

For more details on this behavior, read the [Handler section](#handler).

## Handler

The default handler performs the following behavior:

The default behavior when triggering a hotkey is to fire the [click event](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event) on the element to which the hotkey is associated ([stopPropagatio()](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) and [preventeDefault()](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) are also fired before the click).

The handler can be changed at the element and context level by adding the `accesskey-handler="handlerName"` attribute to the element or context:

```html
<div accesskey-context accesskey-handler="contextLevelHandler">
    <button id="btn1" accesskey="ctrl+1">
    <button id="btn2" accesskey="ctrl+2" accesskey-handler="elementLevelHandler">
</div>
```

In the example above, `#btn1` will inherit the context handler (`contextLevelHandler`), while `#btn2` has its own defined handler (`elementLevelHandler`).

The value passed to the `accesskey-handler` attribute must be that of a javascript function. This function can be registered with `.registerHandler()` before `.init()` or it can be in global scope.

**AccessKey.js**, first searches for custom handler among those that are registered, if not, searches in the global scope, if not, uses the default handler (which can be modified by `.setGlobalHandler()` before `.init()`.

The precedence between handlers is: `element` -> `context` -> `global scope` -> `default handler`.

`.setGlobalHandler()` must receive a handler function as an argument.

`.registerHandler()` must receive as its first argument the name of the handler (used in the `accesskey-handler` attribute) and in the second argument a handler function.

Handler functions must receive the following 3 arguments, in order:

`event`: javascript [click event](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event) object;
`element`: the html element to which the shortcut key is associated (element that receives the `accesskey` attribute);
`context`: the element that represents the context (element that receives the `accesskey-context` attribute);

## Config options

**AccessKey.js** has a dual configuration model:

Some configurations are done through methods called on the main `accesskey()` function and before the `init()` method.

However, most configurations are made directly in the html using the `accesskey` and `accesskey-*` attributes.

`.setGlobalSplitter(string)`: Sets the hotkey separator. The default separator is `+`. The default when configuring hotkeys is the `modifier+key` format, as in `ctrl+f2`. However, if the `+` key is used in combination with a modifier key (`ctrl`, `shift`, `alt`, `meta`), the separator needs to be modified as well. Then, the `setGlobalSplitter()` method modifies the global default splitter.

`registerHandler(string handlername, function (event, element, context){})`: Defines a handler to be used at the element and/or context level.

`setGlobalHandler(function (event, element, context){})`: changes de default global handler.

In addition to these methods (which must be called after `accesskey()` and before `init()`), other configurations are made using the following attributes:

`accesskey`: assigned to each element to which the shortcut key will be linked. It must receive as value the key or combination of shortcut keys such as `accesskey="a"`, `accesskey="f3"`, `accesskey="ctrl+1"`, `accesskey="alt+shift+f5"`, `accesskey="shift+ctrl+alt+g"`, etc.

`accesskey-context`: It must be assigned to each of the elements that represent context. Each context is a container that has one or more elements with an assigned `accesskey` and which will be activated depending on the focus of the web page.

`accesskey-ignore`: allows you to mark a certain element of a context to be ignored when assigning shortcut keys, causing the browser's default behavior to be executed for the `accesskey` attribute.

`accesskey-no-stop-propagation`: disable the [stopPropagation()](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) call for the element or context that receives the attribute.

`accesskey-no-prevent-default`: disable the [preventDefault()](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) call for the element or context that receives the attribute.

`accesskey-handler`: defines a custom handler for the element or context. More details in section [#handler].

`accesskey-splitter`: defines a custom separator for the element or context. More details in `setGlobalSplitter()`.

## Browser support

**AccessKey.js** only uses javascript code (Vanilla JS), so it should work properly in the modern browsers.

## Contributing

Contributions are welcome. If you find a bug or have a suggestion for improvement, please consider opening an [issue](https://github.com/everton3x/accesskey-js/issues).

If you want to contribute code, consider taking the following steps:

1. Create a [fork](https://github.com/everton3x/accesskey-js/fork);
2. In your fork, implement the improvements/fixes;
3. Submit a pull request.

Please consider using the [Conventional Commits](conventionalcommits.org) guidelines in your commits.

## Licence
This library is distributed under the [MIT license](https://opensource.org/license/MIT).

## Contributors

[Everton da Rosa](https://github.com/everton3x)
