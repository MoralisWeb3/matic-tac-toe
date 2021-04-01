export type IAsync<V = any> = {
  loading: boolean;
  error: null | Error;
  data: null | V;
};

export const initialAsync: IAsync = { loading: false, data: null, error: null };
