import { useEffect, useState } from "react";
import '../css/login.css'
import { FcGoogle } from "react-icons/fc";
import { auth, database } from '../fireBaseConfig.js';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const Login = () => {

    const [switchState, setSwitchState] = useState(true)
    const [showError, setShowError] = useState("")

    const changeState = (event) => {
        event.preventDefault();
        setSwitchState(prevSwitchState => !prevSwitchState)
    }

    const Login = async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const pass = document.getElementById('pass').value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, name, pass)
            console.log(userCredential.user)
            localStorage.setItem("UserId",userCredential.user.uid)
            window.location.href = '/map'
        } catch (error) {
            console.log(error)
            setShowError("Invalid Email Or Password")
        }

    }

    const SignUp = async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const pass = document.getElementById('pass').value;

        console.log(name, pass)

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, name, pass)

            console.log(userCredential.user)

            if (userCredential) {
                await setDoc(doc(database, "users/", userCredential.user.uid),{
                    userEmail : name
                })
            }
        } catch (error) {
            console.log(error.message)
        }

        setSwitchState(true)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
            console.log("auth function",user)
           
        })
        return() => unsubscribe();
    },[])


    return (
        <>
            <div className="outer-box">
                <form className="form">
                    {switchState ? <>
                        <p className="heading">Login</p>
                        <button className="continue"><FcGoogle size={20} />Continue with Google</button>
                        <p className="or">or</p>
                        <input type="text" className="input-box username" placeholder="Username" id="name" />
                        <input type="password" className="input-box pass" placeholder="Password" id="pass" />
                        {/* {showError?<p>Hello</p>:""} */}
                        <p className="error">{showError}</p>
                        <button type="submit" className="submit" onClick={Login}>Log in </button>
                        <p className="or">
                            No Account ?
                            <button className="switch" onClick={changeState}>Create one</button>
                        </p>
                    </> : <>
                        <p className="heading">Sign Up</p>
                        <button className="continue">Continue with Google</button>
                        <p className="or">or</p>
                        <input type="text" className="input-box username" placeholder="Username" id="name" />
                        <input type="password" className="input-box pass" placeholder="Password" id="pass" />
                        <button type="submit" className="submit" onClick={SignUp}>Create Account</button>
                        <p className="or">
                            Already have an Account ?
                            <button className="switch" onClick={changeState}>Login</button>
                        </p>
                    </>}

                </form>
            </div>
        </>
    );
}

export default Login;