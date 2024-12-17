Tabs.transcription.registerSetup(()=>{
    (function (){

        let list = []
        for (let i = 0; i < 10 * 3; i++) {
            list.push(undefined)
        }
        function generateNext(){
            for (let i = 0; i < list.length; i++) {
                list[i]=Mathf.randomElement(BIO.Nucleotide.dna)
            }
            Tabs.transcription.dnaLine.setup(list)
        }
        generateNext()
        Tabs.transcription.dnaLine.addEndListener(generateNext)
        function placeCenter(){
            // let element = Tabs.transcription.dnaLine.element;
            // let clientHeight=element.children[0].clientHeight+ element.children[1].clientHeight
            // let nx=MAIN_WINDOW.innerWidth/2-element.clientWidth/2
            // let ny=MAIN_WINDOW.innerHeight/2-clientHeight/2
            // element.style.transform="translate("+nx+"px, "+ny+"px)"
        }
        placeCenter()
        MAIN_WINDOW.onresize=placeCenter

        let nameToNucleo={}
        for (let i = 0; i < BIO.Nucleotide.all.length; i++) {
            let nucleo = BIO.Nucleotide.all[i];
            nameToNucleo[nucleo.charName.toLowerCase()]= nucleo
            nameToNucleo[i+1]= nucleo
        }
        MAIN_WINDOW.addEventListener("keydown", event=>{
            let s = event.key.toLowerCase();
            let found = nameToNucleo[s];
            if(found){
                Tabs.transcription.dnaLine.onClicked(found)
            }
            switch (s) {
                case "arrowup":
                case "arrowdown":
                    Tabs.transcription.dnaLine.moveUp()
                    break;
                case "arrowleft":
                    Tabs.transcription.dnaLine.moveLeft()
                    break;
                case "arrowright":
                    Tabs.transcription.dnaLine.moveRight()
                    break;
                default:
                    break;
            }
        })
    })()
})