/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom/client';

// Define your main component
function FirstApp() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Hello from React in Moodle!"), /*#__PURE__*/React.createElement("p", null, "This is a React component rendered inside a Moodle Mustache template."));
}

// Define the entry point for Moodle's AMD loader
export function init() {
  let selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#firstapp-root';
  const rootElement = document.querySelector(selector);
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(/*#__PURE__*/React.createElement(FirstApp, null));
  } else {
    console.error(`Could not find element with selector "${selector}"`);
  }
}
