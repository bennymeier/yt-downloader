import axios from "axios";
import { URL } from "./helpers";

export default axios.create({
    baseURL: URL,
    responseType: "json"
});