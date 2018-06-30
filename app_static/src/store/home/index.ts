import { Module} from 'vuex';
import { IHomeState } from '../../interface/IHomeState';
import Mtype from "./mutation_type";
import * as actions from "./actions";
import IRootState from '../../interface/IRootState';
export const store:Module<IHomeState,IRootState> = {
    namespaced:true,
    state:{

    },
    getters:{

    },
    actions:{
        ...actions
    },
    mutations:{

    }
};

export default store;