# Revolution Idle DTP Calculator

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/cc30711c-b35f-4e57-a41b-9cc849e35c8a" />


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

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/db083ede-d531-4b2f-9207-194c7e0643cb" />

### Generate a Macro / DT Import
1. Select a preset from the **blue box**.
2. Enter your **DTP** into the **magenta input** field (the default value is 65 if cleared).
3. Press the **Calculate** button inside the **magenta box** next to the input.
4. Copy the generated macro or DT import manually, or use the **"Macro Import"** button in the **white box**.

### Import a DT Tree
1. Select a preset from the **blue box**.
2. Click **"Import DT"** (the red button inside the yellow box).
3. Paste your DT string into the input field below it (the second line of the yellow box).
4. Click **Save to Preset** (the third line of the yellow box).
5. Your starting DT will now be visible in the red box located below the **Save to Preset** button.

### Import Instructions
1. Select a preset from the **blue box**.
2. Click **"Import Instructions"** (the green button inside the yellow box).
3. Paste your instructions into the input field (the second line of the yellow box). 
   * *Note: Instructions are automatically sanitized to lowercase letters and numbers only.*
   * *Example:* `(C) 5, (M) 5-1-5-5, (T) 1-4-1-5, (B) 1-1-1-5 (B3 T2 B2, B1, M2)` automatically cleans up and turns into `c5m5155t1415b1115b3t2b2b1m2`.
4. Click **Save to Preset**.
5. Your instructions will now be visible in the green box located below the **Save to Preset** button.

### Create a Preset
1. Click **"Create new Preset"** (the blue button inside the yellow box).
2. Enter a name into the input field (the second line of the yellow box).
3. Click **Save or Remove Preset**.
4. Your new preset will now appear in the selection layout within the blue box at the top.

### String-to-Paragraph (`innerText`) Quirks & Examples
When **creating a preset name**, the input string is handled safely by the browser using the DOM's `innerText` property. This approach automatically sanitizes inputs to prevent breaking the layout, leading to specific behavioral quirks:

* **HTML and Script Safety:** Any HTML tags are treated as raw text and will not execute as code.
  * *Example:* Entering `<b>Alpha</b>` stays exactly as `<b>Alpha</b>` rather than rendering in bold text.
* **Whitespace Collapse:** Multiple consecutive spaces, tabs, or line breaks are normalized into a single space character inside the layout.
  * *Example:* Entering `My    Preset  Name` will be displayed as `My Preset Name`.
* **Special Characters & Symbols:** Universal characters, emojis, and symbols are fully preserved without issues.
  * *Example:* Entering `🔥 Dilation_Phase-2! 🚀` will display exactly as written.

### Deleting a Preset
You can delete a custom preset using either of the following two methods:

#### Method 1: Delete by Name
1. Click **"Create new Preset"** (the blue button inside the yellow box).
2. Enter the exact name of the preset you wish to remove into the input field (the second line of the yellow box).
3. Click **Save or Remove Preset**.
4. The preset will disappear from the selection layout within the blue box at the top.

#### Method 2: Delete by Selection
1. Click **"Create new Preset"** (the blue button inside the yellow box).
2. Ensure the input field (the second line of the yellow box) is completely clear.
3. Select the preset you wish to delete from the **blue box** at the top.
4. Click **Save or Remove Preset**.
5. The preset will disappear from the selection layout within the blue box at the top.

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
