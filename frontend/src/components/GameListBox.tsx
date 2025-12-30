import { DB_Game } from "../db-types";

type GameListBoxProps = {
    gameList: DB_Game[];
    title?: string;
    onRowClick?: (game: DB_Game) => void;
}

export default function GameListBox(props: GameListBoxProps) {

    const itemStyle = { 
        display: "flex", 
        flexDirection: "column",
        gap: "6px", 
        borderRadius: "6px", 
        border: "1px solid var(--primary-light)",
        marginBottom: "12px",
        padding: "6px",
        cursor: "pointer",
    };

    const fieldStyle = {
        flexBasis: "fit",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    };
    
    function formatItem(item: DB_Game) {
        return (
            <div 
                key={item.game_id} 
                className="dark-button" 
                style={itemStyle}
                onClick={() => props.onRowClick?.(item)}
            >
                <div style={fieldStyle}>{item.name}</div>
                <div style={fieldStyle}><small>({item.type_name})</small></div>
            </div>
        )
    }
    
    return (
        <div className="hubBox">
            {props.title && <h2 className="formHeader">{props.title}</h2>}

            {props.gameList.length === 0 ? <p>No Entries</p> : props.gameList.map(formatItem)}
        </div>
    )
}



