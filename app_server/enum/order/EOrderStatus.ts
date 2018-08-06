/**
 * 订单状态
 */
export enum EOrderStatus{
    /**
     * 待付款
     */
    Awaiting_Payment=1,
    /**
     * 已付款
     */
    Paid,
    /**
     * 服务中
     */
    Servicing,
    /**
     * 待评论
     */
    Awaiting_Comment,
    /**
     * 已取消
     */
    Cancelled,
    /**
     * 已完成
     */
    Completed,
    /**
     * 退款审核中
     */
    RefundAudit,
    /**
     * 退款
     */
    Refund
}
export default EOrderStatus;