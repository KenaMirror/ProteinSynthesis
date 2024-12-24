"use strict";
const UI = (function () {
    function addEventListener_(self, type, callback, options) {
        let disposable = Disposer.create();
        let outerCallback;
        outerCallback = (event) => {
            if (disposable.isDisposed()) {
                self.removeEventListener(type, outerCallback, options);
            } else {
                // @ts-ignore
                return callback.call(this, event);
            }
        };
        self.addEventListener(type, outerCallback, options);
    }

    let BackgroundType;
    (function (BackgroundType) {
        BackgroundType[BackgroundType["errored-background"] = 0] = "errored-background";
        BackgroundType[BackgroundType["good-background"] = 1] = "good-background";
    })(BackgroundType || (BackgroundType = {}));
    let BackgroundActionDisposer = createDisposer();

    function background(current, opposite) {
        document.body.classList.toggle(current, true);
        document.body.classList.toggle(opposite, false);
        BackgroundActionDisposer.reset();
        let disposable = BackgroundActionDisposer.create();
        setTimeout(() => {
            if (disposable.isDisposed())
                return;
            document.body.classList.toggle(current, false);
        }, 100);
    }

    class UI {
        static addEventListener(self, type, listener, options) {
            addEventListener_(self, type, listener, options);
        }

        static removeEventListener(self, type, listener, options) {
            self.removeEventListener(type, listener, options);
        }

        static informError(text = BUNDLE["wrong"]) {
            Tabs.announce(text, 120).style.color = "red";
            this.errorBackground();
        }

        static informSuccess(text = BUNDLE["right"]) {
            Tabs.announce(text, 120).style.color = "green";
            this.goodBackground();
        }

        static isPocket() {
            let viewport = window.visualViewport;
            return viewport.width <= viewport.height;
        }

        static __global__scale__ = 1

        static errorBackground() {
            background("errored-background", "good-background");
        }

        static goodBackground() {
            background("good-background", "errored-background");
        }
    }

    return UI;
})();
