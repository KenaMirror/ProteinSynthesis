const SETTINGS = (function () {

    class Settings {
        fontSize = settingKey(20, newvalue => {
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
        })
        uiscale = settingKey(1, newvalue => {
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
        })
        nucleopointsAmountTranslation = settingKey(10)
        coloredNucleoTriplet = settingKey(true)
        coloredNucleoTable = settingKey(true)
        coloredNucleoTableCross = settingKey(true)
        nucleoTableSelectionEnabled = settingKey(true)
        useConstantUIOnBigWidth = settingKey(false)
        coloredNucleoLine = settingKey(true)
        backgroundColor = settingKey("#9cb295", newcolor => {
            setTimeout(() => {
                let style = document.body.style;
                style.backgroundColor = newcolor
            })
        })
    }


    //region other
    let settings = new Settings()


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
     * Represents a setting with a name, default value, and optional listener.
     * @interface Setting
     */
    class SettingKey {  // Using a class for JSDoc to work correctly with methods

        /**
         * @type {string}
         */
        name;

        get() {
        }

        set(value) {
        }

        reset() {
        }

        check() {
        }

        /**@param listener {(newValue:any)=>void}*/
        addListener(listener) {
        }
    }

    /**
     * @param def {*}
     * @param listener {(any)=>void}
     * @type SettingKey*/
    function settingKey(def, listener = undefined) {
        return {
            name: null,
            def() {
                return def
            },
            reset() {
                this.set(def)
            },
            check() {
                let setting = this.get();
                if (listener && setting !== this.def()) {
                    listener(setting)
                }
            },
            get() {
                let value = getSetting(this.name);
                if (value === undefined) return def
                try {
                    let value1 = JSON.parse(value).value;

                    if (typeof value1 !== typeof def) {
                        window.localStorage.removeItem(this.name)
                        return def;
                    }
                    return value1
                } catch (e) {
                    window.localStorage.removeItem(this.name)
                    return def;
                }
            },
            set(value) {
                setSetting(this.name, JSON.stringify({value: value}))
                if (listener) {
                    listener(value)
                }
            },
            addListener(listener1) {
                if (listener === undefined) {
                    listener = listener1;
                } else {
                    let listener0 = listener;
                    listener = () => {
                        listener0()
                        listener1()
                    }
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
    // noinspection UnnecessaryLocalVariableJS
    /**@type {{[K in keyof Settings]: any} & { __target__:Settings}}*/
    let proxy = new Proxy({}, {
        get(target__, p, receiver) {
            if (p === '__target__') return settings
            let newVar = settings[p].get();
            return newVar === undefined || newVar == null ? settings[p].def() : newVar;
        },
        set(target__, p, newValue, receiver) {
            settings[p].set(newValue)
        }
    });
    return proxy
    //endregion
})()

Tabs.settings.registerSetup(() => {
    let container = createContainer();
    container.appendChild(createElement("div", ["class", "settings_window"], settingWindow => {
        /**@type HTMLDivElement*/
        let currentSettingTab;

        let settings = SETTINGS["__target__"];

        /**
         * @param name {string}
         * @param constructor {(this:HTMLDivElement)=>void}
         * */
        function settingTab(name, constructor) {
            create(settingWindow, "setting_tab", "div", tab => {
                create(tab, "setting_tab__name", "div").innerText = BUNDLE["setting.tabs." + name]
                let thisArg = create(tab, "settings_table", "div");
                currentSettingTab = thisArg;
                constructor.apply(thisArg);
                currentSettingTab = null;
            })

        }

        settingTab("other", () => {
            rangeSetting("setting.font-size.name", settings.fontSize, 1, [5, 100]);
            checkSetting("setting.constant-ui.name", settings.useConstantUIOnBigWidth)
        })
        settingTab("table", () => {
            checkSetting("setting.nucleo-table-selection.name", settings.nucleoTableSelectionEnabled);
            rangeSetting("setting.nucleopoints-amount-translation.name", settings.nucleopointsAmountTranslation, 1, [2, 124]);
        })

        //TODO implement settings
        // checkSetting("setting.colored-nucleo-triplet.name",settings.coloredNucleoTriplet)
        // checkSetting("setting.colored-nucleo-table.name",settings.coloredNucleoTable)
        // checkSetting("setting.colored-nucleo-table-cross.name",settings.coloredNucleoTableCross)
        // checkSetting("setting.colored-dna-transcription-buttons.name",settings.coloredNucleoLine)
        /**@param consumer {(currentSettingTab:HTMLDivElement)=>void}*/
        function addSetting(consumer) {
            currentSettingTab.appendChild(createElement("div", ["class", "setting_container"], consumer))
        }

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
                let label = createElement("p", ["class", "setting_name"]);

                function updateLabel() {
                    label.innerText = BUNDLE[key] + ": " + getFloat().toFixed(Math.max(-Math.floor(Math.log10(scale)), 0))
                }

                it.appendChild(label)
                updateLabel()

                // let buttonSize = "width: 48px; height: 48px;margin-top: auto;margin-bottom: auto;text-align: center";

                function getFloat() {
                    let newVar = setting.get();
                    if (newVar === undefined || newVar == null) return setting.def()
                    /**@type number*/
                    let float = typeof newVar === "string" ? Number.parseFloat(newVar) : newVar;
                    if (isNaN(float) || !isFinite(float)) return setting.def()
                    return float;
                }

                create(it, "settings_buttons_group", "div", it => {
                    it.appendChild(createElement("button", ["class", "frame_button"], it => {
                        it.innerText = "-"
                        it.onclick = () => {
                            setting.set(ranges[0](getFloat() - scale))
                            updateLabel()
                        }
                    }))
                    it.appendChild(createElement("button", ["class", "frame_button"], it => {
                        it.innerText = "+"
                        it.onclick = () => {
                            setting.set(ranges[1](getFloat() + scale))
                            updateLabel()
                        }
                    }))
                })
            })
        }


        // checkSetting("setting.colored-nucleo-triplet.name", settings.coloredNucleoTriplet)

        function checkSetting(key, settingKey) {
            addSetting(it => {
                let setting = settingKey
                let label = createElement("p", ["class", "setting_name"]);
                it.appendChild(label)
                label.innerText = BUNDLE[key] + ": "

                create(it, "settings_buttons_group", "div", it => {
                    it.appendChild(createElement("button", ["class", "frame_checkbox"], it => {
                        function update(isChecked) {
                            setTimeout(() => {
                                it.dataset.pressed = isChecked ? "1" : "0"
                            })
                        }

                        update(setting.get())

                        it.onclick = () => {
                            let b = !setting.get();
                            setting.set(b)
                            update(b)
                        }
                    }))
                });
            });
        }

    }))
})