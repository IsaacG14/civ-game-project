import { ReactNode, useRef } from "react";

type Props = {
    id?: string;
    title?: string;
    onClose: () => void;
    onSubmit: () => void;
    cancelText?: string;
    submitText?: string;
    hideCancel?: boolean;
    children: ReactNode | ((close: () => void) => ReactNode)
}

export default function Popup(props: Props) {
    // correctly typed ref for the <dialog> element
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const close = () => { dialogRef.current?.close();}
    return (
        <dialog id={props.id} className="popup-dialog" ref={dialogRef} onClose={props.onClose}>
            {props.title && 
                <h2 className="russo" style={{marginTop:"0"}}>{props.title}</h2>
            }
            
            <img className="close-icon" src="close.svg" alt="close"
                    onClick={ close }/>

            {typeof props.children === "function" 
                ? props.children(close) : props.children}
            
            <div>
                {!props.hideCancel && 
                    <button className="dark-button" type="button" 
                            onClick={  close }>
                        {props.cancelText ?? "Cancel"}
                    </button>
                }
                <button className="light-button" type="button" style={{margin: "0 16px"}}
                        onClick={() => { props.onSubmit(); close(); }}>
                    {props.submitText ?? "Submit"}
                </button>
            </div>
        </dialog>
    );
}