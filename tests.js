
      function test(name, result, expected) {
        const pass = JSON.stringify(result) === JSON.stringify(expected);

        console.log(
          `${pass ? "✅" : "❌"} ${name}`,
          "\nResult:",
          result,
          "\nExpected:",
          expected,
          "\n",
        );
      }

      function importTree_TEST() {
        console.group("importTree_TEST");

        test("Empty tree", importTree("C0;T0000;M0000;B0000"), {
          c: [0],
          t: [0, 0, 0, 0],
          m: [0, 0, 0, 0],
          b: [0, 0, 0, 0],
        });

        test("Filled tree", importTree("C5;T1234;M4321;B5555"), {
          c: [5],
          t: [1, 2, 3, 4],
          m: [4, 3, 2, 1],
          b: [5, 5, 5, 5],
        });

        console.log("Missing branch", importTree("C0;T0000;M0000"));

        console.log("Duplicate branch", importTree("C0;T0000;T1111;B0000"));

        console.log("Wrong order", importTree("T1234;C5;M4321;B5555"));

        console.log("No semicolons", importTree("C0T0000M0000B0000"));

        console.log("Garbage", importTree("hello world"));

        console.log("Unicode", importTree("C0;T0000;M😀000;B0000"));

        console.groupEnd();
      }

      function treeToImport_TEST() {
        console.group("treeToImport_TEST");

        const tree1 = {
          c: [0],
          t: [1, 2, 3, 4],
          m: [4, 3, 2, 1],
          b: [5, 5, 5, 5],
        };

        const exported = treeToImport(tree1);

        test("Roundtrip", importTree(exported), tree1);

        console.groupEnd();
      }

      function stringToArray_TEST() {
        console.group("stringToArray_TEST");

        test("Center", stringToArray("(C) 5"), [
          {
            axis: "c",
            upg: [5],
          },
        ]);

        test("Normal branch", stringToArray("(M) 5-1-5-5"), [
          {
            axis: "m",
            upg: [5, 1, 5, 5],
          },
        ]);

        test("Shorthand", stringToArray("(B3)"), [
          {
            axis: "b",
            upg: [0, 0, 5, 0],
          },
        ]);

        test("Multiple shorthand", stringToArray("(B3 T2 M4)"), [
          {
            axis: "b",
            upg: [0, 0, 5, 0],
          },
          {
            axis: "t",
            upg: [0, 5, 0, 0],
          },
          {
            axis: "m",
            upg: [0, 0, 0, 5],
          },
        ]);

        console.log("Empty string", stringToArray(""));

        console.log("Garbage", stringToArray("hello world"));

        console.groupEnd();
      }

      function arrayToMacro_TEST() {
        console.group("arrayToMacro_TEST");

        const tree = {
          c: [0],
          t: [0, 0, 0, 0],
          m: [0, 0, 0, 0],
          b: [0, 0, 0, 0],
        };

        let points = 65;

        const result = arrayToMacro(stringToArray("(C) 1"), tree, points);

        console.log("Single center upgrade", result);

        console.groupEnd();
      }

      function roundTrip_TEST() {
        console.group("roundTrip_TEST");

        const trees = [
          {
            c: [0],
            t: [0, 0, 0, 0],
            m: [0, 0, 0, 0],
            b: [0, 0, 0, 0],
          },
          {
            c: [5],
            t: [5, 5, 5, 5],
            m: [5, 5, 5, 5],
            b: [5, 5, 5, 5],
          },
          {
            c: [3],
            t: [1, 2, 3, 4],
            m: [4, 3, 2, 1],
            b: [5, 0, 5, 0],
          },
        ];

        trees.forEach((tree, i) => {
          test(`Roundtrip ${i}`, importTree(treeToImport(tree)), tree);
        });

        console.groupEnd();
      }

      function RUN_ALL_TESTS() {
        importTree_TEST();
        treeToImport_TEST();
        stringToArray_TEST();
        arrayToMacro_TEST();
        roundTrip_TEST();
      }

      function FUZZ_IMPORTTREE() {
        const chars = "CTMB0123456789;,-😀abcXYZ<>[]{}";

        for (let i = 0; i < 10000; i++) {
          let str = "";

          const len = Math.floor(Math.random() * 50);

          for (let j = 0; j < len; j++) {
            str += chars[Math.floor(Math.random() * chars.length)];
          }

          try {
            importTree(str);
          } catch (err) {
            console.error("Crash found!", str, err);
            return;
          }
        }

        console.log("No crashes found.");
      }
    