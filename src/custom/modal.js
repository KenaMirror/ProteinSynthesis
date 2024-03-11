function createOpenButton(dialog) {
    return <button onClick={()=>openModal(dialog)}>Открыть модальное окно</button>
}

function createModalDialog(title, text) {
    return <div className="modal_content">
        <span onClick={closeModal} style="float: right; cursor: pointer;">&times;</span>
        <h2>{title}</h2>
        <p>{text}</p>
        <button onClick={closeModal}>Закрыть</button>
    </div>
}

function openModal(dialog) {
    dialog.style.display = 'block';
}

function closeModal(dialog) {
    dialog.style.display = 'none';
}