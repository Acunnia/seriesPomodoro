import React, {useState, useContext} from "react";
import api from '../utils/api'



const Login = props => {
    const [waiting, setWaiting] = useState(false)

    const onFinish = values => {
        setWaiting(true)
        api.post("users/login", {
            email: values.email,
            password: walues.password,
        })
    }


}
