import { IPriceSetting } from "../interface/model/IPriceSetting";
import ErrorMsg from "../model/ErrorMsg";
export default class PriceSettingBiz {
    static readonly WordLimit: {
        [EPriceCircle.Fifteen]: {
            min: number;
            max: number;
        };
        [EPriceCircle.Thirty]: {
            min: number;
            max: number;
        };
        [EPriceCircle.FortyFive]: {
            min: number;
            max: number;
        };
        [EPriceCircle.Sixty]: {
            min: number;
            max: number;
        };
    };
    static readonly CallLimit: {
        min: number;
        max: number;
    };
    static readonly CallMinTime: number;
    /**
     * 当月最多修改次数
     */
    static readonly MaxChangeCount: number;
    private static _instance;
    private constructor();
    /**
     * 文字设置价格验证
     * @param pricesettings
     */
    checkWordSetting(pricesettings: IPriceSetting[]): ErrorMsg;
    /**
     * 通话价格设置验证
     * @param pricesettings
     */
    checkCallSetting(pricesettings: IPriceSetting[]): ErrorMsg;
    private checkLimit;
    private simpleCheck;
    private checkCircle;
    static createInstance(): void;
    static getInstance(): PriceSettingBiz;
}
//# sourceMappingURL=PriceSettingBiz.d.ts.map