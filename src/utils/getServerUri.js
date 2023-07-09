import { axiosBase } from "./useAxios";
export default function getServerUri (params = new  URL(axiosBase.getUri())) {
    const url = new URL(axiosBase.getUri());
    Object.keys(params).forEach(param => {
        url[param] = params[param];
    });
    return url;
}