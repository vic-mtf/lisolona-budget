import axios from "axios";
import { makeUseAxios } from "axios-hooks";
import axiosConfig from "../configs/axios-config.json";

export const axiosBase = axios.create(axiosConfig);
const useAxios = makeUseAxios({
  axios: axiosBase,
});

export default useAxios;
