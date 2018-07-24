/**
 * 订单状态
 */
export enum EOrderStatus{
    //待付款
    Awaiting_Payment=1,
    //已付款
    Paid,
    //已取消
    Cancelled,
    //服务中
    Servicing,
    //待评论
    Awaiting_Comment,
    //已完成
    Completed
}
export default EOrderStatus;