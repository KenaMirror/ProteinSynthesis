Tabs.translation.registerSetup(() => {
    let list = []
    let len = SETTINGS.nucleopointsAmountTranslation;

    function generateNew() {

        list = []
        list.push(Mathf.randomElement(BIO.AminoAcid.Met.positions))
        for (let i = 0; i < len - 2; i++) {
            let length = BIO.AminoAcid.active.length;
            let element = Mathf.randomElement(BIO.AminoAcid.active);
            let position = Mathf.randomElement(element.positions);
            list.push(position)
        }
        list.push(Mathf.randomElement(BIO.AminoAcid.Stop.positions))
        Tabs.translation.aminoAcidField.setup(list)
        Tabs.translation.rnaLine.setup(list)
    }

    generateNew()
    onUIChanges(Disposer.create(),()=>{
        let table =
            Tabs.translation.table;
        let rnaLine = Tabs.
            translation.rnaLine;
        if (table.tableElement.scrollHeight > window.outerHeight) {
            rnaLine.element.parentElement.style.height=table.tableElement.scrollHeight+"px"
        } else{
            rnaLine.element.parentElement.style.height=null
        }

    })
    Tabs.translation.table.addClickListener((x, y, z, acid) => {
        let current = list[Tabs.translation.aminoAcidField.index];
        // console.log("x,y,z",[x,y,z],current)
        if (current.x === x && current.y === y && current.z === z) {
            Tabs.translation.rnaLine.selectNext(250 / 2)
            if (Tabs.translation.aminoAcidField.index + 1 < Tabs.translation.aminoAcidField.size) {
                Tabs.translation.aminoAcidField.showNext(500)
                Tabs.announce("Верно", 120).style.color = "green"
            } else {
                Tabs.translation.aminoAcidField.showNext(500)
                if (Tabs.translation.table.generateNextButton().classList.contains("hidden")) {
                    Tabs.announce("Верно", 120).style.color = "green"
                }
                Tabs.translation.table.generateNextButton().classList.remove("hidden")
            }
        } else {

            if (Tabs.translation.aminoAcidField.index + 1 < Tabs.translation.aminoAcidField.size) {
                Tabs.announce("Неверно", 120).style.color = "red"
            }
        }
    })
})