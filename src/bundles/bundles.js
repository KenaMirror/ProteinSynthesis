

const BUNDLE=(function (){
    let script = document.getElementsByTagName('bundle');
    let loadedBundles = {};
    let bundleElements=[]
    for(let i = 0; i < script.length; i++) {
        bundleElements.push(script[i])
        //https://www.techonthenet.com/js/language_tags.php

        let lang = script[i].getAttribute("lang");
        if(!lang)lang="en"
        lang=lang.toLowerCase();
        let rawText;
        if(script[i].hasAttribute("href")) {
            rawText=load(script[i].getAttribute("href"));
        } else {
            rawText=script[i].innerHTML;
        }
        let items = PropertiesParser.parse(rawText);
        let currentBundle = loadedBundles[lang];
        if(!currentBundle) {
            loadedBundles[lang] = items
        } else{
            loadedBundles[lang]=Object.assign(currentBundle,items)
        }

    }

    bundleElements.forEach(it=>it.remove())
    console.log(loadedBundles)
    function currentLangs(){
        let language = window.navigator.language;
        let number = language.indexOf("-");
        if(number!==-1)return [language,language.substring(0,number)]
        return [language];
    }
    function currentBundle(){
        let langs = currentLangs();
        for (let i = 0; i < langs.length; i++) {
            let foundBundle = loadedBundles[langs[i]];
            if(foundBundle)return foundBundle;
        }

        return loadedBundles["en"]
    }
    return new Proxy({},{
        get(target,prop,receiver){

            const newVar = currentBundle()[prop];
            if(newVar===undefined)throw new Error("Undefined bundle'"+prop+"'")
            return newVar;
        }
    })
})()

function load(url) {
    var xhr;
    if(window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if(window.ActiveXObject) {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    } else {
        return false;
    }
    xhr.open('GET', url, false);
    if(xhr.overrideMimeType) {
        xhr.overrideMimeType('text/plain');
    }
    xhr.send(null);
    if(xhr.status == 200) {
        return xhr.responseText;
    }
    return false;
}
