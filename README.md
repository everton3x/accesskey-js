# AccessKey.js
Easily and quickly assign shortcut keys to your web applications.

**AccessKey.js** detects which elements of your web application have a shortcut key defined and configures event listeners for them, all automatically.

## Dependencies

**AccessKey.js** depends of the [HotKeys.js](https://www.npmjs.com/package/hotkeys-js) javascript library.

> HotKeys.js is an input capture library with some very special features, it is easy to pick up and use, has a reasonable footprint (~6kB) (gzipped: 2.8kB), and has no dependencies. It should not interfere with any JavaScript libraries or frameworks.

## Installation

To install **AccessKey.js**, run the npm instalation command:

`npm install accesskey-js`

## Usage

To initialize **AccesKey.js** in your application, import the library and call the main function whether or not you pass the settings:

```javascript
import accesskey from 'accesskey-js';

// Configuration default.
accesskey();

// or

accesskey({
    debug: true,
    handler: function(event, element){
        // event.preventDefault();
        // other code here!
    },
    extra: function(element){
        // to something...
    }
});

```

## Hotkey assignment

To assign a shortcut key to some html element, simply add the [accesskey html attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey) with the shortcut key as supported by HotKeys.js:

```html
<button accesskey="ctrl+g">Click me!</button>
<a accesskey="ctrl+a" href="https://site.to.go/">Site to go!</a>
```

In this example, when pressing ctrl+g, a [click](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event) will be performed on the button. If we press ctrl+a, the page will be redirected to https://site.to.go.

For more details on this behavior, read the [Default Handler section](#default-handler).

## Default Handler

The default handler performs the following behavior:

If the element triggered by the hotkey is a button (`button` html tag), a click will be triggered on the element;

If it is a link (`a` html tag), the web page will be redirected to the address of the element's `href` attribute.

However, you can provide a custom handler through `config.handler`.

This handler must be a `function` that takes two parameters (`event` and `element`).

`event` corresponds to the [javascript event](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events).

`element` is the javascript object of the hotkey target element.

**An important warning: don't forget to fire [event.preventDefault()](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) in your custom handler (if you want to avoid the default hotkey behavior).**

## Browser support

Currently, **AccessKey.js** has been tested on the *Edge browser*. However, *HotKeys.js* has been tested on the following browsers:

- Internet Explorer 6+
- Safari
- Firefox
- Chrome

**AccessKey.js** only uses javascript code (Vanilla JS), so it should work properly in the browsers listed by *HotKeys.js*.

## Supported keys

*HotKeys.js* understands the following modifiers: ⇧, shift, option, ⌥, alt, ctrl, control, command, and ⌘.

The following special keys can be used for shortcuts: backspace, tab, clear, enter, return, esc, escape, space, up, down, left, right, home, end, pageup, pagedown, del, delete, f1 through f19, num_0 through num_9, num_multiply, num_add, num_enter, num_subtract, num_decimal, num_divide.

⌘ Command() ⌃ Control ⌥ Option(alt) ⇧ Shift ⇪ Caps Lock(Capital) ↩︎ return/Enter space

## Config options

**AccessKey.js** can receive a javascript object with configuration options. The configuration options are as follows:

`debug` (default: `false`)
: If `true`, debug messages are writing to console.

`handler` (default: see [Default Handler section](#default-handler))
: The handler triggered on hotkey dispatched.

`extra` (dafault `false`)
: If defined, it is a JavaScript function that can do anything you want. Receives `element` as a parameter.

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
