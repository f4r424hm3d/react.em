import axios from "axios";

const api = axios.create({
  baseURL: "https://www.educationmalaysia.in/api", // ✅ Correct base URL
  headers: {
    "x-api-key": "vN7kO8pM6vGz1Nz0Vw4k5AjcB5n9hTzY6QsErK8gNbE=", // ✅ Your real API key
  },
});

export default api;
