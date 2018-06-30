import {Module} from 'vuex';
import { IPaymentState } from '../../interface/IPaymentState';
import Mtype from "./mutation_type";
import * as actions from "./actions";
import IRootState from '../../interface/IRootState';
export const store:Module<IPaymentState,IRootState> = {
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