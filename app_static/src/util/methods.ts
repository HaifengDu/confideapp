export interface INoop{
    (...args:any[]):any;
}
export interface INoopPromise {
  (...args: any[]): Promise<any>;
}
export const noop:INoop = (...args:any[])=>{}
export const noopPromise: INoopPromise = (...args: any[]) => Promise.resolve<any>({});
