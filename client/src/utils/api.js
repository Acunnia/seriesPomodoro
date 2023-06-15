import axios from 'axios'

const config = {
    baseURL: `http://localhost:4000/api/`,
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
    }
}

export default axios.create(config)
