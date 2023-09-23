const Time = function () {
    let startMillis = new Date().getTime();
    /**@type Time*/
    let Time = {
        delta: 0,
        time: 0,
        fromMillis(millis) {
            return millis * 60 / 1000
        }
    };

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
var MAIN_WINDOW = window
var MAIN_ELEMENT = document.children[0]
/** @type Mathf*/
const Mathf = {
    clamp(value) {
        return Math.max(0, Math.min(1, value))
    },
    randInt(min, max) {
        return Math.min(max - min, Math.floor(Math.random() * (max - min))) + min;
    },
    randomElement(array) {
        return array[this.randInt(0, array.length)]
    },
}

/**@returns Disposable*/
function Disposable(condition) {
    return {
        /**@returns boolean*/
        isDisposed() {
            return condition()
        }
    }
}

const Disposer = function () {
    let globalIteration = 0;
    return {
        reset() {
            globalIteration++;
        },
        /**@returns Disposable*/
        create() {
            let myId = globalIteration + 1;
            myId -= 1;
            return new Disposable(() => globalIteration !== myId)
        }
    }
}()


const onEachUpdate = function () {
    return onEachUpdate

    /**
     * @param disposable {{isDisposed():boolean}}
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}