type Props = {
    id: string, 
    label: string,
    value: string, 
    setValue: (value: string) => void,
    isPassword?: boolean,
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
                required />
        </div>
    );
}