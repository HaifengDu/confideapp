
import Vue,{VNode} from "vue"
import { AxiosInstance } from "axios";

declare module '*';

declare module "*.vue" {
    export default Vue
}

declare interface AxiosRequestConfig {
    cache?:boolean;
}
declare module "vue/types/vue" {
    interface Vue {
      axios: AxiosInstance;
      $http: AxiosInstance;
    }
}
