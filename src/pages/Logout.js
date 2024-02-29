import { useContext, useEffect } from "react"
import UserContext from "../UserContext"
import { useNavigate } from "react-router-dom";


export default function Logout () {

    const {clearUser, setUser} = useContext(UserContext);
    const navigate = useNavigate();

    clearUser();

    useEffect(() => {
        setUser({
            id: null,
            idAdmin: null
        })
        navigate('/login')
    })
    
}