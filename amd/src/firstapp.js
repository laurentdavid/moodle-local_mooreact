define(['exports', 'local_mooreact/react', 'local_mooreact/react-dom'], (function (exports, React, ReactDOM) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
    var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

    // Define your main component
    function FirstApp() {
      return /*#__PURE__*/React__default["default"].createElement("div", null, /*#__PURE__*/React__default["default"].createElement("h1", null, "Hello from React in Moodle!"), /*#__PURE__*/React__default["default"].createElement("p", null, "This is a React component rendered inside a Moodle Mustache template."));
    }

    // Define the entry point for Moodle's AMD loader
    function init() {
      let selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#firstapp-root';
      const rootElement = document.querySelector(selector);
      if (rootElement) {
        const root = ReactDOM__default["default"].createRoot(rootElement);
        root.render(/*#__PURE__*/React__default["default"].createElement(FirstApp, null));
      } else {
        console.error(`Could not find element with selector "${selector}"`);
      }
    }

    exports.init = init;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
