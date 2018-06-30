import Axios from "axios";
import "./util/axiosConfig";
import "./util/extend";
import "./filter";
import "./directive";
import httpIntercept from "./util/httpIntercept";
import cacheWraperAxios from "./util/extendAxios";
httpIntercept(Axios);
cacheWraperAxios(Axios);