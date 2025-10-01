import { useState } from 'react';

function ExampleComponent() {
    const [json, setJson] = useState<null|string>(null);

    /*
    type Player = {
        id: number;
        name: string;
        civilization: string;
        score: number;
    };
    */

    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/players');
            const data = await response.json();
            setJson(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error fetching JSON data:', error);
        }
    }

    let jsonDisplay;
    if (json) {
        jsonDisplay = <pre style={{ textAlign: 'left' }}>{json}</pre>;
    } else {
        jsonDisplay = <button className="button" onClick={fetchData}>Load JSON Data</button>;
    }

    return (
        <div className="exampleComponent">
            <h2>Example Component</h2>
            <p>This is an example component I made 0_0</p>
            { jsonDisplay }
        </div>
    )
}

export default ExampleComponent;
