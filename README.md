# React + Moodle AMD Integration (No Vite)

This plugin uses **Babel + Moodle’s built-in Grunt AMD builder** to compile React `.jsx` files into Moodle-compatible AMD modules — without needing Vite or Webpack.

---

## 📁 Folder Structure

```
amd/
├── src/
│   ├── react/            ← Your source React components (*.jsx)
│   └── react/*.js        ← Transpiled JS output (same directory)
├── build/
│   └── react/            ← Final Moodle AMD output: .min.js, .map.js, .json
```

---

## 🔧 Build Instructions

### 1. Compile JSX → plain JS + inject ESLint comment

From the Moodle root:

```bash
grunt --plugin=local_mooreact
```

This will:

- Transpile all `.jsx` files in `amd/src/react/` to `.js` using Babel
- Prepend `/* eslint-disable */` to each `.js` file
- Then trigger Moodle’s `grunt amd` system to:
    - Wrap each `.js` in a proper `define(...)` AMD wrapper
    - Output `.min.js`, `.map`, and `.json` into `amd/build/react/`

---

## 🚀 How to Load AMD Modules in Moodle

In a Mustache template:

```mustache
<div id="firstapp-root"></div>

{{#js}}
require(['local_mooreact/react/firstapp'], function(App) {
    App.init('#firstapp-root');
});
{{/js}}
```

This assumes:
- You have `firstapp.jsx` in `amd/src/react/`
- It exports an `init()` function

---

## 🧪 Development Tips

To disable JS caching in Moodle:

```php
// config.php
$CFG->cachejs = false;
$CFG->jsrev = -1;
```

Then clear cache:

```bash
php admin/cli/purge_caches.php
```

---

## 🔍 Example File Flow

| File | Role |
|------|------|
| `amd/src/react/firstapp.jsx`       | Source JSX React component |
| `amd/src/react/firstapp.js`        | Transpiled JS (includes `/* eslint-disable */`) |
| `amd/build/react/firstapp.min.js`  | Final Moodle AMD-wrapped module |
| `amd/build/react/firstapp.min.js.json` | Metadata file |

---

## ✅ Summary

| Task                      | Command |
|---------------------------|---------|
| Transpile & inject ESLint | `grunt --plugin=local_mooreact` |
| Use in Moodle template    | `require(['local_mooreact/react/firstapp'], fn)` |

---

Let me know if you'd like to add TypeScript support or support for SCSS modules in this pipeline!