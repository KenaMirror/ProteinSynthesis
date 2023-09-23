/*
window.addEventListener("click", function (event) {
    var target = event.target;

})*/
(function () {
    function visit(children) {
        for (let i = 0; i < children.length; i++) {
            let it = children[i];
            visit(it.children)
            if (it.dataset.pressed === undefined) continue
            it.style.cursor="pointer"
            // console.log("custom: ",it)
            it.addEventListener("click", function () {
                it.dataset.pressed = "" + (1 - parseInt(it.dataset.pressed))
            })
        }
    }

    Tabs.postProcess.register(()=>visit(document.children))
}())
