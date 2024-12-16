Tabs.translation.registerSetup(() => {
    Tabs.translation.rnaLine = function () {
        const itemWidth = 36 + 8;
        const itemHeight = 108 + 8;
        let container = createContainer("rna-line");
        let rnaLineContainer = createDiv(container, "rna-line-container");
        let rnaLineElement = createDiv(rnaLineContainer, "rna-line");
        // UI.translation.ribosome.fastPoint(window.innerWidth/2, window.innerHeight/2)

        rnaLineElement.style.cssText = CssParser.stringify(rnaLineElement.style)
        setTimeout(() => {
            onUIChanges(Disposer.create(), () => {
                let rect = rnaLineContainer.getBoundingClientRect();
                let elementRect = rnaLineElement.getBoundingClientRect();
                let delta_value = UI.isPocket() ? elementRect.height : elementRect.width;
                Tabs.translation.ribosome.grab(rect.x + rect.width / 2, rect.y, delta_value)
                document.body.style.setProperty("--rna-line-width", delta_value + "px")
                document.body.style.setProperty("--rna-line-m-width", -delta_value + "px")
            })
        })

        return {
            element: rnaLineElement,
            index: 0,
            size: 0,
            y: 0,
            x: 0,
            targetY() {
                return MAIN_WINDOW.innerHeight / 2
            },
            selectNext(duration = 100, easing = "easeInOutSine") {
                let self = this;
                if ((this.index + 1) >= this.size) {
                    rnaLineElement.children[this.index].className = 'rna-line__item'
                    return false
                }
                Tabs.translation.ribosome.animateGrab(itemWidth / 2, itemHeight, () => {
                    anime({
                        targets: rnaLineElement,
                        easing: easing,
                        duration: duration,
                        // translateY: self.y - itemHeight,
                        update(anim) {
                            let translateY = self.y - itemHeight * anim.progress / 100;
                            rnaLineElement.style.transform = "translateY(" + translateY + "px)"
                        },
                        complete(anim) {
                            // console.log(anim)
                            self.y -= itemHeight;
                            rnaLineElement.style.transform = "translateY(" + self.y + "px)"
                        }
                    })
                    rnaLineElement.children[this.index].className = 'rna-line__item'
                    rnaLineElement.children[this.index + 1].className = 'rna-line__item selected'
                    this.index++;

                }, easing, duration)
                return true;
            },
            setup(codons) {
                this.size = codons.length
                this.index = 0;
                rnaLineElement.innerHTML = ""
                for (let i = 0; i < codons.length; i++) {
                    let nucleotides = codons[i].nucleotides();
                    let item = createDiv(rnaLineElement, "rna-line__item");
                    for (let j = 0; j < nucleotides.length; j++) {
                        nucleotideDiv(item, nucleotides[j]).innerText = nucleotides[j].name.charAt(0)
                    }
                }
                rnaLineElement.children[0].className += ' selected'
            }
        }
    }()
})