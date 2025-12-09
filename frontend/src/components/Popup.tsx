import { ReactNode } from "react";

type Props = {
    id?: string;
    title?: string;
    close: () => void;
    submit: () => void;
    cancelText?: string;
    submitText?: string;
    hideCancel?: boolean;
    children: ReactNode;
}

export default function Popup(props: Props) {
    return (
        <>
            <div className="popup-backdrop" onClick={props.close} />
            <div className="popup-dialog" id={props.id}>
                {props.title && 
                    <h2 className="russo" style={{marginTop: "0"}}>{props.title}</h2>
                }

                <img className="close-icon" src="close.svg" alt="close" onClick={props.close}/>

                {props.children}

                <div style={{marginTop: "16px"}}>
                    {!props.hideCancel && 
                        <button className="dark-button" type="button" 
                                onClick={props.close}>
                            {props.cancelText ?? "Cancel"}
                        </button>
                    }
                    <button className="light-button" type="button" style={{margin: "0 16px"}}
                            onClick={props.submit}>
                        {props.submitText ?? "Submit"}
                    </button>
                </div>
            </div>
        </>
    )
}