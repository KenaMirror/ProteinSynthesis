Tabs.translation.registerSetup(() => {
    Tabs.translation.table = function () {
        let container = createDiv(createContainer(),"translation-table_container");


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
        /**@type HTMLDivElement[][]*/
        backgroundUpdates.wraps = [[], [], [], []]

        /**
         * @param {number} radians
         * @param {number} scl
         * @param {number} mag
         */
        function main$draw$sin(radians, scl, mag) {
            return Math.sin(radians / scl) * mag;
        }

        /**@param time {number}*/
        function mySin(time) {
            return Math.max(0.0, main$draw$sin(time, 16.0, 1.0)) * 0.9 + 0.1;
        }

        function updateBackground(automatic = true, first = false) {
            let hasSelection = currentPosition.x !== -1 && currentPosition.y !== -1 && currentPosition.z !== -1;
            if (automatic && !first) {
                if (hasSelection) {
                    backgroundUpdates.cords[currentPosition.x][currentPosition.y][currentPosition.z]()
                }
            } else {
                if (!automatic || first || hasSelection) {


                    if (currentPosition.x > -1) {
                        let rna = BIO.Nucleotide.rnaById(currentPosition.x);
                        tableElement.style.setProperty("--tmp-first-color", rna.colors[2]);
                    }
                    if (currentPosition.y > -1) {
                        let rna = BIO.Nucleotide.rnaById(currentPosition.y);
                        tableElement.style.setProperty("--tmp-second-color", rna.colors[0]);
                    }
                    if (currentPosition.z > -1) {
                        let rna = BIO.Nucleotide.rnaById(currentPosition.z);
                        if (currentPosition.z === currentPosition.x) {
                            tableElement.style.setProperty("--tmp-third-color", rna.colors[1]);
                        } else {
                            tableElement.style.setProperty("--tmp-third-color", rna.colors[2]);
                        }
                    }
                    for (let i = 0; i < backgroundUpdates.wraps.length; i++) {
                        let divs = backgroundUpdates.wraps[i];
                        let className = "translation-table__acid-field__horiz_big";
                        let force = i === currentPosition.x;
                        for (let div of divs) {
                            div.classList.toggle(className, force)
                        }
                    }
                    for (let i = 0; i < backgroundUpdates.length; i++) {
                        backgroundUpdates[i]()
                    }
                }
            }
            let style=tableElement.style
            if (SETTINGS.nucleoTableSelectionEnabled && hasSelection) {
                let pi = Math.PI;
                let delta = 8 * pi;
                let time=Time.time
                let alphaFirst = mySin(time);
                let alphaSecond = mySin(time - delta);
                let alphaThird = mySin(time - 2 * delta);
                style.setProperty("--anim-accent-1", 'rgba(255, 211, 127, ' + alphaFirst + ')');
                style.setProperty("--anim-accent-2", 'rgba(255, 211, 127, ' + alphaSecond + ')');
                style.setProperty("--anim-accent-3", 'rgba(255, 211, 127, ' + alphaThird + ')');
                // updateBackground(true)
            } else {
                style.setProperty("--anim-accent-1", '#00000000');
                style.setProperty("--anim-accent-2", '#00000000');
                style.setProperty("--anim-accent-3", '#00000000');
            }
            // console.log("upd{"+automatic+"}{"+first+"}")
        }

        {
            let disposable = Disposer.create();
            if (SETTINGS.nucleoTableSelectionEnabled) {
                onEachUpdate(disposable, updateBackground)
            }
            onUIChanges(disposable, () => updateBackground(false))
        }

        function addName(div, nucleo) {
            createDiv(div, "nucleotide-name").innerText = nucleo.name.charAt(0);
            div.addEventListener("click", updateBackground)
        }


        //region Second layer
        BIO.Nucleotide.rna.forEach((it, idx) => {
            let div = makeCheckedButton(nucleotideDiv(tableElement, it));
            div.className += " translation-table-label"
            addName(div, it)
            myControlButtons.y[0].push(div)

            div.addEventListener("click", listener("y", it.id, (i) => i + 1))
            // div.style.width = "128px"
            // div.style.height = "32px"

        })
        //endregion
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
                /**@type HTMLDivElement*/
                let div = createDiv(tableElement, "translation-table-acid-container");
                backgroundUpdates.wraps[xNuc.id][yNuc.id] = div;
                if (yNuc.id === 0) div.classList.add("translation-table__left__sided")
                if (yNuc.id === 3) div.classList.add("translation-table__right__sided")
                for (let z = 0; z < 4; z++) {
                    let matrix = BIO.AminoAcid.matrix[xNuc.id][yNuc.id][z];
                    /**@type HTMLDivElement*/
                    let wrap = create(div, "translation-table__acid-field__wrap", "div");
                    createDiv(createDiv(wrap, "translation-table__acid-field__wrap-selector"), "translation-table__acid-field__wrap-selector__sub")
                    createDiv(
                        createDiv(wrap, "translation-table__acid-field__wrap-text")
                        , "translation-table__acid-field__wrap__wrap-text")
                        .innerText = matrix.title
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
                        wrap.classList.toggle("translation-table__acid-field__vert", currentPosition.y === y)
                        if (x === currentPosition.x) wrap.classList.toggle("translation-table__acid-field__horiz_small", currentPosition.z === z)
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