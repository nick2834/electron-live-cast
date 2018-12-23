
import axios from 'axios';

let base = '';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getRoomList = params => { return axios.get(`${base}/room/list`, { params: params }); };