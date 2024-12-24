//Tabs.transcription.setup()


(function () {
    function extracted(id, text) {
        document.getElementById(id).innerHTML += "<span>" + text + "</span>"
    }

    extracted("side-bar_button0", BUNDLE["dna-line"]);
    extracted("side-bar_button1", BUNDLE["dna-table"])
    // noinspection JSValidateTypes
    extracted("side-bar_button2", BUNDLE["settings"])

    let container = createContainer();
    container.appendChild(createElement("div", ["class", "title_container"], it => {
        it.appendChild(createElement("p", ["class", "title_header"], it => {
            it.innerText = BUNDLE["title-header"]
        }))
        it.appendChild(createElement("p", ["class", "title_text"], it => {
            it.innerText = BUNDLE["title-text"]
        }))
    }))

    setTimeout(()=>{
        let expectedWidth = 1920;
        onUIChanges(infiniteDisposable, updateSpecialScale)

        function updateSpecialScale() {
            let vw = window.visualViewport.width;
            let vh = window.visualViewport.height;

            let htmlTagStyle = document.body.parentElement.style;
            if (vw !== expectedWidth && SETTINGS.useConstantUIOnBigWidth) {
                let scale = vw / expectedWidth;
                window.visualViewport.scale
                htmlTagStyle.overflow = "hidden"
                htmlTagStyle.transform = `scale(${scale})`
                htmlTagStyle.transformOrigin = 'top left';
                htmlTagStyle.width = `${window.innerWidth / scale}px`
                htmlTagStyle.height = `${vh / scale}px`
            } else {
                htmlTagStyle.transform = ""
                htmlTagStyle.width = ``
            }
        }
        SETTINGS.__target__.useConstantUIOnBigWidth.addListener(newValue => {
            setTimeout(updateSpecialScale)
        })
    })


})()

function gotoTab(tab) {
    clearDocument()
    tab.setup()

}

function clearDocument() {
    let children = []
    let htmlElementCollection = MAIN_ELEMENT_CONTAINER().children;
    for (let i = 0; i < htmlElementCollection.length; i++) {
        let it = htmlElementCollection[i];

        if (it !== document.head && it !== document.body && !it.classList.contains("permanent")) {
            children.push(it)
        }
    }
    children.forEach(it => {
        // console.log(it)
        it.remove()
    })
}

const startTab = urlParams.get('tab');
if (Tabs[startTab] !== undefined && Tabs[startTab].setup !== undefined) {
    gotoTab(Tabs[startTab])
} else {
    gotoTab(Tabs.transcription)
}