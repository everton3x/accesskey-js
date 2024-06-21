export default function accesskey() {

    const config = {
        handler: (event, element, context) => {
            element.click();
        },
        splitter: '+',
    };

    const handlers = {};

    function setGlobalSplitter(splitter) {
        config.splitter = splitter;
        return this;
    }

    function registerHandler(name, fn) {
        handlers[name] = fn;
        return this;
    }

    function getRegisteredHandler(name) {
        return handlers[name] || null;
    };

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

    function ignoreAccessKey(context, element) {
        if (element.hasAttribute('accesskey-ignore')) {
            return true;
        }

        if (context.hasAttribute('accesskey-ignore')) {
            return true;
        }

        return false;
    }

    function stopPropagation(context, element) {
        if (element.hasAttribute('accesskey-no-stop-propagation')) {
            return false;
        }

        if (context.hasAttribute('accesskey-no-stop-propagation')) {
            return false;
        }

        return true;
    }

    function preventDefault(context, element) {
        if (element.hasAttribute('accesskey-no-prevent-default')) {
            return false;
        }

        if (context.hasAttribute('accesskey-no-prevent-default')) {
            return false;
        }

        return true;
    }

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
    
    function getSplitterToElement(context, element) {
        if (element.hasAttribute('accesskey-splitter')) {
            return element.getAttribute('accesskey-splitter');
        }

        if (context.hasAttribute('accesskey-splitter')) {
            return context.getAttribute('accesskey-splitter');
        }

        return config.splitter;
    }

    function getContexts() {
        let contexts = document.querySelectorAll('[accesskey-context]');
        if (contexts.length === 0) {
             throw new Error('No accesskey contexts found!');
        }
        return contexts;
    }

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