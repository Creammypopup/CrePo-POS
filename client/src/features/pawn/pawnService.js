// client/src/features/pawn/pawnService.js
import axios from 'axios';

const API_URL = '/api/pawns/';

const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;
const getConfig = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const getPawns = async () => {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
};

const createPawn = async (pawnData) => {
    const response = await axios.post(API_URL, pawnData, getConfig());
    return response.data;
};

const updatePawn = async (pawnData) => {
    const response = await axios.put(API_URL + pawnData._id, pawnData, getConfig());
    return response.data;
}

const deletePawn = async (pawnId) => {
    const response = await axios.delete(API_URL + pawnId, getConfig());
    return response.data;
}

const pawnService = {
    getPawns,
    createPawn,
    updatePawn,
    deletePawn,
};

export default pawnService;