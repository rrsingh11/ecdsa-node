import axios from "axios";

const server = axios.create({
  baseURL: "https://ecdsa-node-production.up.railway.app",
});

export default server;
