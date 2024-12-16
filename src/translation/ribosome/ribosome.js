(function () {
    let tmpContainer
    Tabs.translation.registerSetup(() => {

        Tabs.translation.ribosome = function () {
            const ribosomeSize = 192;
            let container = createContainer("ribosome")
            tmpContainer = container;
            let mainRibosome = createDiv(container, "ribosome")
            mainRibosome.style.opacity = "0"
            let leftRibosome = createDiv(mainRibosome, "ribosome__part ribosome__part__left")
            createDiv(leftRibosome, "ribosome__part__left__inner")
            let rightRibosome = createDiv(mainRibosome, "ribosome__part ribosome__part__right");
            createDiv(rightRibosome, "ribosome__part__right__inner")
            let ribosome = {
                animationMs: 1500,
                untilStop: async function () {
                    await this.left.untilStop()
                    await this.right.untilStop()
                },

                isMoving: function () {
                    return this.left.isMoving() || this.right.isMoving()
                },
                animationMove: function (x, y, easing = undefined, duration = undefined) {
                    this.left.animationMove(x, y, easing, duration);
                    this.right.animationMove(x, y, easing, duration);
                },
                animationPoint: function (x, y, easing = undefined, duration = undefined) {
                    this.left.animationPoint(x, y, easing, duration);
                    this.right.animationPoint(x, y, easing, duration);
                },
                fastPoint: function (x, y) {
                    this.left.fastPoint(x, y);
                    this.right.fastPoint(x, y);
                },
                fastMove: function (x, y) {
                    this.left.fastMove(x, y);
                    this.right.fastMove(x, y);
                }
            }

            function part(element, anchorX, anchorY) {
                let myAnimations = []
                let myListeners = []
                return {
                    element: element,
                    x: 0,
                    y: 0,
                    width: element.clientWidth,
                    height: element.clientHeight,
                    anchorX: anchorX,
                    anchorY: anchorY,
                    addMoveListener: function (listener) {
                        myListeners.push(listener)
                    },
                    leftX: function () {
                        return this.x + this.width
                    },

                    untilStop: async function () {
                        while (myAnimations.length > 0) {
                            await sleep(0)
                        }

                    },

                    isMoving: function () {
                        return myAnimations.length > 0
                    },
                    animationMove: function (x, y, easing = undefined, duration = undefined) {
                        this.animationPoint(() => x + this.x, () => y + this.y, easing, duration)
                    },
                    animationPoint: function (x, y, easing = undefined, duration = undefined) {
                        let self = this;
                        let index = myAnimations.length;
                        if (easing === undefined) {
                            easing = 'easeInOutSine'
                        }
                        if (duration === undefined) {
                            duration = ribosome.animationMs
                        }
                        let animationCallback = function () {
                            if (typeof x === "function") {
                                x = x()
                            }
                            if (typeof y === "function") {
                                y = y()
                            }
                            anime({
                                targets: self.element,
                                duration: duration,
                                easing: easing,
                                translateX: x - self.anchorX,
                                translateY: y - self.anchorY,
                                complete: function (anim) {

                                    self.x = x;
                                    self.y = y;
                                    if ((index + 1) < myAnimations.length) {
                                        myAnimations[index + 1]()
                                    } else {
                                        myAnimations = []
                                    }
                                    for (let i = 0; i < myListeners.length; i++) {
                                        myListeners[i](x, y)
                                    }
                                    // console.log("target: ",[x,y])
                                    // console.log(self.element.style.transform)
                                    // console.log(anim)
                                },

                                update: function (anim) {
                                    let x = parseInt(anim.animations[0].currentValue.slice(0, -2)) + self.anchorX
                                    let y = parseInt(anim.animations[1].currentValue.slice(0, -2)) + self.anchorY
                                    for (let i = 0; i < myListeners.length; i++) {
                                        myListeners[i](x, y)
                                    }
                                    // console.log([x,y])
                                    /*progressLogEl.value = 'progress : '+Math.round(anim.progress)+'%';
                                    updateLogEl.value = 'updates : '+updates;*/
                                }
                            })
                        }
                        if (myAnimations.length === 0) {
                            animationCallback()
                        }
                        myAnimations.push(animationCallback)
                    },
                    fastPoint: function (x, y) {
                        this.animationPoint(x, y, "linear", 0)
                    },
                    fastMove: function (x, y) {
                        this.animationMove(x, y, "linear", 1)
                    }
                }
            }

            ribosome.left = part(leftRibosome, ribosomeSize / 16 * 5, ribosomeSize / 2)
            ribosome.right = part(rightRibosome, ribosomeSize / 16 * 5, ribosomeSize / 2)
            ribosome.grab = function (x, y, width) {
                this.left.fastPoint(x - width / 2, y)
                this.right.fastPoint(x + width / 2, y)
                mainRibosome.style.removeProperty("opacity")
            }
            ribosome.animateGrab = function (deltaX, deltaY, listener, easing = undefined, stepSpeed = undefined) {
                (async function () {
                    await ribosome.untilStop()
                    let left
                        = ribosome.left;
                    let right
                        = ribosome.right;
                    let leftPosition = {x: left.x, y: left.y}
                    let rightPosition = {x: right.x, y: right.y}
                    if(UI.isPocket()){
                        let tmp=deltaX;
                        // noinspection JSSuspiciousNameCombination
                        deltaX=deltaY;
                        deltaY=tmp;

                        left.animationPoint(leftPosition.x, leftPosition.y - deltaY, easing, stepSpeed);
                        right.animationPoint(rightPosition.x, rightPosition.y + deltaY, easing, stepSpeed);

                        left.animationPoint(leftPosition.x - deltaX, leftPosition.y - deltaY, easing, stepSpeed);
                        right.animationPoint(rightPosition.x - deltaX, rightPosition.y + deltaY, easing, stepSpeed);

                        left.animationPoint(leftPosition.x - deltaX, leftPosition.y, easing, stepSpeed);
                        right.animationPoint(rightPosition.x - deltaX, rightPosition.y, easing, stepSpeed);

                        await ribosome.untilStop()
                        listener()
                        left.animationPoint(leftPosition.x, leftPosition.y, easing, stepSpeed);
                        right.animationPoint(rightPosition.x, rightPosition.y, easing, stepSpeed);
                    }else{
                        left.animationPoint(leftPosition.x - deltaX, leftPosition.y, easing, stepSpeed);
                        right.animationPoint(rightPosition.x + deltaX, rightPosition.y, easing, stepSpeed);

                        left.animationPoint(leftPosition.x - deltaX, leftPosition.y + deltaY, easing, stepSpeed);
                        right.animationPoint(rightPosition.x + deltaX, rightPosition.y + deltaY, easing, stepSpeed);

                        left.animationPoint(leftPosition.x, leftPosition.y + deltaY, easing, stepSpeed);
                        right.animationPoint(rightPosition.x, rightPosition.y + deltaY, easing, stepSpeed);
                        await ribosome.untilStop()
                        listener()
                        left.animationPoint(leftPosition.x, leftPosition.y, easing, stepSpeed);
                        right.animationPoint(rightPosition.x, rightPosition.y, easing, stepSpeed);
                    }
                })()
            }
            return ribosome
        }()
    })
    setTimeout(() => {
        Tabs.translation.registerSetup(() => {
            if (tmpContainer !== undefined) {
                MAIN_ELEMENT_CONTAINER().removeChild(tmpContainer)
                MAIN_ELEMENT_CONTAINER().appendChild(tmpContainer)
            }
        })
    })
})()