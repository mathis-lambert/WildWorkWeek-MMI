import "./Modal.scss"

interface ModalProps {
    open: boolean;
    title: string;
    content: string;
    onClose: () => void;
    showClose?: boolean;
    onValidate?: () => void;
    showValidate?: boolean;
    image?: string;
    video?: string;
    orientation?: "row" | "column";
}

const Modal = (props: ModalProps) => {
    return (
        <div className={`modal ${props.open ? "open" : ""}`} onClick={() => props.onClose()}>
            <div className="modal-content">
                <h2>{props.title}</h2>
                <div className={`modal-body ${props.orientation || "row"}`}>
                    <div className="modal-description">
                        <p>{props.content}</p>
                    </div>
                    <div className="modal-image">
                        {props.image && <img src={props.image} alt=""/>}
                        {props.video && <video src={props.video} autoPlay loop muted/>}
                    </div>
                </div>

                {props.showClose && <button onClick={props.onClose}>Fermer</button>}
                {props.showValidate && <button onClick={props.onValidate}>Je valide !</button>}
            </div>
        </div>
    );
}

export default Modal;