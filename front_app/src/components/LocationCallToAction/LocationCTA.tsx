import './LocationCTA.scss';

interface LocationCTAProps {
    className?: string;
    top: number;
    left: number;
    width: number;
    height: number;
    image?: string;
    onClick: () => void;
    debug?: boolean;
}

const LocationCTA = (props: LocationCTAProps) => {
    return (
        <div
            className={"location-cta" + (props.className ? ` ${props.className}` : "") + (props.debug ? " debug" : "")}
            style={{
                top: `${props.top}%`,
                left: `${props.left}%`,
                width: `${props.width}%`,
                height: `${props.height}%`
            }}
            onClick={props.onClick}
        >
            {props.image && <img src={props.image} alt=""/>}
        </div>
    );
}

export default LocationCTA;