
Tabs.translation.registerSetup(()=>{
    document.querySelector("#text_target").innerText=BUNDLE["translation.task-info"]
    document.querySelector("#modalButton").style.display=null
})
Tabs.transcription.registerSetup(()=>{
    document.querySelector("#text_target").innerText=BUNDLE["transcription.task-info"]
    document.querySelector("#modalButton").style.display=null
})