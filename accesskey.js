/**
 * Initializes the accesskey functionality on the page.
 *
 * @return {Object} An object containing the following methods:
 *   - init(): Initializes the accesskey functionality.
 *   - setGlobalHandler(handler): Sets the global handler for accesskeys.
 *   - registerHandler(name, fn): Registers a custom handler for accesskeys.
 *   - setGlobalSplitter(splitter): Sets the global splitter for accesskeys.
 */
export default function accesskey() {

    // Defaults global configs.
    const config = {
        handler: (event, element, context) => {
            element.click();
        },
        splitter: '+',
    };

    // Stores the registered handlers.
    const handlers = {};

    /**
     * Sets the global splitter for accesskeys.
     * 
     * The default separator is `+`.
     * The default when configuring hotkeys is the `modifier+key` format, as in `ctrl+f2`.
     * However, if the `+` key is used in combination with a modifier key (`ctrl`, `shift`, `alt`, `meta`), the separator needs to be modified as well.
     * Then, the `setGlobalSplitter()` method modifies the global default splitter.
     *
     * @param {string} splitter - The splitter to be used for accesskeys.
     * @return {Object} - The current object for method chaining.
     */
    function setGlobalSplitter(splitter) {
        config.splitter = splitter;
        return this;
    }

    /**
     * Sets a custom handler function for a specific name.
     * 
     * @param {string} name - The name of the handler.
     * @param {function} fn - The custom handler function. Handler must be event, element, context parameters.
     * @return {Object} The current object for method chaining.
     */
    function registerHandler(name, fn) {
        handlers[name] = fn;
        return this;
    }

    /**
     * Returns the registered handler function for the given name, or null if not found.
     *
     * @param {string} name - The name of the handler to retrieve.
     * @return {function|null} The registered handler function, or null if not found.
     */
    function getRegisteredHandler(name) {
        return handlers[name] || null;
    };

    /**
     * Determines if the element is a descendant of an internal context that has the 'accesskey-context' attribute set.
     * 
     * Nested contexts are ignored to allow the same shortcut key to be assigned to a higher-level context and the contexts nested within it.
     *
     * @param {Element} element - The element to check.
     * @return {Element|boolean} The closest ancestor element that has the 'accesskey-context' attribute, or false if not found.
     */
    function isDescendantOfInternalContext(element) {
        let current = element.parentElement;
        while (current) {
            if (current.hasAttribute('accesskey-context')) {
                return current;
            }
            current = current.parentElement;
        }

        return false;
    };

    /**
     * Retrieves the key definition based on the element's access key and context.
     *
     * @param {type} context - The context in which the access key is defined.
     * @param {type} element - The element containing the access key.
     * @return {type} The key definition object with key, ctrl, shift, alt, and meta properties.
     */
    function getKeyDef(context, element) {
        let splitted = element.accessKey.split(getSplitterToElement(context, element));
        let def = {
            key: null,
            ctrl: false,
            shift: false,
            alt: false,
            meta: false,
        };
        splitted.forEach(key => {
            switch (key.toLowerCase()) {
                case 'ctrl':
                    def.ctrl = true;
                    break;
                case 'shift':
                    def.shift = true;
                    break;
                case 'alt':
                    def.alt = true;
                    break;
                case 'meta':
                    def.meta = true;
                    break;
                default:
                    def.key = key.toUpperCase();
                    break;
            }
        });

        return def;
    }

    /**
     * Initializes the access key functionality by adding event listeners to the contexts and their elements.
     *
     * @return {void} This function does not return anything.
     */
    function init() {

        getContexts().forEach(context => {
            let elements = context.querySelectorAll(':scope [accesskey]');

            elements.forEach(element => {
                if (context === isDescendantOfInternalContext(element)) {
                    if (!ignoreAccessKey(context, element)) {
                        context.addEventListener('keydown', (event) => {
                            let keyDef = getKeyDef(context, element);
                            if (event.key.toUpperCase() === keyDef.key && event.ctrlKey === keyDef.ctrl && event.shiftKey === keyDef.shift && event.altKey === keyDef.alt && event.metaKey === keyDef.meta) {
                                if (stopPropagation(context, element)) {
                                    event.stopPropagation();
                                }
        
                                if (preventDefault(context, element)) {
                                    event.preventDefault();
                                }
                                getHandlerToElement(context, element)(event, element, context);
                            }
                        });
                    }
                }
            });
        });
    }

    /**
     * Checks if the access key should be ignored for the given context and element.
     * 
     * `accesskey-ignore`: allows you to mark a certain element of a context to be ignored when assigning shortcut keys, causing the 
     * browser's default behavior to be executed for the `accesskey` attribute.
     *
     * @param {Element} context - The context element.
     * @param {Element} element - The element to check.
     * @return {boolean} Returns true if the access key should be ignored, false otherwise.
     */
    function ignoreAccessKey(context, element) {
        if (element.hasAttribute('accesskey-ignore')) {
            return true;
        }

        if (context.hasAttribute('accesskey-ignore')) {
            return true;
        }

        return false;
    }

    /**
     * Checks if propagation should be stopped for the given context and element.
     * 
     * `accesskey-no-stop-propagation`: disable the [stopPropagation()](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) 
     * call for the element or context that receives the attribute.
     *
     * @param {Element} context - The context element.
     * @param {Element} element - The element to check.
     * @return {boolean} Returns false if propagation should be stopped, true otherwise.
     */
    function stopPropagation(context, element) {
        if (element.hasAttribute('accesskey-no-stop-propagation')) {
            return false;
        }

        if (context.hasAttribute('accesskey-no-stop-propagation')) {
            return false;
        }

        return true;
    }

    /**
     * Checks if the preventDefault() method should be called for the given context and element.
     * 
     * `accesskey-no-prevent-default`: disable the [preventDefault()](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) 
     * call for the element or context that receives the attribute.
     *
     * @param {Element} context - The context element.
     * @param {Element} element - The element to check.
     * @return {boolean} Returns false if preventDefault() should not be called, true otherwise.
     */
    function preventDefault(context, element) {
        if (element.hasAttribute('accesskey-no-prevent-default')) {
            return false;
        }

        if (context.hasAttribute('accesskey-no-prevent-default')) {
            return false;
        }

        return true;
    }

    /**
     * Retrieves the handler function associated with the given element or context.
     *
     * @param {Element} context - The context element.
     * @param {Element} element - The element to retrieve the handler for.
     * @return {Function|null} The handler function associated with the element or context, or null if not found.
     */
    function getHandlerToElement(context, element) {

        if (element.hasAttribute('accesskey-handler')) {
            let handlerName = element.getAttribute('accesskey-handler');
            let handler = getRegisteredHandler(handlerName);
            if (handler) return handler;
            if (handlerName in window) return window[handlerName];
        }

        if (context.hasAttribute('accesskey-handler')) {
            let handlerName = context.getAttribute('accesskey-handler');
            let handler = getRegisteredHandler(handlerName);
            if (handler) return handler;
            if (handlerName in window) return window[handlerName];
        }
        return config.handler;
    }
    
    /**
     * Retrieves the splitter attribute from either the 'element' or 'context'.
     * 
     * `accesskey-splitter`: defines a custom separator for the element or context. More details in `setGlobalSplitter()`.
     *
     * @param {Element} context - The context element.
     * @param {Element} element - The element to retrieve the splitter for.
     * @return {string} The splitter attribute value.
     */
    function getSplitterToElement(context, element) {
        if (element.hasAttribute('accesskey-splitter')) {
            return element.getAttribute('accesskey-splitter');
        }

        if (context.hasAttribute('accesskey-splitter')) {
            return context.getAttribute('accesskey-splitter');
        }

        return config.splitter;
    }

    /**
     * Retrieves all elements in the document that have the attribute 'accesskey-context'.
     * If no such elements are found, an error is thrown.
     * 
     * `accesskey-context`: It must be assigned to each of the elements that represent context.
     * Each context is a container that has one or more elements with an assigned `accesskey` and which will be activated 
     * depending on the focus of the web page.
     *
     * @return {NodeList} A list of all elements that have the attribute 'accesskey-context'.
     * @throws {Error} If no elements with the attribute 'accesskey-context' are found.
     */
    function getContexts() {
        let contexts = document.querySelectorAll('[accesskey-context]');
        if (contexts.length === 0) {
             throw new Error('No accesskey contexts found!');
        }
        return contexts;
    }

    /**
     * Sets the global handler for accesskeys.
     *
     * @param {function} handler - The custom handler function. Handler must be event, element, context parameters.
     * @return {Object} The current object for method chaining.
     */
    function setGlobalHandler(handler) {
        config.handler = handler;
        return this;
    }

    return {
        init,
        setGlobalHandler,
        registerHandler,
        setGlobalSplitter,
    };
};