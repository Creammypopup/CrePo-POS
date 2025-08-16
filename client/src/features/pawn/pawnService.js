// client/src/features/pawn/pawnService.js
import axios from 'axios';

const API_URL = '/api/pawns/';

// Temporarily remove token requirement
// const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

// const getConfig = () => ({
//   headers: {
//     Authorization: `Bearer ${getToken()}`,
//   },
// });

// Get all pawns
const getPawns = async () => {
  // const response = await axios.get(API_URL, getConfig());
  const response = await axios.get(API_URL); // No config for now
  return response.data;
};

// Create a new pawn
const createPawn = async (pawnData) => {
  // const response = await axios.post(API_URL, pawnData, getConfig());
  const response = await axios.post(API_URL, pawnData); // No config for now
  return response.data;
};

// Update a pawn
const updatePawn = async (pawnData) => {
  // const response = await axios.put(API_URL + pawnData._id, pawnData, getConfig());
  const response = await axios.put(API_URL + pawnData._id, pawnData); // No config for now
  return response.data;
};

// Delete a pawn
const deletePawn = async (pawnId) => {
    // const response = await axios.delete(API_URL + pawnId, getConfig());
    const response = await axios.delete(API_URL + pawnId); // No config for now
    return response.data;
}

const pawnService = {
  getPawns,
  createPawn,
  updatePawn,
  deletePawn,
};

export default pawnService;