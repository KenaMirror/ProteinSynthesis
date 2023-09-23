const Tabs = function () {
    let myPopups = []
    let popupContainer = function () {
        let container = createContainer();
        container.classList.add("permanent")
        return createDiv(container, "popup_container")
    }()

    class MyPopup {
        constructor(element, duration) {
            this.initTime = duration
            this.time = duration
            this.element = element;
        }

        update() {
            this.time -= Time.delta
            let prog = Mathf.clamp((this.time) / Math.min(60, this.initTime))
            this.element.style.cssText = 'opacity: ' + prog
            return this.time <= 0
        }
    }

    function update() {

        for (let i = 0; i < myPopups.length; i++) {
            let popup = myPopups[i];
            if (popup.update()) {
                myPopups.splice(i, 1)
                popup.element.remove()
                i--;
            }
        }

        setTimeout(update, 0)
    }

    update()

    let postprocessors = []


    function tab() {
        let setupMethods = []

        return {
            registerSetup(runnable) {
                setupMethods.push(runnable)
            },
            setup() {
                Disposer.reset()
                setupMethods.forEach(it => it())
                postprocessors.forEach(it => it())
            }
        }
        // return new Tab()
    }

    return {

        popup(duration = 1.0) {
            let div = createDiv(popupContainer, "popup");
            myPopups.push(new MyPopup(div, duration))
            return createDiv(div, "popup_content")
        },
        announce(text, duration = 1.0) {
            let div = this.popup(duration);
            let span = create(div, "", "span");
            span.innerText = text

            return span
        },
        postProcess: {
            register(runnable) {
                postprocessors.push(runnable)
            }
        },
        translation: tab(),
        transcription: tab(),
        settings: tab(),
    }

}()

function createAttribute(name, value) {
    let attr = document.createAttribute(name);
    attr.value = value;
    return attr
}

/**
 * @param tagName {string}
 * @param params {((createElement: HTMLElement) => void) | Attr | string[]}
 * @returns HTMLElement
 * */
function createElement(tagName, ...params) {
    let node = document.createElement(tagName);

    if (params) {
        for (let attribute of params) {
            if (attribute instanceof Function) {
                attribute.call(this, node)
                continue
            }
            if (attribute instanceof Array) {
                attribute = createAttribute(attribute[0], attribute[1])
            }
            node.attributes.setNamedItem(attribute)
        }
    }
    return node
}


function createContainer() {
    let element = document.createElement("div");
    element.className = "element__container"
    MAIN_ELEMENT.append(element)
    return element
}

/**
 * @param {HTMLElement} parent
 * @param {*} nucleotide
 */
function nucleotideDiv(parent, nucleotide) {
    return createDiv(parent, "nucleotide__item nucleotide__item_" + nucleotide.styleId)
}

/**
 * @param {HTMLElement} parent
 * @param {string} tagName
 * @param {*} nucleotide
 */
function nucleotideElement(parent, tagName, nucleotide) {
    return create(parent, "nucleotide__item nucleotide__item_" + nucleotide.styleId, tagName)
}

/**
 * @param element {HTMLElement}
 * @param listener {(this: HTMLElement, ev: HTMLElementEventMap[click]) => any}
 */
function makeCheckedButton(element, listener = undefined) {
    element.dataset.pressed = "0"
    if (listener) {
        element.addEventListener("click", listener)
    }
    return element
}

/**
 * @param parent {HTMLElement}
 * @param className {string}
 * @param configuration {((HTMLElement)=>void)?}
 * */
function createDiv(parent, className, configuration = undefined) {
    return create(parent, className, "div", configuration)
}

/**
 * @param disposable {Disposable}
 * @param callback {()=>void}
 * */
function onUIChanges(disposable, callback) {
    function checkUpdateScl(prevScale, prevWidth, prevHeight) {
        if (disposable.isDisposed()) return
        let scale = window.devicePixelRatio;
        let width = window.innerWidth;
        let height = window.innerHeight;
        if (scale !== prevScale || width !== prevWidth || prevHeight !== height) {
            callback()
        }
        setTimeout(() => checkUpdateScl(scale, width, height))
    }

    checkUpdateScl(-1, -1, -1)
}

/**
 * @param parent {HTMLElement}
 * @param className {string}
 * @param tagName {string}
 * @param configuration {((HTMLElement)=>void)?}
 * */
function create(parent, className, tagName, configuration = undefined) {
    let element = document.createElement(tagName);
    element.className = className
    if (configuration !== undefined) {
        configuration(element)
    }
    parent.append(element)
    return element
}