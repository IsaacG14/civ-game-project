import { useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import { MainMenu } from './game/scenes/MainMenu';
import ExampleComponent from './ExampleComponent';

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import Hub from "./pages/Hub.jsx";

export default function App()
{
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/hub" />} />

                    <Route path = "/login" element = {<LoginPage />} />
                    <Route path = "/createAccount" element = {<CreateAccount />} />
                    <Route path = "/hub" element = {<Hub />} />
                </Routes>
            </Router>
        </div>
  );
    /*
    // Whether the logo sprite can be moved (is true only while in the MainMenu Scene)
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    // References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    // The position of the logo sprite
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });


    /**
     * Calls the `changeScene` function on the current scene, if it exists.
     */
    function changeScene() 
    {
        if (phaserRef.current === null) return;

        const scene = phaserRef.current.scene as (Phaser.Scene & {changeScene?: () => void});
        if (scene === null || scene.changeScene === undefined) return;

        scene.changeScene();
    }

    /**
     * Creates, pauses, or plays the sprite movement mechanism while in the main menu.
     */
    function moveSprite()
    {
        if (phaserRef.current === null) return;
        
        const scene = phaserRef.current.scene as MainMenu;
        if (scene === null) return;
        
        if (scene.scene.key === 'MainMenu')
        {
            scene.moveLogo(
                (x, y) => { setSpritePosition({ x, y }); }
            );
        }
    
    }

    /**
     * Creates a new star sprite and adds it to the current scene.
     */
    function addSprite() 
    {
        if (phaserRef.current === null) return;
        
        const scene = phaserRef.current.scene;
        if (scene === null) return;
        
        // Make random coordinates for the sprite
        const x = Phaser.Math.Between(64, scene.scale.width - 64);
        const y = Phaser.Math.Between(64, scene.scale.height - 64);

        // `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance.
        const star = scene.add.sprite(x, y, 'star');

        //  Here we create a Phaser Tween to fade the star sprite in and out.
        //  You could, of course, do this from within the Phaser Scene code, but this is just an example
        //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
        scene.add.tween({
            targets: star,
            duration: 500 + Math.random() * 1000,
            alpha: 0,
            yoyo: true,
            repeat: -1
        });
    
    }

    // Intended to be called when the "current-scene-ready" event is emitted from the PhaserGame component
    const onSceneReady = (scene: Phaser.Scene) => {
        setCanMoveSprite(scene.scene.key !== 'MainMenu');
    }

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} onSceneReady={onSceneReady} />
            <div>
                <div>
                    <button className="button" onClick={changeScene}>Change Scene</button>
                </div>
                <div>
                    <button disabled={canMoveSprite} className="button" onClick={moveSprite}>Toggle Movement</button>
                </div>
                <div className="spritePosition">Sprite Position:
                    <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
                </div>
                <div>
                    <button className="button" onClick={addSprite}>Add New Sprite</button>
                </div>
                <ExampleComponent />
            </div>
        </div>
    )
    */
}
