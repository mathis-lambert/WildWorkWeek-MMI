import {useState} from "react";
import LocationCTA from "../LocationCallToAction/LocationCTA.tsx";
import Modal from "../Modal/Modal.tsx";

interface BoutiqueObjetProps {
    top: number;
    left: number;
    width: number;
    height: number;
    modal: {
        title: string;
        content: string;
    };
    debug?: boolean;
    image?: string;
}

const BoutiqueObjet = (props: BoutiqueObjetProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <LocationCTA top={props.top}
                         left={props.left}
                         width={props.width}
                         height={props.height}
                         onClick={() => setOpen(true)}
                         className={"boutique-objet " + (props.debug ? "debug" : "")}
                         image={props.image}
            />

            <Modal open={open} title={props.modal.title} content={props.modal.content} onClose={() => setOpen(false)}/>
        </>

    );
}

export default BoutiqueObjet;