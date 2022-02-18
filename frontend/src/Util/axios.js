import axios from 'axios' 


const config = {
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 1000,
    headers: {
        'X-Custom-Header': 'kaban-api',
        "Content-Type": "application/json"
    }
}

const instance = axios.create(config);


const axiosGetInterface = async (path = "/", config = {}) => {
    try {
        return await instance.get(path, config)
    } catch (error) {
        return error;
    }
}

const axiosPostInterface = async (path = "/", optionsdata = {}, config = {}) => {
    try {
        return await instance.post(path, optionsdata, config)
    } catch (error) {
        return error;
    }
}

const axiosPutInterface = async (path = '/', optionsdata = {}, config = {}) => {
    try {
        return await instance.put(path, optionsdata, config)
    } catch (error) {
        return error;
    }
}

const axiosDeleteInterface = async (path = '/', optionsdata = {}, config = {}) => {
    try {

        return await instance.delete(path, optionsdata, config)
    } catch (error) {
        return error;
    }
}


const axiosPatchInterface = async (path = '/', optionsdata = {}, config = {}) => {
    try {
        return await instance.patch(path, optionsdata, config)
    } catch (error) {
        return error;
    }
}


export {
    axiosGetInterface,
    axiosPostInterface,
    axiosPutInterface,
    axiosDeleteInterface,
    axiosPatchInterface
}