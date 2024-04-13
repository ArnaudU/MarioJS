import { useState } from "react";
import GameMenu, { GameMenuProps } from "./menu";
import Canvas from "../canvas";
import Loader from "./loader";

interface LevelItem {
    label: string;
    action: () => void;
}

interface LevelMenuItem {
    items: LevelItem[];
}

export const LevelMenu: React.FC<GameMenuProps> = ({ size }) => {

    const [levelOnClick, setLevelOnClick] = useState<string>("");

    // Définir les éléments du menu
    const levelItems: LevelItem[] = [
        { label: 'Introduction', action: () => { setLevelOnClick("level0") } },
        { label: 'La carapace', action: () => { setLevelOnClick("level1") } },
        { label: "L'infranchissable", action: () => { setLevelOnClick("level2") } },
        { label: 'Le saut éternel', action: () => { setLevelOnClick("level3") } },
        { label: 'Le sacrifice', action: () => { setLevelOnClick("level4") } },
        { label: 'Go Back', action: () => { setLevelOnClick("back") } },
    ];
    if (levelOnClick === "back") {
        return <GameMenu size={size} />
    }

    if (levelOnClick !== "") {
        return size ? <Canvas {...size} level={levelOnClick} /> : <Loader />
    }

    return (
        <div className="menu" >
            <h1>Level Mario</h1>
            <ul>
                {levelItems.map((item, index) => (
                    <li key={index} onClick={item.action}>
                        {item.label}
                    </li>
                ))}
            </ul>
        </div >
    );

}
