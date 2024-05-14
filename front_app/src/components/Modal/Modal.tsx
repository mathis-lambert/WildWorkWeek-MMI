import "./Modal.scss"

interface ModalProps {
    open: boolean;
    title: string;
    content: string;
    onClose: () => void;
    showClose?: boolean;
    onValidate?: () => void;
    showValidate?: boolean;

}

const Modal = (props: ModalProps) => {
    return (
        <div className={`modal ${props.open ? "open" : ""}`} onClick={() => props.onClose()}>
            <div className="modal-content">
                <h2>{props.title}</h2>
                <p>{props.content}</p>
                {props.showClose && <button onClick={props.onClose}>Fermer</button>}
                {props.showValidate && <button onClick={props.onValidate}>Je valide !</button>}
            </div>
        </div>
    );
}

export default Modal;