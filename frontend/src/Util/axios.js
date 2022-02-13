import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.BASE_API_URL,
    timeout: 1000,
    headers: { 'X-Custom-Header': 'kaban-api' }
});


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
        return await instance.delete(path, config)
    } catch (error) {
        return error;
    }
}


export {
    axiosGetInterface,
    axiosPostInterface,
    axiosPutInterface,
    axiosDeleteInterface
}