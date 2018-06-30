import {Module} from 'vuex';
import { IListState } from '../../interface/IListState';
import Mtype from "./mutation_type";
import * as actions from "./actions";
import IRootState from '../../interface/IRootState';
export const store:Module<IListState,IRootState> = {
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