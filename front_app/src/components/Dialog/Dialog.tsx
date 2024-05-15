import "./Dialog.scss"
import {useState} from "react";

interface DialogProps {
    open: boolean;
    title?: string;
    content: string;
    onClose?: () => void;
    showClose?: boolean;
    closeText?: string;
    onValidate?: () => void;
    showValidate?: boolean;
    validateText?: string;
    buttons?: {
        text: string;
        onClick: () => void;
    }[];
    enigme?: {
        type: 'text' | 'puzzle' | 'choice' | 'code' | 'image-choice';
        answer?: string;
        onValidate: (response: string) => void;
    }
}

const Dialog = (props: DialogProps) => {
    const [answer, setAnswer] = useState<string>("");

    return (
        <div className={`dialog ${props.open ? "open" : ""}`}>
            <div className="dialog-content">
                {props.title && <h2>{props.title}</h2>}
                <p>{props.content}</p>
                <div className="dialog-actions">
                    {props.enigme && (
                        <div className="enigme-dialog">
                            {props.enigme.type === 'text' && (
                                <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)}/>
                            )}
                            <button onClick={() => props.enigme?.onValidate(answer)}>Valider</button>
                        </div>
                    )}

                    <div className="buttons">
                        {props.showClose && <button onClick={props.onClose}>{props.closeText || "Fermer"}</button>}
                        {props.showValidate &&
                            <button onClick={props.onValidate}>{props.validateText || "Valider !"}</button>}
                        {props.buttons && props.buttons.map(button => (
                            <button key={button.text} onClick={button.onClick}>{button.text}</button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Dialog;