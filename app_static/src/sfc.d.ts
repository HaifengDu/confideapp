
import Vue,{VNode} from "vue"
import { AxiosInstance } from "axios";
import VueRouter, { Route, RawLocation, NavigationGuard } from "vue-router";

declare module '*';

declare module "*.vue" {
    export default Vue
}

// tslint:disable-next-line:interface-name
declare interface Date {
    format ?: (fmt: string)=>string;
}
declare interface AxiosRequestConfig {
    cache?:boolean;
}
declare module "vue/types/vue" {
    interface Vue {
      axios: AxiosInstance;
      $http: AxiosInstance;
      $router: VueRouter;
      $route: Route;
      $toast:any;
    }
}
declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    router?: VueRouter;
    beforeRouteEnter?: NavigationGuard;
    beforeRouteLeave?: NavigationGuard;
    beforeRouteUpdate?: NavigationGuard;
  }
}

