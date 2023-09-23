Tabs.translation.registerSetup(() => {
    Tabs.translation.table = function () {
        let container = createContainer();
        container.classList.add("translation-table_container")

        let tableElement = createDiv(container, "translation-table");

        let generateNextButton = createElement("button", ["class", "translation_generate_next hidden"], it => {
            it.innerHTML = BUNDLE["press-enter-to-generate-next"]
            it.onclick = () => {
                gotoTab(Tabs.translation)
            }
        });
        container.appendChild(generateNextButton)
        createDiv(tableElement, "")
        let currentPosition = {x: -1, y: -1, z: -1}
        let myListeners = []

        function invokeListeners() {
            let acid = BIO.AminoAcid.matrix[currentPosition.x][currentPosition.y][currentPosition.z]
            for (let i = 0; i < myListeners.length; i++) {
                myListeners[i](currentPosition.x, currentPosition.y, currentPosition.z, acid)
            }
        }

        function drawBackground(
            elm /*HTMLCanvasElement*/,
            posx /*nu*/,
            posy /*Int*/,
            posz /*Int*/,
            firstLayerIndex /*Int*/,
            secondLayerIndex /*Int*/,
            thirdLayerIndex /*Int*/,
            selection /*Boolean*/,
            time /*Float*/,) {
            MAIN_WINDOW.backgroundDrawer.draw(elm, posx, posy, posz, firstLayerIndex, secondLayerIndex, thirdLayerIndex, selection, time)
        }

        let myControlButtons = {x: [[]], y: [[]], z: [[], [], [], []]}

        function listener(property, self, idxMapper) {
            return () => {
                let currentValue = currentPosition[property];
                if (currentValue == -1) {
                    currentPosition[property] = self
                } else if (currentValue != self) {
                    tableElement.children[idxMapper(currentValue)].dataset.pressed = "0";
                    currentPosition[property] = self
                } else {
                    currentPosition[property] = -1
                }
                tableElement.dataset["current" + property] = "" + currentPosition[property]
                updateBackground(false)
            }
        }


        let backgroundUpdates = []
        backgroundUpdates.cords = [
            [[], [], [], []],
            [[], [], [], []],
            [[], [], [], []],
            [[], [], [], []]
        ]

        function updateBackground(automatic = true, first = false) {
            if (automatic && !first) {
                if (currentPosition.x !== -1 && currentPosition.y !== -1 && currentPosition.z !== -1) {
                    backgroundUpdates.cords[currentPosition.x][currentPosition.y][currentPosition.z]()
                }
            } else {
                if (!automatic || first || currentPosition.x !== -1 && currentPosition.y !== -1 && currentPosition.z !== -1) {

                    let drawer = MAIN_WINDOW.backgroundDrawer;
                    drawer.paneOutlineColor = "#454545"
                    drawer.paneBackgroundColor = "rgba(0,0,0,0.4)"

                    if (currentPosition.x > -1) {
                        let rna = BIO.Nucleotide.rnaById(currentPosition.x);
                        drawer.firstLayerColor = rna.colors[2]
                        // tableElement.style.setProperty("--first-layer-color", `--${rna.enumName.toLowerCase()}-sub-color`)
                    }
                    if (currentPosition.y > -1) {
                        let rna = BIO.Nucleotide.rnaById(currentPosition.y);
                        drawer.secondLayerColor = rna.colors[0]
                        // tableElement.style.setProperty("--second-layer-color", `--${rna.enumName.toLowerCase()}-sub-color`)
                    }
                    if (currentPosition.z > -1) {
                        let rna = BIO.Nucleotide.rnaById(currentPosition.z);
                        if (currentPosition.z === currentPosition.x) {
                            drawer.thirdLayerColor = rna.colors[1]
                        } else {
                            drawer.thirdLayerColor = rna.colors[2]
                        }
                        // tableElement.style.setProperty("--third-layer-color", `--${rna.enumName.toLowerCase()}-sub-color`)
                    }
                    if (automatic && !first) {
                        for (let i = 0; i < backgroundUpdates.length; i++) {
                            let update = backgroundUpdates[i];
                            if (update.x === currentPosition.x && update.y === currentPosition.y && update.z === currentPosition.z) {
                                update()
                                break
                            }
                        }
                    } else {
                        for (let i = 0; i < backgroundUpdates.length; i++) {
                            backgroundUpdates[i]()
                        }
                    }
                }
            }
            if (SETTINGS.nucleoTableSelectionEnabled && automatic) {
                // updateBackground(true)
            }
            // console.log("upd{"+automatic+"}{"+first+"}")
        }

        {
            let disposable = Disposer.create();
            if (SETTINGS.nucleoTableSelectionEnabled) {
                onEachUpdate(disposable, updateBackground)
            }
            onUIChanges(disposable, ()=>updateBackground(false))
        }

        function addName(div, nucleo) {
            createDiv(div, "nucleotide-name").innerText = nucleo.name.charAt(0);
            div.addEventListener("click", updateBackground)
        }

        BIO.Nucleotide.rna.forEach((it, idx) => {
            let div = makeCheckedButton(nucleotideDiv(tableElement, it));
            div.className += " translation-table-label"
            addName(div, it)
            myControlButtons.y[0].push(div)

            div.addEventListener("click", listener("y", it.id, (i) => i + 1))
            // div.style.width = "128px"
            // div.style.height = "32px"

        })
        createDiv(tableElement, "")
        BIO.Nucleotide.rna.forEach((xNuc) => {
            let div = makeCheckedButton(nucleotideDiv(tableElement, xNuc), () => {
                let currentValue = currentPosition.x;
                if (currentValue === -1) {
                    currentPosition.x = xNuc.id
                } else if (currentValue !== xNuc.id) {
                    tableElement.children[6 + currentValue * 6].dataset.pressed = "0";
                    currentPosition.x = xNuc.id
                    if (currentPosition.z !== -1) tableElement.children[6 + 5 + currentValue * 6].children[currentPosition.z].dataset.pressed = "0";
                    currentPosition.z = -1
                } else {
                    if (currentPosition.z !== -1) {
                        tableElement.children[6 + 5 + currentPosition.x * 6].children[currentPosition.z].dataset.pressed = "0";
                    }
                    currentPosition.x = -1
                    currentPosition.z = -1
                }
                updateBackground(false)
            });
            div.className += " translation-table-label"
            addName(div, xNuc)
            myControlButtons.x[0].push(div)

            // div.addEventListener("click", )
            // div.addEventListener("click", listener("x", xNuc.id, (i) => 6 + i * 6))

            BIO.Nucleotide.rna.forEach((yNuc) => {
                let div = createDiv(tableElement, "translation-table-acid-container");
                for (let z = 0; z < 4; z++) {
                    let matrix = BIO.AminoAcid.matrix[xNuc.id][yNuc.id][z];
                    let wrap = create(div, "translation-table__acid-field__wrap", "div");
                    createDiv(wrap, "translation-table__acid-field__wrap-text").innerText = matrix.title
                    let canvas = create(wrap, "translation-table__acid-field__canvas", "canvas");
                    canvas.width = 8
                    canvas.height = 8
                    // canvas.width = 128
                    // canvas.height = 48
                    setTimeout(() => {
                        // canvas.style.width="var(--translation-table__acid-field__canvas-width)"
                        // canvas.style.height="var(--translation-table__acid-field__canvas-height)"
                    })
                    // let wrap1 = createDiv(canvas, "translation-table__acid-field__wrap-1");
                    // let wrap2 = createDiv(wrap1, "translation-table__acid-field__wrap-2");
                    let y = yNuc.id;
                    let x = xNuc.id;
                    wrap.addEventListener("click", () => {
                        currentPosition.x = x
                        currentPosition.y = y
                        currentPosition.z = z
                        for (let i = 0; i < 4; i++) {
                            myControlButtons.x[0][i].dataset.pressed = "" + (i === x ? 1 : 0)
                            myControlButtons.y[0][i].dataset.pressed = "" + (i === y ? 1 : 0)
                            for (let j = 0; j < 4; j++) {
                                myControlButtons.z[i][j].dataset.pressed = "" + (i === x && j === z ? 1 : 0)
                            }
                        }
                        invokeListeners()
                        updateBackground(false)
                    })
                    let upd = () => {
                        // console.log("c",currentPosition,"pos",[x,y,z])
                        let parentElement = canvas.parentElement.getBoundingClientRect();
                        let bounds = parentElement//.getBoundingClientRect();
                        let calculatedHeight = parentElement.height;
                        let calculatedWidth = parentElement.width;
                        if ((((bounds.x + calculatedWidth) % 1) >= 0.5) && (bounds.x % 1) < 0.5) calculatedWidth++
                        if ((((bounds.y + calculatedHeight) % 1) >= 0.5) && (bounds.y % 1) < 0.5) {
                            calculatedHeight++
                        }
                        if (calculatedWidth !== canvas.width || calculatedHeight !== canvas.height) {
                            let newCanvas = create(wrap, "translation-table__acid-field__canvas", "canvas");
                            newCanvas.width = calculatedWidth;
                            newCanvas.height = calculatedHeight;
                            canvas.remove()
                            canvas = newCanvas
                        }
                        drawBackground(canvas, currentPosition.x, currentPosition.y, currentPosition.z, x, y, z, SETTINGS.nucleoTableSelectionEnabled, Time.time)
                    }
                    upd.x = x
                    upd.y = y
                    upd.z = z
                    backgroundUpdates.cords[x][y][z] = upd
                    backgroundUpdates.push(upd)
                    // wrap2.dataset.wrap=z+"";
                }
            })
            let zDiv = createDiv(tableElement, "translation-table-z-label");

            BIO.Nucleotide.rna.forEach((zNuc) => {
                let div = nucleotideDiv(zDiv, zNuc);
                div.dataset.pressed = "0"
                div.className += " translation-table-label"
                addName(div, zNuc)
                myControlButtons.z[xNuc.id].push(div)
                div.addEventListener("click", () => {
                    if (currentPosition.z === -1) {
                        for (let i = 0; i < 4; i++) {
                            if (xNuc.id !== i) tableElement.children[6 + 5 + i * 6].children[zNuc.id].dataset.pressed = "0";
                            tableElement.children[6 + i * 6].dataset.pressed = "0";
                        }
                        currentPosition.z = zNuc.id
                        currentPosition.x = xNuc.id
                        tableElement.children[6 + xNuc.id * 6].dataset.pressed = "1";
                    } else if (currentPosition.z !== zNuc.id) {
                        for (let i = 0; i < 4; i++) {
                            if (xNuc.id !== i) tableElement.children[6 + 5 + i * 6].children[zNuc.id].dataset.pressed = "0";
                            tableElement.children[6 + 5 + i * 6].children[currentPosition.z].dataset.pressed = "0";
                            tableElement.children[6 + i * 6].dataset.pressed = "0";
                        }
                        currentPosition.z = zNuc.id
                        currentPosition.x = xNuc.id
                        tableElement.children[6 + xNuc.id * 6].dataset.pressed = "1";
                    } else {
                        currentPosition.z = -1
                    }
                    tableElement.dataset.currentz = "" + currentPosition.z
                    updateBackground(false)
                })

            })
            // div.style.width = "128px"
            // div.style.height = "32px"

        })
        updateBackground(true, true)
        return {
            tableElement: tableElement,
            deselect() {
                currentPosition.x = currentPosition.y = currentPosition.z = -1
                for (let i = 0; i < 4; i++) {
                    tableElement.children[1 + i].dataset.pressed = "0"
                    tableElement.children[6 + i * 6].dataset.pressed = "0"
                    for (let j = 0; j < 4; j++) {
                        tableElement.children[6 + 5 + i * 6].children[j].dataset.pressed = "0";
                    }
                }
                updateBackground(false)
            },
            generateNextButton() {
                return generateNextButton;
            },
            addClickListener(listener) {
                myListeners.push(listener)
            }
        }

    }()
})