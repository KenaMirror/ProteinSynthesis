const UI = (function () {
    function addEventListener_(self: any, type: any, callback: (this: any, ev: any) => any, options?: any) {
        let disposable = Disposer.create();
        let outerCallback: (this: any, event: any) => void;
        outerCallback = (event) => {
            if (disposable.isDisposed()) {
                self.removeEventListener(type, outerCallback, options)
            } else {
                // @ts-ignore
                return callback.call(this, event)
            }
        };
        self.addEventListener(type, outerCallback, options)
    }

    enum BackgroundType {
        "errored-background",
        "good-background"
    }

    type BackgroundTypeVariant = keyof typeof BackgroundType
    let BackgroundActionDisposer = createDisposer();

    function background<T extends BackgroundTypeVariant>(a: T, b: Exclude<BackgroundTypeVariant, T>): void;
    function background(current: BackgroundTypeVariant, opposite: BackgroundTypeVariant) {
        document.body.classList.toggle(current, true)
        document.body.classList.toggle(opposite, false)
        BackgroundActionDisposer.reset()
        let disposable = BackgroundActionDisposer.create();
        setTimeout(() => {
            if (disposable.isDisposed()) return
            document.body.classList.toggle(current, false)
        }, 100)
    }

    class UI {
        static addEventListener<K extends keyof SVGElementEventMap>(self: SVGElement, type: K, listener: (this: SVGElement, ev: SVGElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        static addEventListener(self: SVGElement, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        static addEventListener<K extends keyof HTMLElementEventMap>(self: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        static addEventListener(self: HTMLElement, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        static addEventListener(self: unknown, type: unknown, listener: unknown, options?: unknown): void {
            addEventListener_(self, type, listener as any, options)
        }

        static removeEventListener<K extends keyof SVGElementEventMap>(self: SVGElement, type: K, listener: (this: SVGElement, ev: SVGElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        static removeEventListener(self: HTMLElement, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
        static removeEventListener<K extends keyof HTMLElementEventMap>(self: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        static removeEventListener(self: HTMLElement, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
        static removeEventListener(self: any, type: unknown, listener: unknown, options?: unknown): void {
            self.removeEventListener(type, listener, options)
        }

        static informError(text = BUNDLE["wrong"]) {
            Tabs.announce(text, 120).style.color = "red"
            this.errorBackground()
        }

        static informSuccess(text = BUNDLE["right"]) {
            Tabs.announce(text, 120).style.color = "green"
            this.goodBackground()
        }

        static isPocket() {
            let viewport = window.visualViewport!;
            return viewport.width <= viewport.height;
        }

        static errorBackground() {
            background("errored-background", "good-background")
        }

        static goodBackground() {
            background("good-background", "errored-background")
        }

    }

    return UI
})()