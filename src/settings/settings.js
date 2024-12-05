const SETTINGS = (function () {

    function Settings() {
        return {
            fontSize: SettingKey(20, newvalue => {
                let style = document.documentElement.style;

                if (newvalue == null) {
                    style["--font-size"] = ""
                } else {
                    let number = Number.parseFloat(newvalue);
                    if (number <= 5) number = 5;
                    if (number >= 100) number = 100;
                    style["--font-size"] = number + "px"
                }
                style.cssText = CssParser.stringify(style)
            }),
            uiscale: SettingKey(1, newvalue => {
                let style = document.documentElement.style;

                if (newvalue == null) {
                    style["--uiscale"] = ""
                } else {
                    let number = Number.parseFloat(newvalue);
                    if (number <= 0.1) number = 0.1;
                    if (number >= 5) number = 5;
                    style["--uiscale"] = number
                }
                style.cssText = CssParser.stringify(style)
            }),
            nucleopointsAmountTranslation: SettingKey(10),
            coloredNucleoTriplet: SettingKey(true),
            coloredNucleoTable: SettingKey(true),
            coloredNucleoTableCross: SettingKey(true),
            nucleoTableSelectionEnabled: SettingKey(true),
            coloredNucleoLine: SettingKey(true),
            backgroundColor: SettingKey("#32472c", newcolor => {
                setTimeout(() => {
                    let style = document.body.style;
                    style.backgroundColor = newcolor
                })
            })

        }
    }

    //region other
    let settings = Settings()


    /**@return string*/
    function getSetting(key) {
        // return JSON.parse(window.localStorage.getItem(key))
        return window.localStorage[key]
    }

    function setSetting(key, value) {
        window.localStorage[key] = value
        // window.localStorage.setItem(key, JSON.stringify(value))
    }

    /**
     * @param def {*}
     * @param listener {(any)=>void}
     * @type SettingKey*/
    function SettingKey(def, listener = undefined) {
        return {
            name: null,
            def() {
                return def
            },
            reset() {
                this.set(def)
            },
            check() {
                let setting = getSetting(this.name);
                if (listener && setting !== undefined && setting !== def) {
                    listener(setting)
                }
            },
            get() {
                let value = getSetting(this.name);
                switch (typeof def) {
                    case "string":
                    case "undefined":
                    case "function":
                    default:
                        return value
                    case "object":
                        return JSON.parse(value)
                    case "boolean":
                        return value==="true"
                    case "number":
                        return Number.parseFloat(value)
                    case "symbol":
                        return Symbol(value);
                    case "bigint":
                        return BigInt(value)
                }
            },
            set(value) {
                setSetting(this.name, value)
                if (listener) {
                    listener(value)
                }
            }
        }
    }

    {
        let names = Object.getOwnPropertyNames(settings);
        for (let i = 0; i < names.length; i++) {
            settings[names[i]].name = names[i]
            settings[names[i]].check()
        }
    }

    return new Proxy(settings, {
        get(target, p, receiver) {
            if (p === '__target__') return target
            let newVar = target[p].get();
            return newVar === undefined || newVar == null ? target[p].def() : newVar;
        },
        set(target, p, newValue, receiver) {
            target[p].set(newValue)
        }
    })
    //endregion
})()

Tabs.settings.registerSetup(() => {
    let container = createContainer();
    container.appendChild(createElement("div", ["class", "settings_table"], it => {
        function addSetting(consumer) {
            it.appendChild(createElement("div", ["class", "setting_container"], consumer))
        }

        let settings = SETTINGS["__target__"];

        rangeSetting("setting.font-size.name", settings.fontSize, 1, [5, 100]);
        rangeSetting("setting.nucleopoints-amount-translation.name", settings.nucleopointsAmountTranslation, 1, [2, 124]);

        // rangeSetting("setting.ui-scale.name", settings.uiscale, .05);
        function rangeSetting(key, setting_, scale, ranges) {

            if (ranges && ranges.length > 0) {
                if (ranges.length < 2) {
                    ranges.push(it => it)
                }

                function transformRange(i, func) {
                    if (typeof ranges[i] === 'number') {
                        let value = ranges[i];
                        ranges[i] = it => func(value, it)
                        ranges[i].value = value
                    } else if (typeof ranges[i] !== 'function') {
                        ranges[i] = it => it
                    }
                }

                transformRange(0, Math.max)
                transformRange(1, Math.min)
            } else {
                ranges = [it => it, it => it]
            }
            addSetting(it => {
                let setting = setting_;
                let label = createElement("p", ["style", "margin-right: auto"], ["class", "setting_name"]);

                function updateLabel() {
                    label.innerText = BUNDLE[key] + ": " + getFloat().toFixed(Math.max(-Math.floor(Math.log10(scale)), 0))
                }

                it.appendChild(label)
                updateLabel()

                let buttonSize = "width: 48px; height: 48px;margin-top: auto;margin-bottom: auto;text-align: center";

                function getFloat() {
                    let newVar = setting.get();
                    if (newVar === undefined || newVar == null) return setting.def()
                    /**@type number*/
                    let float = typeof newVar === "string" ? Number.parseFloat(newVar) : newVar;
                    if (isNaN(float) || !isFinite(float)) return setting.def()
                    return float;
                }

                it.appendChild(createElement("button", ["class", "frame_button"], ["style", buttonSize + "; margin-left: 10px"], it => {
                    it.innerText = "-"
                    it.onclick = () => {
                        setting.set(ranges[0](getFloat() - scale))
                        updateLabel()
                    }
                }))
                it.appendChild(createElement("button", ["class", "frame_button"], ["style", buttonSize], it => {
                    it.innerText = "+"
                    it.onclick = () => {
                        setting.set(ranges[1](getFloat() + scale))
                        updateLabel()
                    }
                }))
            })
        }


        // checkSetting("setting.colored-nucleo-triplet.name", settings.coloredNucleoTriplet)

        function checkSetting(key, settingKey) {
            addSetting(it => {
                let setting = settingKey
                let label = createElement("p", ["class", "setting_name"]);
                it.appendChild(label)
                label.innerText = BUNDLE[key] + ": "

                let buttonSize = "width: 48px; height: 48px;align-self: center";
                it.appendChild(createElement("button", ["class", "frame_checkbox"], ["style", buttonSize], it => {
                    it.innerText = "X"
                    let startB = setting.get() === "true";
                    it.dataset.pressed = startB ? "1" : "0"
                    it.onclick = () => {
                        let b = setting.get() !== "true";
                        setting.set(b)
                        it.dataset.pressed = b ? "0" : "1"
                    }
                }))
            });
        }
    }))
})