'use strict';

let store = [];

module.exports = () => ({
    isStar: false,

    on: function (event, context, handler) {
        store.push([event.split('.'), context, handler]);

        return this;
    },

    off: function (event, context) {
        let eventSplitted = event.split('.');

        store = store.filter(
            ([storeEvent, storeContext]) => {
                let slicedStoreEvent = storeEvent.slice(0, eventSplitted.length);

                return storeContext === context &&
                    eventSplitted.join('.') === slicedStoreEvent.join('.');
            }
        );

        return this;
    },

    emit: function (event) {
        let eventSplitted = event.split('.');

        store.forEach(
            ([storeEvent, storeContext, storeHandler]) => {
                let minEventNamesLength = Math.min(
                    eventSplitted.length,
                    storeEvent.length
                );

                let slicedEvent = eventSplitted.slice(0, minEventNamesLength);
                let slicedStoreEvent = storeEvent.slice(0, minEventNamesLength);

                if (slicedEvent.join('.') === slicedStoreEvent.join('.')) {
                    storeHandler.call(storeContext);
                }
            }
        );

        return this;
    }
});
