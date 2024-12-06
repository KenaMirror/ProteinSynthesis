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
})()

function gotoTab(tab) {
    clearDocument()
    tab.setup()

}

function clearDocument() {
    let children = []
    let htmlElementCollection = document.documentElement.children;
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

const urlParams = new URLSearchParams(window.location.search);
const startTab = urlParams.get('tab');
if (Tabs[startTab] !== undefined) {
    if (Tabs[startTab].setup !== undefined) {
        gotoTab(Tabs[startTab])
    }
}