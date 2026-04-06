import { makeUseAxios } from "axios-hooks";
import { axiosApiInstance as axios } from "@/services/axios-api-instance";

export { axios };

const useAxios = makeUseAxios({ axios });

export default useAxios;
