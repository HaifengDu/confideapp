import {Module} from 'vuex';
import { IMyState } from '../../interface/IMyState';
import Mtype from "./mutation_type";
import * as actions from "./actions";
import IRootState from '../../interface/IRootState';
export const store:Module<IMyState,IRootState> = {
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