import "./Dialog.scss"

interface DialogProps {
    open: boolean;
    title: string;
    content: string;
    onClose: () => void;
    showClose?: boolean;
    onValidate?: () => void;
    showValidate?: boolean;
}

const Dialog = (props: DialogProps) => {
    return (
        <div className={`dialog ${props.open ? "open" : ""}`} onClick={() => props.onClose()}>
            <div className="dialog-content">
                <h2>{props.title}</h2>
                <p>{props.content}</p>
                {props.showClose && <button onClick={props.onClose}>Fermer</button>}
                {props.showValidate && <button onClick={props.onValidate}>Je valide !</button>}
            </div>
        </div>
    );
}

export default Dialog;