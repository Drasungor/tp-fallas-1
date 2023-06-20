import axios from "axios";

const profiles = {
  production: "",
  development: "http://localhost:2000"
};

// @ts-ignore
export const API_URL = process.env.REACT_APP_ENV ? profiles[process.env.REACT_APP_ENV] : profiles.development;

const client = axios.create({
  baseURL: API_URL,
  timeout: 120000,
});

export default client;
