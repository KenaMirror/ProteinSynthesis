const Time = function () {
    let startMillis = new Date().getTime();

    class Time {
        static delta = 1
        static time = 1

        static fromMillis(millis) {
            return millis * 60 / 1000
        }
    }

    function update() {
        let currentMillis = new Date().getTime();
        let deltaMillis = (currentMillis - startMillis) * 60 / 1000
        startMillis = currentMillis
        Time.time += deltaMillis
        Time.delta = deltaMillis;
        setTimeout(update, 0)
    }

    update()
    return Time
}()
const MAIN_WINDOW = window


/**@type HTMLDivElement*/
function MAIN_ELEMENT_CONTAINER() {
    if (MAIN_ELEMENT_CONTAINER.__ === undefined || MAIN_ELEMENT_CONTAINER.__ == null) {
        // throw null
        MAIN_ELEMENT_CONTAINER.__ = document.querySelector(".main-container")
    }
    return MAIN_ELEMENT_CONTAINER.__
}

class Mathf {
    static clamp(value) {
        return Math.max(0, Math.min(1, value))
    }

    static randInt(min, max) {
        return Math.min(max - min, Math.floor(Math.random() * (max - min))) + min;
    }

    static randomElement(array) {

        // return array[0]
        return array[this.randInt(0, array.length)]
    }
}

if (urlParams.has("debug__mode")) {
    Mathf.randomElement = it => it[0]
}


function DisposableImpl(condition) {
    class Disposable {
        /**@returns boolean*/
        isDisposed() {
            return condition()
        }
    }

    return new Disposable()
}

const infiniteDisposable = DisposableImpl(() => false)
const zeroDisposable = DisposableImpl(() => true)

function createDisposer() {
    let globalIteration = 0;
    return {
        reset() {
            globalIteration++;
        },
        /**@returns Disposable*/
        create() {
            let myId = globalIteration + 1;
            myId -= 1;
            return DisposableImpl(() => globalIteration !== myId)
        }
    }
}

const Disposer = createDisposer()


const onEachUpdate = function () {
    return onEachUpdate

    /**
     * @param disposable {Disposable}
     * @param callback {()=>void}
     * */
    function onEachUpdate(disposable, callback) {
        let obj = () => {
            if (disposable.isDisposed()) {
                return
            }
            callback()
            setTimeout(obj, 0)
        }

        setTimeout(obj, 0)
    }
}();

function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

setTimeout(() => {
    onUIChanges(infiniteDisposable, () => {
        document.body.parentElement.classList.toggle("is-mobile", isMobileDevice())
    })

})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}