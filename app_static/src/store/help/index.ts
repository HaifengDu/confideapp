import {Module} from 'vuex';
import { IHelpState } from '../../interface/IHelpState';
import Mtype from "./mutation_type";
import * as actions from "./actions";
import { IRootState } from '../../interface/IRootState';
export const store:Module<IHelpState,IRootState> = {
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