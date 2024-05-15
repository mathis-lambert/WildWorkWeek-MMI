import './Enigme.scss'
import {useState} from "react";

interface EnigmeProps {
    text: string;
    answer: string;
    type: 'text' | 'puzzle' | 'choice' | 'code';
    onValidate: (response: string) => void;
}

const Enigme = (props: EnigmeProps) => {
    const [answer, setAnswer] = useState<string>("");

    const handleValidate = () => {
            props.onValidate(answer);
    }

    return (
        <div className={`enigme`}>
            <div className="enigme-content">
                <p>{props.text}</p>
                {props.type === 'text' && <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)}/>}
                {props.type === 'puzzle' && <input type="text" />}
                {props.type === 'choice' && <input type="text" />}
                {props.type === 'code' && <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)}/>}
                <button onClick={handleValidate}>Valider</button>
            </div>
        </div>
    );
}

export default Enigme;