import './Enigme.scss'
import {useState} from "react";
import Modal from "../Modal/Modal.tsx";

interface EnigmeProps {
    text: string;
    answer?: string;
    type: 'text' | 'puzzle' | 'choice' | 'code' | 'image-choice'
    images?: {
        url: string;
        answer: string;
    }[];
    puzzleImages?: {
        original: string;
        pieces: {
            url: string;
            answer: string;
        }[];
    }
    onValidate: (response: string) => void;
    description?: string;
    puzzleDragZone?: {
        top: number;
        left: number;
        width: number;
        height: number;
    }
    debug?: boolean;
}

const Enigme = (props: EnigmeProps) => {
    const [answer, setAnswer] = useState<string>("");
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [puzzlePiece, setPuzzlePiece] = useState<string>("");

    return (
        <>
            <div className={`enigme`}>
                <div className="enigme-content">
                    <h2>Enigme</h2>
                    <p>{props.text}</p>
                    {props.type === 'text' &&
                        <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)}/>}
                    {props.type === 'puzzle' && (
                        <div className="puzzle">
                            <div className="main-image">
                                <img src={props.puzzleImages?.original} alt=""/>

                                <div className={`missing-piece ${props.debug ? 'debug' : ''}`}
                                     onDrop={(e) => {
                                         e.preventDefault();
                                         const data = e.dataTransfer.getData("text");
                                         const jsonData = JSON.parse(data)
                                         setAnswer(jsonData.answer)
                                         setPuzzlePiece(jsonData.url)
                                     }}
                                     onDragOver={(e) => e.preventDefault()}
                                     style={{
                                         top: props.puzzleDragZone?.top + '%',
                                         left: props.puzzleDragZone?.left + '%',
                                         width: props.puzzleDragZone?.width + '%',
                                         height: props.puzzleDragZone?.height + '%'
                                     }}>
                                    {puzzlePiece && <img src={puzzlePiece} alt=""/>}
                                </div>
                            </div>
                            <div className="puzzle-pieces">
                                {props.puzzleImages?.pieces.map((piece, index) => (
                                    <img key={index} src={piece.url} alt=""
                                         onDragStart={(e) => {
                                             e.dataTransfer.setData("text", JSON.stringify(piece))
                                         }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {props.type === 'choice' && <input type="text"/>}
                    {props.type === 'code' &&
                        <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)}/>}
                    {props.type === 'image-choice' && (
                        <div className="image-choice">
                            {props.images && props.images.map((image, index) => (
                                <div key={index} className="image-choice-item" onClick={() => {
                                    console.log(image)
                                    setAnswer(image.answer);
                                    props.onValidate(image.answer);
                                }}>
                                    <img src={image.url} alt=""/>
                                </div>
                            ))}
                        </div>
                    )}
                    {props.description && <button onClick={() => setShowInfo(true)}>Info sur les travaux</button>}
                    {props.type !== 'image-choice' && <button onClick={() => props.onValidate(answer)}>Valider</button>}
                </div>

            </div>

            <Modal open={showInfo} title={'Info sur les travaux'} content={props.description as string}
                   onClose={() => setShowInfo(false)}/>
        </>
    );
}

export default Enigme;