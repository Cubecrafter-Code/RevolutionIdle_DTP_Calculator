# Revolution Idle DTP Calculator

A browser-based utility for Revolution Idle that takes a base Dilation Tree (DT), upgrade instructions, and an amount of Dilation Tree Points (DTP) and turns them into:

* **DT import strings**
* **Macro import strings**

These can directly be imported into Revolution Idle. 

The calculator supports presets, DT imports using the same format as the game, instruction imports, and local storage persistence.

## Features

* **Generate macro imports** from upgrade instructions
* **Generate DT imports**
* **Import existing DT**
* **Save custom presets**
* **Store presets** in `localStorage`
* **No backend required** (runs entirely in the browser)

## How It Works

Each preset contains:
1. A Dilation Tree (DT)
2. A set of upgrade instructions

The calculator starts from the selected DT and spends available DTP according to the instruction list. Any upgrades already present in the imported tree are automatically skipped.

**The result is:**
* A macro import string
* An updated DT import string

---

## Usage

### Generate a Macro / DT Import
1. Select a preset.
2. Enter your **DTP**.
3. Press **Calculate**.
4. Copy the generated macro / DT import manually or with the **"Macro Import"** button.

### Import a DT Tree
1. Select a preset.
2. Choose **"Import DT"**.
3. Paste the DT string.
4. Click **Save**.

### Import Instructions
1. Select a preset.
2. Choose **"Import Instructions"**.
3. Paste the instructions. 
   * *Note: Instructions are automatically converted to lowercase letters and numbers only.*
   * *Example:* `(C) 5, (M) 5-1-5-5, (T) 1-4-1-5, (B) 1-1-1-5 (B3 T2 B2, B1, M2)` turns into `c5m5155t1415b1115b3t2b2b1m2`
4. Click **Save**.

### Create a Preset
1. Choose **"Create new Preset"**.
2. Enter a name.
3. Click **Save**.

---

## DT Format

**Example:**
```text
C3;T1415;M2535;B3234
```

**Legend:**
* **C** = Center
* **T** = Top
* **M** = Middle
* **B** = Bottom

The DT output uses the exact same format as the DT input, matching the native format used in *Revolution Idle*.

---

## Running Locally

Clone the repository:
```bash
git clone https://github.io
```

Open the project folder and serve it with any static web server. For example, using Python:
```bash
python -m http.server
```
Then open your browser and navigate to: `http://localhost:8000`

### Example
* **Input DTP:** `65`
* **Input Preset:** `DP`
* **Output:** `DTU(CENTER, ...)` / `DTU(MIDDLE, ...)` and `C5;T1,5,1,5;M5,5,5,5;B5,5,5,5`

---

## Testing

The project includes manual tests, parser validation tests, roundtrip tests, and fuzz testing to verify import/export stability.

To run the tests:
1. Uncomment `<script src="tests.js"></script>` in your `index.html`.
2. Move `points`, `stringToArray`, and `arrayToMacro` out of the `calc()` function scope into the **global scope** so the test file can access them.
3. Open the browser developer console.
4. Run either:
   * `RUN_ALL_TESTS();`
   * `FUZZ_IMPORTTREE();`

---

## Contributing

Bug reports, suggestions, and pull requests are welcome.

**Project Maintenance:**
* I will still fix bugs and issues if any are found or reported.
* I am not planning to add major new features or large extensions myself.
* For major reworks or significant expansions, you are welcome to take over development and maintain a fork.

---

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
