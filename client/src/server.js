import axios from "axios";

const server = axios.create({
  baseURL: "https://ecdsa-node-api.vercel.app/",
});

export default server;
