import React from 'local_mooreact/react';
import ReactDOM from 'local_mooreact/react-dom';

// Define your main component
function FirstApp() {
    return (
        <div>
            <h1>Hello from React in Moodle!</h1>
            <p>This is a React component rendered inside a Moodle Mustache template.</p>
        </div>
    );
}

// Define the entry point for Moodle's AMD loader
export function init(selector = '#firstapp-root') {
    const rootElement = document.querySelector(selector);
    if (rootElement) {
        const root = ReactDOM.createRoot(rootElement);
        root.render(<FirstApp />);
    } else {
        console.error(`Could not find element with selector "${selector}"`);
    }
}