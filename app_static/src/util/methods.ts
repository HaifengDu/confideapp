export interface INoop{
    (...args:any[]):any;
}
export const noop:INoop = (...args:any[])=>{}