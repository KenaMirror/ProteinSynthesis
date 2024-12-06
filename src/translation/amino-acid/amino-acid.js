const AMINO_ACID_CALCULATED_SIZE = 38;
Tabs.translation.registerSetup(() => {
    Tabs.translation.aminoAcidField = function () {
        const animationSpeed = 100
        const animationEasing = 'easeInOutSine'
        let elem
        let ribosome = Tabs.translation.ribosome

        function perfectX() {
            return -elem.scrollWidth + /*MAIN.innerWidth / 2*/ribosome.right.leftX()
        }

        function perfectY() {
            return ribosome.left.y - elem.clientHeight / 2
        }

        function updateAminoAcid(dx = 0, dy = 0) {

            elem.style.transform = 'translate(' + perfectX() + 'px,' + (dy + perfectY()) + 'px)'
        }

        function init() {
            findVariable()

            updateAminoAcid()
        }

        function findVariable() {
            elem = document.querySelector(".amino-acid-field")
        }

        let container = createContainer();
        elem = createDiv(container, "amino-acid-field");
        setTimeout(init, 0)
        ribosome.right.addMoveListener((x, y) => {
            var self = Tabs.translation.aminoAcidField;
            let deltaY;
            if ((self.index % 2) === 0) {
                deltaY = 32
            } else {
                deltaY = -32
            }
            let newX = x + ribosome.right.width - elem.scrollWidth/* + */;
            let newY = y - elem.clientHeight / 2;
            if (self.currentAnimation !== undefined) {
                let animations = self.currentAnimation.animations;
                for (let i = 0; i < animations.length; i++) {
                    // console.log(animations[i].animatable.transforms.list)
                    // console.log()
                    // animations[i].animatable.transforms.list[0].value=
                    animations[i].animatable.transforms.list.set("translate", '' + newX + 'px,' + newY + 'px')
                }
            } else {
                let transform = 'translate(' + newX + 'px,' + newY + 'px) translateX(' + (self.index * AMINO_ACID_CALCULATED_SIZE) + 'px) translateY(' + deltaY + "px)";
                //"translate("+newX+"px, "+newY+"px) translateX(228px) translateY(32px)"
                // console.log(transform)
                elem.style.transform = transform
            }
        })
        return {
            index: 0,
            size: 0,
            animations: true,
            currentAnimation: undefined,
            myTimeline: undefined,
            getElem: function () {
                return elem
            },
            hasLock: function () {
                return this.currentAnimation != null
            },
            showNext: function (duration = animationSpeed, easing = animationEasing) {
                elem.children[this.size - 1 - this.index].style = ""
                let deltaY;
                if ((this.index % 2) === 0) {
                    deltaY = -32
                } else {
                    deltaY = 32
                }
                if (!this.animations) {
                    updateAminoAcid(this.index * AMINO_ACID_CALCULATED_SIZE + AMINO_ACID_CALCULATED_SIZE, deltaY)
                } else {
                    let self = this
                    if (this.currentAnimation !== undefined) {
                        this.currentAnimation.seek(this.currentAnimation.duration)
                        // this.currentAnimation.pause()
                    }
                    this.currentAnimation = anime({
                        targets: elem,
                        translateX: this.index * AMINO_ACID_CALCULATED_SIZE + AMINO_ACID_CALCULATED_SIZE,
                        translateY: deltaY,
                        duration: duration,
                        easing: easing,
                        complete: function (anim) {
                            self.currentAnimation = undefined;
                        },
                        begin: function (anim) {
                            self.currentAnimation = anim;
                        }
                    })
                    // console.log(this.currentAnimation)
                }
                elem.scrollLeft += AMINO_ACID_CALCULATED_SIZE;
                if ((this.size - 1) === this.index) return false
                this.index++;
                return true;
            },
            setup: async function (aminoAcids) {
                while (elem === undefined) {
                    console.log("sleep")
                    await sleep(1)
                }
                this.index = 0;
                this.size = aminoAcids.length
                elem.innerHTML = ""
                for (let i = aminoAcids.length - 1; i >= 0; i--) {
                    let name = aminoAcids[i].name;
                    let extraStyle = (((i + 1) % 2) === 0) ? " amino-acid-offset amino-idx" : " amino-idx"
                    extraStyle += i
                    let newElem = document.createElement('div')
                    newElem.className = "amino-acid__container" + extraStyle
                    newElem.style.opacity = "0";
                    newElem.innerHTML = "<div class=\"amino-acid\">\n" +
                        "                <div class=\"amino-acid__inner\">\n" +
                        "                    <div class=\"amino-acid__inner__text\">" + name + "</div>\n" +
                        "                </div>\n" +
                        "            </div>"
                    elem.append(newElem)
                    /*elem.insertAdjacentHTML('afterend',
                        "<div class=\"amino-acid__container" + extraStyle + "\" style=\"opacity: 0\">\n" +
                        "            <div class=\"amino-acid\">\n" +
                        "                <div class=\"amino-acid__inner\">\n" +
                        "                    <div class=\"amino-acid__inner__text\">" + name + "</div>\n" +
                        "                </div>\n" +
                        "            </div>\n" +
                        "        </div>")*/
                }
                setTimeout(init, 0)
            }
        }
    }()
})