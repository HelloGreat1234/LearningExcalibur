import { Engine, Actor, Color, Input, DisplayMode } from "excalibur";
import { useEffect, useRef, useState } from "react";
import { realTimeDatabase, database,auth } from '../fireBaseConfig.js';
import { ref, set, onValue, onChildChanged, onChildAdded, onDisconnect, get } from "firebase/database";
import { setDoc, doc, getDoc } from "firebase/firestore";

const game = new Engine({
    displayMode: DisplayMode.FillScreen
});

const Map = () => {
    const gameRef = useRef(null);
    const paddleRef = useRef(null);

    const [players, SetPlayers] = useState([]);
    const [userId, SetUserID] = useState(null);
    const positionRef = useRef({ x: 0, y: 0 });
    const [userDetails, SetUserDetails] = useState(null)

    const writeUserData = (userId, x, y) => {
        const reference = ref(realTimeDatabase, 'users/' + userId);
        try {
            set(reference, { x, y });
        } catch (error) {
            console.error(error);
        }
    };

    const generateUserId = () => {
        const randomPart = Math.random().toString(36).substr(2, 9);
        const timestampPart = Date.now().toString(36);
        return `${randomPart}${timestampPart}`;
    };

    useEffect(() => {

    }, [])

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            console.log("This is ", user)
            if (user) {

                const uid = user.uid;
                console.log("this is ", uid)
                SetUserID(uid);
                writeUserData(uid, 0, 0);
                try {
                    const docref = doc(database, 'users/', uid);
                    const docSnap = await getDoc(docref);

                    const data = docSnap.id;
                    console.log("This si the fj",data)
                    SetUserDetails(data)
                } catch (error) {
                    console.log(error.message)
                }
            } else {
                SetUserDetails(null)
            }
        })

        
        const handleChildAdded = (snapshot) => {
            const player = snapshot.val();
            SetPlayers((prevPlayers) => [...prevPlayers, { id: snapshot.key, ...player }]);
        };

        const handleChildChanged = (snapshot) => {
            const updatedPlayer = snapshot.val();
            SetPlayers((prevPlayers) =>
                prevPlayers.map((player) =>
                    player.id === snapshot.key ? { ...player, ...updatedPlayer } : player
                )
            );
        };
        const reference = ref(realTimeDatabase, 'users/');

        onChildAdded(reference, handleChildAdded);
        onChildChanged(reference, handleChildChanged);
    }, [userId]);

    useEffect(() => {
        if (!gameRef.current && userDetails) {
            gameRef.current = game;
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.appendChild(game.canvas);
            }
            game.start();
        }

        // Remove all previous paddles before adding new ones
        game.currentScene.actors.forEach(actor => actor.kill());

        players.forEach((player) => {
            const paddle = new Actor({
                x: player.x,
                y: player.y,
                width: 20,
                height: 20,
                color: Color.Red,
            });

            if (player.id === userId) {
                paddleRef.current = paddle;
                positionRef.current.x = player.x;
                positionRef.current.y = player.y;
            }

            game.add(paddle);
        });

        const handleInput = (evt) => {
            let { x, y } = positionRef.current;
            if (evt.key === Input.Keys.Left) {
                x -= 5; // Move left
            } else if (evt.key === Input.Keys.Right) {
                x += 5; // Move right
            } else if (evt.key === Input.Keys.Up) {
                y -= 5; // Move up
            } else if (evt.key === Input.Keys.Down) {
                y += 5; // Move down
            }
            
            writeUserData(userId, x, y);
        };

        game.input.keyboard.on("hold", handleInput);

        const handleResize = () => {
            game.canvas.width = window.innerWidth;
            game.canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            game.input.keyboard.off("hold", handleInput);
            window.removeEventListener('resize', handleResize);
        };
    }, [players,userDetails]);

    return (
        <>
        {userDetails?<>
            <div id="game-container" ></div>
            <div id="ui-container"></div>
        </>:<>
            <div>
                You are not logged in 
            </div>
        </>
        }
            
        </>
    );
};

export default Map;
