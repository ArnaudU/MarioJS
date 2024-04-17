import React, { useState } from 'react';
import './menu.css'; // Importer le fichier CSS
import Loader from './loader';
import Canvas from '../canvas';
import { LevelMenu } from './menuLevel';

interface MenuItem {
    label: string;
    action: () => void;
}

interface MenuProps {
    items: MenuItem[];
}


const Menu: React.FC<MenuProps> = ({ items }) => {
    return (
        <div className="menu">
            <h1>Menu Principale Super Mario BroWish</h1>
            <ul>
                {items.map((item, index) => (
                    <li key={index} onClick={item.action}>
                        {item.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};


export interface GameMenuProps {
    size: { height: number; width: number } | null;
}

const GameMenu: React.FC<GameMenuProps> = ({ size }) => {

    const [gameOnClick, setGameOnClick] = useState<boolean>(false);
    const [levelMenuOnClick, setLevelMenuOnClick] = useState<boolean>(false);

    // Définir les actions pour chaque élément du menu
    const startGame = () => {
        setGameOnClick(true);
    }

    const levelGame = () => {
        setLevelMenuOnClick(true);
    }

    if (gameOnClick) {
        return size ? <Canvas {...size} level="level0" /> : <Loader />
    }
    else if (levelMenuOnClick) {
        window.location.href = "/level";
    }
    // Définir les éléments du menu
    const menuItems: MenuItem[] = [
        { label: 'Commencer', action: startGame },
        { label: 'Niveau', action: levelGame }
    ];
    return <Menu items={menuItems} />
}
export default GameMenu;
