Tabs.transcription.registerSetup(()=>{
    Tabs.transcription.dnaLine = function () {
        let dnaLineElement = createDiv(createContainer(), "dna-line")
        let mainElement = createDiv(dnaLineElement, "dna-line__main");
        let mainLeftElement = createDiv(mainElement, "dna-line__main__left");
        let mainRightElement = createDiv(mainElement, "dna-line__main__right");


        createDiv(mainLeftElement, "dna-line__main__title").innerText = BUNDLE["dna-first"]
        createDiv(mainLeftElement, "dna-line__main__title").innerText = BUNDLE["dna-second"]
        createDiv(mainLeftElement, "dna-line__main__title").innerText = BUNDLE["rna"]


        let dna1 = createDiv(mainRightElement, "dna-line__main__dna1");
        let dna2 = createDiv(mainRightElement, "dna-line__main__dna2");
        let rna = createDiv(mainRightElement, "dna-line__main__rna");
        let mySolutions = []

        function elementAt(index) {
            let length = mySolutions.length / 2
            if (index >= length) {
                index = index - length
                return rna.children[index + Math.floor(index / 3)];
            } else {
                return dna2.children[index + Math.floor(index / 3)];
            }
        }

        let self = {
            element: dnaLineElement,
            selection: 0,
            dnaNucleotides: [],
            index: 0,
            select(newIndex, makeEnabled = false) {
                let length = this.dnaNucleotides.length;
                if (this.index === newIndex) {
                    this.index = -1
                } else if (this.index === -1) {
                    this.index = newIndex
                } else {
                    this.index = newIndex
                    for (let j = 0; j < length + Math.floor(length / 3); j++) {
                        if ((j + 1) % 4 === 0) continue
                        if (j !== newIndex || makeEnabled) dna2.children[j].children[0].dataset.pressed = "0"
                        if (j !== newIndex - length || makeEnabled) rna.children[j].children[0].dataset.pressed = "0"
                    }
                }
                if (makeEnabled && newIndex !== -1) {
                    elementAt(newIndex).children[0].dataset.pressed = "1"
                }
            },
            setup(dnaNucleotides) {
                mySolutions = []
                this.index = 0;
                this.dnaNucleotides = dnaNucleotides
                dna1.innerHTML = ""
                dna2.innerHTML = ""
                rna.innerHTML = ""
                let offset = dnaNucleotides.length;

                function addField(myParent, myIndex) {
                    let myField = createDiv(myParent, "dna-line__main__field");

                    let myButton = create(
                        myField,
                        "dna-nucleotide-background",
                        "div"
                    )
                    // create(myField,"dna_line__main__field__text","p").innerText="?"
                    myButton.innerText="?"
                    let myMarker = create(myField, "dna-nucleotide-background2", "p");
                    myMarker.disabled = true
                    myMarker.addEventListener("mouseover", () => {
                        myButton.dataset.hover = "1"
                    })
                    myMarker.addEventListener("mouseleave", () => {
                        myButton.dataset.hover = "0"
                    })
                    myMarker.addEventListener("click", () => {
                        self.select(myIndex, true)
                    })
                }

                for (let i = 0; i < dnaNucleotides.length; i++) {
                    mySolutions.push(undefined)
                    mySolutions.push(undefined)
                    createDiv(dna1, "dna-line__main__field").innerText = dnaNucleotides[i].name.charAt(0)
                    addField(dna2, i)
                    addField(rna, i + offset)

                    if ((i + 1) % 3 === 0 && i + 1 < dnaNucleotides.length) {
                        createDiv(dna1, "dna-line__main__field").innerText = "-"
                        createDiv(dna2, "dna-line__main__field").innerText = "-"
                        createDiv(rna, "dna-line__main__field").innerText = "-"

                    }
                }
                dna2.children[0].children[0].dataset.pressed = "1"
            }
        }
        self.onClicked = function (nucleotide) {
            mySolutions[self.index] = nucleotide
            elementAt(self.index).children[1].innerText = nucleotide.charName
            this.moveRight()
        }

        self.moveLeft = function () {
            self.select((self.index + self.dnaNucleotides.length * 2 - 1) % (self.dnaNucleotides.length * 2), true)
        }

        self.moveRight = function () {
            self.select((self.index + 1) % (self.dnaNucleotides.length * 2), true)
        }
        self.moveUp = function () {
            self.select((self.index + self.dnaNucleotides.length) % (self.dnaNucleotides.length * 2), true)
        }
        self.moveDown =function () {
            self.select((self.index + self.dnaNucleotides.length) % (self.dnaNucleotides.length * 2), true)
        }

        self.check = function () {
            let prevAnimation = undefined
            return function (callback = undefined) {
                let length = self.dnaNucleotides.length
                let errored = []
                for (let i = 0; i < length; i++) {
                    let dnaSolution = mySolutions[i]
                    let rnaSolution = mySolutions[i + length]

                    if (dnaSolution === undefined) errored.push(i)
                    if (rnaSolution === undefined) errored.push(i + length)
                    // noinspection EqualityComparisonWithCoercionJS
                    if (rnaSolution !== undefined && rnaSolution != BIO.Nucleotide.rna[self.dnaNucleotides[i].id]) {

                        errored.push(i + length)
                    }
                    // noinspection EqualityComparisonWithCoercionJS
                    if (dnaSolution !== undefined && dnaSolution != BIO.Nucleotide.dna[(self.dnaNucleotides[i].id + 2) % 4]) {
                        errored.push(i)
                    }
                }
                if (errored.length === 0) {
                    Tabs.announce(BUNDLE["right"], 120).style.color = "green"
                    if (callback) callback(true)
                } else {
                    for (let i = 0; i < errored.length; i++) {
                        errored[i] = elementAt(errored[i]).children[1]
                    }
                    if (prevAnimation !== undefined) {
                        prevAnimation.seek(prevAnimation.duration)
                    }
                    prevAnimation = anime({
                        targets: errored,
                        backgroundColor: ['rgba(255,0,0,1)', 'rgba(255,0,0,0)'],
                        easing: 'linear',
                        complete(anim) {
                            prevAnimation = undefined
                        }
                    });
                    Tabs.announce(BUNDLE["wrong"], 120).style.color = "red"
                    if (callback) callback(false)
                }
            }
        }()

        let myEndListeners = []

        function runEndListeners() {
            for (let i = 0; i < myEndListeners.length; i++) {
                myEndListeners[i]()
            }
        }

        (function () {
            let buttonsElement = createDiv(dnaLineElement, "dna-line__buttons");
            let nucleoButtons = createDiv(buttonsElement, "dna-line__buttons__nucleo");
            let moveButtons = createDiv(buttonsElement, "dna-line__buttons__other");
            for (let i = 0; i < BIO.Nucleotide.all.length; i++) {
                let nucleotide = BIO.Nucleotide.all[i];
                let div = nucleotideElement(nucleoButtons, "button", nucleotide);
                div.innerText = nucleotide.name + "(" + (i + 1) + ")"
                div.addEventListener("click", () => self.onClicked(nucleotide))
                // div.style.gridArea = "btn" + i
            }
            let leftButton = create(moveButtons, "dna-line__gray__button", "button");
            leftButton.innerText = "<<"
            leftButton.addEventListener("click", self.moveLeft)
            let rightButton = create(moveButtons, "dna-line__gray__button", "button");
            rightButton.innerText = ">>"
            rightButton.addEventListener("click", self.moveRight)
            let checkButton = create(moveButtons, "dna-line__gray__button", "button");
            checkButton.innerText = BUNDLE["check"]

            let endButton = create(moveButtons, "dna-line__gray__button", "button");
            endButton.innerText = BUNDLE["next-line"]
            endButton.disabled = true
            endButton.addEventListener("click", () => {
                endButton.disabled = true
                runEndListeners()
            })

            checkButton.addEventListener("click", () => {
                self.check((it) => {
                    if (it) endButton.disabled = false
                })
            })
        })()

        self.addEndListener = function (listener) {
            myEndListeners.push(listener)
        }
        return self
    }()
})