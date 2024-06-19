import hotkeys from '../hotkeys-js/dist/hotkeys.esm.js';

/**
 * Initializes accesskey functionality on the webpage.
 *
 * @param {Object} config - An optional configuration object.
 * @param {boolean} [config.debug=false] - Whether to enable debug logging.
 * @param {function} [config.handler=defaultHandler] - The function to handle shortcut key events.
 * @param {function} [config.extra=false] - An optional function to perform additional actions on elements with shortcut keys.
 * @return {undefined} This function does not return a value.
 */
export default function accesskey(config) {

    /**
     * Logs a message to the console if the debug mode is enabled.
     *
     * @param {string} message - The message to be logged.
     * @param {string} [type='log'] - The type of log message to be displayed. Default is 'log'.
     * @return {undefined} This function does not return a value.
     */
    const logger = function (message, type = 'log') {
        if (config.debug) {
            console[type](message);
        }
    };

    // If config not defined, set it to an empty object. Necessary to next steps.
    if (!config) {
        config = {};
    }

    // If config.debug not defined, set it to default value.
    if (!config.hasOwnProperty('debug')) {
        config.debug = false;
    }

    /* If config.handler not defined, set it to default value.
     * 
     * Default handler function is a simple click event if element is a button html tag or a link.
     */
    if (!config.hasOwnProperty('handler')) {
        logger('Accesskey handler not specified! Using default.', 'warning');
        config.handler = function (event, element) {
            event.preventDefault();
            if (element.tagName === 'BUTTON' || element.tagName === 'A') {
                logger('Handler called for element: ' + element.tagName, 'info');
                element.click();
            }
        };
    }

    /*
     * If config.extra not defined, set it to default value.
     * 
     * Extra is a function that can do anything on the element that has the shortcut defined.
     * 
     * You can, for example, add a tag to the element to display the shortcut key.
     */
    if (!config.hasOwnProperty('extra')) {
        logger('Extra handler not specified! Nothing to do.', 'warning');
        config.extra = false;
    }

    logger('accesskey loaded!', 'info');
    logger(config, 'debug');

    let elements = window.document.querySelectorAll('[accesskey]');
    logger(elements, 'debug');

    // Iterate through elements that have the html accesskey attribute defined.
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        let key = element.getAttribute('accesskey');

        logger(element, 'debug');

        // Uses the hotkeys library to assign the shortcut keys defined in the element's accesskey attribute.
        hotkeys(key, function (event) {
            config.handler(event, element);
        });
        logger('accesskey binded to ' + key, 'info');

        // If config.extra is defined, call it on the element that has the shortcut defined.
        if (config.extra) {
            logger('Extra handler called!', 'info');
            config.extra(element);
        }
    }

    logger('accesskey ready!', 'info');
};