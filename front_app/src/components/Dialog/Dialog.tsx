import "./Dialog.scss"

interface DialogProps {
    open: boolean;
    title?: string;
    content: string;
    onClose: () => void;
    showClose?: boolean;
    closeText?: string;
    onValidate?: () => void;
    showValidate?: boolean;
    validateText?: string;
}

const Dialog = (props: DialogProps) => {
    return (
        <div className={`dialog ${props.open ? "open" : ""}`}>
            <div className="dialog-content">
                {props.title && <h2>{props.title}</h2>}
                <p>{props.content}</p>
                {props.showClose && <button onClick={props.onClose}>{props.closeText || "Fermer"}</button>}
                {props.showValidate && <button onClick={props.onValidate}>{props.validateText || "Valider !"}</button>}
            </div>
        </div>
    );
}

export default Dialog;