const AMINO_ACID_CALCULATED_SIZE = 38;
Tabs.translation.registerSetup(() => {
    let prevAnimIsPocket = UI.isPocket();

    function translateX(self, next) {
        let deltaX;
        if (UI.isPocket()) {
            deltaX = Math.sqrt(3) * AMINO_ACID_CALCULATED_SIZE;
        } else {
            deltaX = AMINO_ACID_CALCULATED_SIZE;
        }
        if (next) return self.index * deltaX + deltaX;
        return self.index * deltaX;
    }

    function computeDeltaY(index) {
        let currentPocket = UI.isPocket();
        let isEven = (index % 2) === 0;
        let deltaY;
        // noinspection EqualityComparisonWithCoercionJS
        if (isEven == !currentPocket) {
            deltaY = -32
        } else {
            deltaY = 32
        }
        if (prevAnimIsPocket !== currentPocket) {
            deltaY = 0;
            prevAnimIsPocket = currentPocket;
        }
        return currentPocket ? 0 : deltaY;
    }

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
            let deltaY = computeDeltaY(self.index);
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
                let transform = 'translate(' + newX + 'px,' + newY + 'px) translateX(' + translateX(self, false) + 'px) translateY(' + deltaY + "px)";
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
                let deltaY = computeDeltaY(this.index + 1);


                let translateX_ = translateX(this, true);

                if (!this.animations) {
                    updateAminoAcid(translateX_, deltaY)
                } else {
                    let curIndex = this.size - 1 - this.index;

                    let self = this
                    if (this.currentAnimation !== undefined) {
                        this.currentAnimation.seek(this.currentAnimation.duration)
                        // this.currentAnimation.pause()
                    }
                    this.currentAnimation = anime({
                        targets: elem,
                        translateX: translateX_,
                        translateY: deltaY,
                        duration: duration,
                        easing: easing,
                        complete: function (anim) {
                            self.currentAnimation = undefined;
                        },
                        begin: function (anim) {
                            elem.children[curIndex].classList.toggle("hidden", false)
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
                    let newElem = document.createElement('div')
                    newElem.className = "amino-acid__container hidden amino-idx" + i
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