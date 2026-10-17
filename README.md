# MILKWAY

**TANZIM'S second website.**

A black-themed, responsive math and computing toolkit with two browser-based tools:

1. Scientific Calculator
2. Number System Converter (Binary, Octal, Decimal, Hexadecimal)

## Features

- Responsive layout for mobile and desktop
- Scientific expressions: `+`, `-`, `×`, `÷`, `%`, powers (`^`), factorial (`!`), `sin`, `cos`, `tan`, `sqrt` via `√(...)`, `log`, `ln`, `pi`, and `e`
- Degree/radian toggle for trigonometric functions
- Number conversion with large integer support using JavaScript `BigInt`
- Copy conversion results
- Offline cache through a service worker after the first successful visit over HTTPS or localhost
- Companion C source files for learning the core algorithms

## Run locally

Open `index.html` in a modern browser. Most features work without a server. For service-worker/offline testing, run a local HTTP server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a repository named `MILKWAY` (or your preferred repository name) on GitHub.
2. Upload all files and folders while preserving the directory structure.
3. Open **Settings → Pages**.
4. Under build/deployment, select **Deploy from a branch**.
5. Select the `main` branch and `/(root)` folder, then save.
6. Wait for GitHub Pages to publish the site. The URL is shown in the Pages settings.

## C learning files

- `c-programs/scientific_calculator.c`
- `c-programs/number_converter.c`

Compile the calculator on a system with GCC:

```bash
gcc c-programs/scientific_calculator.c -o calculator -lm
```

Compile the converter:

```bash
gcc c-programs/number_converter.c -o converter
```

**Important:** The deployed website currently runs its interactive calculations in JavaScript. The `.c` files are companion learning implementations and are not yet compiled to WebAssembly or linked into the browser UI. A future version can use Emscripten to compile C to WebAssembly and connect it to the website.

## License

You may use and modify this starter project for your learning. Add a license file if you plan to distribute it publicly.
