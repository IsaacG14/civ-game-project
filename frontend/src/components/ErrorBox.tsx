type Props = {
    id?: string;
    message: string|null;
    setMessage: (value: string|null) => void;
}

export default function ErrorBox(props: Props) {
    if (props.message === null) return (<></>);

    return (
        <div id={props.id} className="error-box" style={{ position: "relative", padding: "8px 36px 8px 8px" }}>
            <div>{props.message}</div>
            <img
                src="close.svg"
                alt="close"
                onClick={() => props.setMessage(null)}
                style={{
                    position: "absolute",
                    right: "8px",
                    top: "8px",
                    width: "20px",
                    height: "20px",
                    cursor: "pointer"
                }}
            />
        </div>
    );
}