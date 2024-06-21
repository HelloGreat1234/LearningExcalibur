import { useEffect, useState } from "react";
import { auth, database } from "../fireBaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const Temp = () => {

    const [userDetails, SetUserDetails] = useState('')

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            console.log("This is ", user)
            if (user) {

                const uid = user.uid;
                try {
                    const docref = doc(database, 'users/', uid);
                    const docSnap = await getDoc(docref);
                    // if(docSnap.exists()){
                    //     SetUserDetails(docSnap)
                    // }
                    const data = docSnap.id;
                    console.log(data)
                    SetUserDetails(data)
                } catch (error) {
                    console.log(error.message)
                }
            }else{
                SetUserDetails("User not logged in ")
            }
        })
    }, [])

    const logout = async () => {
        await signOut(auth);
        window.location.href = '/login'
    }

    return (
        <>
            <div>
                Hello,{userDetails}
            </div>
            <button onClick={logout}>Logout</button>
        </>
    );
}

export default Temp;