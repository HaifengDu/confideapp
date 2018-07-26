import { EPayType } from "../../enum/order/EPayType";
import { EOrderStatus } from "../../enum/order/EOrderStatus";
import { EOrderSource } from "../../enum/order/EOrderSource";
import { ECompleteType } from "../../enum/order/ECompleteType";
import { EPriceType } from "../../enum/EPriceType";

/**
 * 订单数据接口
 */
export interface IOrder{
    id?:number,
    /**
     * 微信订单id
     */
    wxorderid?:string,
    /**
     * 生成订单客户
     */
    uid?:number,
    /**
     * 倾听者
     */
    lid?:number,
    /**
     * 单价
     */
    uprice?:number,
    /**
     * 总价
     */
    totalprice?:number,
    /**
     * 需支付的价格
     */
    payprice?:number,
    /**
     * 账号余额
     */
    balance?:number,
    /**
     * 支付类型
     */
    paytype?:EPayType,
    /**
     * 订单来源
     */
    source?:EOrderSource,
    /**
     * 服务类型（通话，文字）
     */
    servicetype?:EPriceType,
    /**
     * 服务时长
     */
    servicetime:number,
    /**
     * 购买时长
     */
    payservicetime:number,
    /**
     * 代理头
     */
    useragent?:string,
    /**
     * 用户ip
     */
    ip?:string,
    /**
     * 用户状态
     */
    status?:EOrderStatus,
    /**
     * 完成类型
     */
    completetype?:ECompleteType,
    /**
     * 备注
     */
    comment?:string,
    /**
     * 创建时间
     */
    ctime?:Date,
    /**
     * 开始支付时间
     */
    paytime?:Date,
    /**
     * 完成支付时间
     */
    paidtime?:Date,
    /**
     * 完成时间
     */
    completedtime?:Date,
    /**
     * 取消时间
     */
    canceltime?:Date,
}

export default IOrder;