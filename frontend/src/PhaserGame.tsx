import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './game/main';
import { EventBus } from './game/EventBus';

export interface IRefPhaserGame
{
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps
{
    onSceneReady?: (scene_instance: Phaser.Scene) => void
}


// Helper function that updates the value of a React ForwardedRef
function updateRef<T>(ref: React.ForwardedRef<T>, newRefValue: T) {
    if (typeof ref === 'function') {
        ref(newRefValue);
    } 
    else if (ref) {
        ref.current = newRefValue;
    }
}


/**
 * A component that wraps {@link Phaser.Game}.
 * Manages creating and destroying the game instance.
 *
 * @param onSceneReady - Optional callback function that is called when a Phaser scene is ready.
 *   Receives the scene instance as its argument.
 */
export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(({ onSceneReady: onSceneReady }, ref) =>
{
    const game = useRef<Phaser.Game | null>(null!);

    useLayoutEffect(() =>
    {
        // The following code is run on mount
        if (game.current === null)
        {
            // We start a new game if one doesn't already exist.
            game.current = StartGame("game-container");

            // Update the ref to point to the right objects
            const newRefValue = { game: game.current, scene: null };
            updateRef(ref, newRefValue);
        }

        // This returned function is run on unmount
        return () =>
        {
            // Destroys the game if it exists.
            if (game.current)
            {
                game.current.destroy(true);
                game.current = null;
            }
        }
    }, [ref] /* <-- Dependency list */ );

    useEffect(() =>
    {
        // The following code is run on mount
        EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) =>
        {
            // When the "current-scene-ready" event triggers...

            // Call the given initialization function `onSceneReady`
            if (onSceneReady && typeof onSceneReady === 'function') {
                onSceneReady(scene_instance);
            }

            // Now that the scene has changed, update the ref to point to the right scene
            const updatedRefValue = { game: game.current, scene: scene_instance };
            updateRef(ref, updatedRefValue);
        });

        // This returned function is run on unmount
        return () => { EventBus.removeListener('current-scene-ready'); };

    }, [onSceneReady, ref] /* <-- Dependency list */ );

    return (
        <div id="game-container"></div>
    );

});
