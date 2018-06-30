import {Module} from 'vuex';
import { IOrderState } from '../../interface/IOrderState';
import Mtype from "./mutation_type";
import * as actions from "./actions";
import IRootState from '../../interface/IRootState';
export const store:Module<IOrderState,IRootState> = {
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