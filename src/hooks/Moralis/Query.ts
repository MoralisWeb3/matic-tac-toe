import React from "react";
import Moralis from "moralis";

const defaultFilter = (_q) => {};
const defaultParams = [];
const defaultOnCreate = (object, vs) => [object].concat(vs ?? []);
const defaultOnUpdate = (object, vs) =>
  vs.map((v) => (v.id === object.id ? object : v));

type IAsyncState<V = any> = {
  data: null | V[];
  error: null | Error;
  loading: boolean;
  refetch: () => Promise<any>;
};

export function useMoralisQuery(
  className,
  {
    live = false,
    skip = false,
    filter = defaultFilter,
    params = defaultParams,
    onCreate = defaultOnCreate,
    onUpdate = defaultOnUpdate,
  } = {}
) {
  const fetch = () => {
    setState((v) => ({ ...v, loading: true }));
    return query.current
      .find()
      .then((data) => {
        setState(v => ({ ...v, data, error: null, loading: false }));
      })
      .catch((error) => {
        setState(v => ({ ...v, data: null, error, loading: false }));
      });
  };

  const query = React.useRef<any>(null);
  const refetch = () => fetch()
  const [state, setState] = React.useState<IAsyncState>({
    data: null,
    error: null,
    loading: false,
    refetch,
  });

  const filterFn = React.useCallback((query) => {
    if (typeof filter === "function") {
      filter(query);
    }
  }, params);

  React.useEffect(() => {
    if (skip) return;
    query.current = new Moralis.Query(className);

    filterFn(query.current);
    fetch();

    if (live) {
      query.current
        .subscribe()
        .then((sub) => {
          sub.on("create", (object) => {
            setState((v) => {
              const data = onCreate(object, v.data);
              return { ...v, data };
            });
          });
          sub.on("update", (object) => {
            setState((v) => {
              const data = onUpdate(object, v.data);
              return { ...v, data };
            });
          });
        })
        .catch((e) => console.warn(`${className} sub error, ${e}`));
    }
  }, [className, skip, live, filterFn]);

  return state;
}
