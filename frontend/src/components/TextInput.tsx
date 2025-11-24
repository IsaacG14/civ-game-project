type Props = {
    id: string, 
    label: string,
    value: string, 
    setValue: (value: string) => void,
    isPassword: boolean,
    onEnterPress: (e: any) => void,
}

export default function TextInput(props: Props) {
    return (
        <div className="formTextInput">
            <label htmlFor={props.id} className="cuprum-600">
                {props.label}
            </label>

            <input id={props.id} 
                type={props.isPassword ? "password" : "text"}
                value={props.value} 
                className="cuprum-600"
                onChange={(e) => props.setValue(e.target.value)} 
                onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            e.currentTarget.blur();
                            props.onEnterPress(e);
                        }
                    } 
                }/>
        </div>
    );
}