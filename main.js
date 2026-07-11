/*
Main flow:

- User selects preset
- Preset provides tree + instructions
- Instructions are parsed
- DTP are spent according to instructions
- Macro output generated
- DT output generated
*/

document.getElementById("calc").onclick = calc;
[...document.getElementsByClassName("outputButton")].forEach(
  (element) => (element.onclick = copy),
);

const dtpInput = document.getElementById("dtpInput");
const macroOutput = document.getElementById("macroOutput");
const dtOutput = document.getElementById("dtOutput");
const choosePreset = document.getElementById("choosePreset");
const inputModeContainer =
  document.getElementById("inputModeContainer");
const presetInput = document.getElementById("presetInput");
const savePresetButton = document.getElementById("savePresetButton");
const presetHeader = document.getElementById("presetHeader");

const maxUpg = 5;

let macro = "";

let savedTrees = (() => {
  try {
    return JSON.parse(localStorage.getItem("savedTrees"));
  } catch (err) {
    console.error(err);
    localStorage.removeItem("savedTrees");
    return null;
  }
})();

let currentTree = {
  c: [0],
  t: [0, 0, 0, 0],
  m: [0, 0, 0, 0],
  b: [0, 0, 0, 0],
};

if (
  !savedTrees ||
  Object.keys(savedTrees).length === 0 ||
  typeof savedTrees !== "object" ||
  Array.isArray(savedTrees)
) {
  (async () => {
    return await (
      await fetch(
        `/${window.location.pathname.split("/")[1]}/default.JSON`,
      )
    ).json();
  })().then((result) => {
    savedTrees = result;

    loadPresets();
  });
} else {
  loadPresets();
}

//Preset functions

function loadPresets() {
  choosePreset.replaceChildren();
  Object.keys(savedTrees).forEach((element) => {
    const newPresetButton = document.createElement("button");
    newPresetButton.onclick = changePreset;
    const newPresetButtonInnerText = document.createElement("p");
    newPresetButtonInnerText.innerText = element;
    newPresetButton.append(newPresetButtonInnerText);
    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "selectPreset";
    radioInput.className = "radioInput";
    newPresetButton.append(radioInput);
    choosePreset.append(newPresetButton);
  });
}

function changePreset(e) {
  select(e, true);
  displayTreeAndInstructions(
    savedTrees[e.currentTarget.innerText].tree,
  );
}

function select(e, radio) {
  if (radio) {
    e.currentTarget.children[1].checked = true;
  }

  const selected = getSelectedElement(e.currentTarget.parentNode);
  if (selected) {
    selected.className = "";
  }

  e.currentTarget.className = "selected";
}

function getSelectedElement(parentNode) {
  return [...document.getElementsByClassName("selected")].find(
    (element) => element.parentNode === parentNode,
  );
}

function changeInputMode(e, mode) {
  select(e, true);

  savePresetButton.innerText =
    getSelectedElement(inputModeContainer).innerText ===
    "Create new Preset"
      ? "Save or Remove Preset"
      : "Save to Preset";

  presetInput.placeholder = `Enter ${mode}`;
}

function managePresets(e) {
  let selectedPreset = getSelectedElement(choosePreset)?.innerText;

  if (!getSelectedElement(inputModeContainer)) {
    return alert("Please select an input mode");
  }

  switch (getSelectedElement(inputModeContainer).innerText) {
    case "Import DT": {
      if (!selectedPreset) {
        return alert("Please select a preset");
      }
      let newTree = importTree(presetInput.value);
      if (!newTree) {
        return alert(
          "Please paste the DT in the \nExpected Format: C3;T1415;M2535;B3234",
        );
      }
      savedTrees[selectedPreset].tree = newTree;
      break;
    }
    case "Import Instructions": {
      if (!selectedPreset) {
        return alert("Please select a preset");
      }
      savedTrees[selectedPreset].instructions = presetInput.value;
      break;
    }
    case "Create new Preset": {
      const newPresetButton = document.createElement("button");
      newPresetButton.onclick = changePreset;
      const newPresetButtonInnerText = document.createElement("p");
      newPresetButtonInnerText.innerText = presetInput.value;
      newPresetButton.append(newPresetButtonInnerText);
      const radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "selectPreset";
      radioInput.className = "radioInput";
      newPresetButton.append(radioInput);
      choosePreset.append(newPresetButton);

      presetInput.value = newPresetButton.innerText;

      if (Object.keys(savedTrees).includes(newPresetButton.innerText)) {
        delete savedTrees[newPresetButton.innerText];
        choosePreset.removeChild(newPresetButton);

        loadPresets();
        localStorage.setItem("savedTrees", JSON.stringify(savedTrees));

        return;
      }

      if (newPresetButton.innerText === "") {
        delete savedTrees[selectedPreset];
        choosePreset.removeChild(newPresetButton);
        loadPresets();
        localStorage.setItem("savedTrees", JSON.stringify(savedTrees));
        return;
      }

      savedTrees[newPresetButton.innerText] = {
        instructions: "",
        tree: {
          c: [0],
          t: [0, 0, 0, 0],
          m: [0, 0, 0, 0],
          b: [0, 0, 0, 0],
        },
      };
      select({ currentTarget: newPresetButton }, true);
      selectedPreset = newPresetButton.innerText;
    }
  }
  localStorage.setItem("savedTrees", JSON.stringify(savedTrees));

  presetHeader.innerText = `${treeToImport(savedTrees[selectedPreset].tree)}\n${
    savedTrees[selectedPreset].instructions
  }`;
}

function importTree(str) {
  str = str.replaceAll(/[^ctmb;\d]/gi, "").toLowerCase();
  let newTree = {};
  if (str.replaceAll(/[^;]/g, "").length !== 3) {
    console.error(new Error(`wrong ; format ${str}`));
    return;
  }

  str.split(";").forEach((element) => {
    if (
      !(
        element.length ===
        (element[0] === "c" || element[0] === "C" ? 2 : 5)
      ) ||
      !(element.length === 2
        ? /[CTMBctmb][\d]/g.test(element)
        : /[CTMBctmb][\d]{4}/g.test(element))
    ) {
      console.error(`wrong element format ${element}`);
      return;
    }
    newTree[element[0].toLowerCase()] = element
      .slice(1, element.length)
      .split("")
      .map((element) => Number(element));
  });

  if (!["c", "t", "m", "b"].every((key) => key in newTree)) {
    console.error(
      new Error(
        `wrong tree format: missing branches ${JSON.stringify(newTree)}`,
      ),
    );
    return;
  }

  Object.entries(newTree).forEach((element) => {
    if (!(element[1].length === (element[0] === "c" ? 1 : 4))) {
      console.error(new Error("wrong tree format: invalid length"));
      return;
    }
  });

  displayTreeAndInstructions(newTree);
  return newTree;
}

//inbetween preset and calc functions aka frontend functions

function displayTreeAndInstructions(tree) {
  presetHeader.innerText = `${treeToImport(tree)}\n${
    savedTrees[getSelectedElement(choosePreset).innerText].instructions
  }`;
}

function treeToImport(tree) {
  return Object.entries(tree)
    .join(";")
    .toUpperCase()
    .replaceAll(/\D,\d/g, (match) => match.replace(",", ""));
}

function deselectOutputButtons() {
  document.getElementById("calc").onclick = calc;
  [...document.getElementsByClassName("outputButton")].forEach(
    (element) => (element.className = "outputButton")
  );
}

//calc functions

function calc() {
  const currentInstructions =
    savedTrees[getSelectedElement(choosePreset)?.innerText];

  if (!currentInstructions) {
    return alert("Please select a preset");
  }

  if (!dtpInput.value) {
    dtpInput.value = 65; //65: Max DTP
  }

  currentTree = structuredClone(currentInstructions.tree);
  let points = Number(dtpInput.value);

  macro = arrayToMacro(stringToArray(currentInstructions.instructions));
  macro = macro.slice(0, macro.length - 1);

  macroOutput.children[0].innerText = `Macro Import:\n${macro}`;
  dtOutput.children[0].innerText = `DT Import: \n ${treeToImport(currentTree)}${points > 0 ? `\n Remaining points: ${points}` : ""}`;

  deselectOutputButtons();

  function stringToArray(str) {
    str = str.replaceAll(/[^ctmb\d]/gi, "").toLowerCase();
    console.log(str);
    let instructionArr = [];

    let axisArr = str.split(/\d+/g);

    str.split(/\D/g).forEach((num, index) => {
      if (index === 0) {
        return;
      }
      instructionArr.push({
        axis: axisArr[index - 1],
        upg:
          axisArr[index - 1] !== "c" && num.length === 1
            ? (() => {
                let tempUpgArr = [0, 0, 0, 0];
                tempUpgArr[num - 1] = maxUpg;
                return tempUpgArr;
              })()
            : [...num].map((char) => Number(char)),
      });
    });
    return instructionArr;
  }

  function arrayToMacro(arr) {
    let macroStr = "";
    for (let n = 0; n < arr.length; n++) {
      let axis;
      switch (arr[n].axis) {
        case "c": {
          axis = "CENTER";
          break;
        }
        case "t": {
          axis = "TOP";
          break;
        }
        case "m": {
          axis = "MIDDLE";
          break;
        }
        case "b": {
          axis = "BOTTOM";
          break;
        }
      }
      arr[n].upg.forEach((element, index) => {
        for (let i = 0; i < element; i++) {
          if (points < 1) {
            return;
          }
          if (currentTree[arr[n].axis][index] > i) {
            continue;
          }
          macroStr += `DTU(${axis}, ${index}, ${i})\n`;
          currentTree[arr[n].axis][index]++;
          points--;
        }
      });
    }

    return macroStr;
  }
}

function copy(e) {
  if (macro === "") {
    alert("Start with a calculation");
    return;
  }
  select(e, false);
  e.currentTarget.className += " outputButton";
  switch (e.currentTarget.innerText.replace(" import", "")) {
    case "DT":
      navigator.clipboard.writeText(treeToImport(currentTree));
      break;
    case "Macro":
      navigator.clipboard.writeText(macro);
  }
}