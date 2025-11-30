// Base on the proposal at https://kentcdodds.com/blog/application-state-management-with-react
// this documents tries to create an example of API fetch from scratch for learning purposes
// AUTHOR: Miguel Ángel Figueroa García
// Further Reference: https://github.com/mianfiga/api-dev/tree/resource

// HOW TO USE:
// top level component [./App.jsx]:
//   import { ResourceProvider } from "./contexts/resource";
//   import routes from "./routes";
//   ...
//   <ResourceProvider routes={routes}>
//     <h3>Users</h3>
//     <UserList />
//     <h3>Items</h3>
//     <ItemList />
//   </ResourceProvider>
//
// Routes [./routes.js]:
//   const routes = {
//     users: { //routes for resource User
//       url: "/api/users/:id?", //default route for all actions
//       params: {}, // default params for all action
//       options: {}, // default options for all action
//       get: { // Specific get action configuration optional
//         url: "/api/users/:id?",
//         params: {example: 1}
//         options: {example: 2}
//       },
//       post: {
//         url: "/api/users/,
//       },
//     },
//     items: { //routes for resource Items
//       url: "/api/items.json",
//       options: {},
//       get: {
//         url: "/api/items.json",
//       },
//     },
//   };
//
//   export default routes;
//
//
// Inner component:
//   import { useEffect } from "react";
//   import { useResource } from "../contexts/resource";
//
//   export default function UserList() {
//     const [userResource, userApi] = useResource('users');
//     // if you need to storage several resources from same source
//     // i.e.: list of users, list of admin users, current user, user being edited in form, ...
//     // you can use scopes:
//     // const [userResource, userApi] = useResource('users'); // this is the default scope;
//     // const [userResource, userApi] = useResource('users', 'admins');  // this is the 'admin' scope,
//                                                                         // like a different storage;
//     // const [userResource, userApi] = useResource('users', 'current'); // this is the 'current' scope;
//                                                                         // name it as you like;
//
//     useEffect( () =>{
//       if (!userResource.loaded && !userResource.loading && !userResource.error) {
//         userApi.get();
//         console.log('GET');
//       }
//     }, []);
//     console.log(userResource);
//
//     return (
//       <>
//         {userResource.loaging && <strong>loading</strong>}
//         {userResource.error && <strong>Error</strong>}
//         {userResource.loaded && userResource.data.map((data, key) => <div key={key}>{data.name}</div>)}
//       </>
//     );
// }

"use client";

import * as React from "react";

// pattern-url.js CHATGPT
export class PatternURL {
  constructor(pattern) {
    this.pattern = pattern;
    const { parts, keys } = this.parsePattern(pattern);
    this.parts = parts; // trozos de la URL (texto o key)
    this.keys = keys; // info de cada key: { name, optional }
  }

  // Parsea el patrón conservando orden y opcionalidad
  parsePattern(pattern) {
    const regex = /(:[A-Za-z0-9_]+[?]?)/g;
    const keys = [];
    const parts = [];
    let lastIndex = 0;

    let match;
    while ((match = regex.exec(pattern)) !== null) {
      const token = match[0];
      const start = match.index;

      // texto entre keys
      if (start > lastIndex) {
        parts.push({ type: "text", value: pattern.slice(lastIndex, start) });
      }

      const isOptional = token.endsWith("?");
      const name = token.replace(":", "").replace("?", "");

      parts.push({ type: "key", name, optional: isOptional });
      keys.push({ name, optional: isOptional });

      lastIndex = start + token.length;
    }

    // texto final después de la última key
    if (lastIndex < pattern.length) {
      parts.push({ type: "text", value: pattern.slice(lastIndex) });
    }

    return { parts, keys };
  }

  // Construye la URL a partir del patrón y los params
  build(params = {}) {
    let url = "";

    for (const part of this.parts) {
      if (part.type === "text") {
        url += part.value;
        continue;
      }

      // Es un parámetro de la ruta
      const { name, optional } = part;

      if (params[name] == null) {
        // si no viene y es opcional → no se añade nada (aunque quede "//")
        if (optional) continue;
        throw new Error(
          `Missing required param '${name}' for pattern '${this.pattern}'`
        );
      }

      url += encodeURIComponent(params[name]);
    }

    // Quitar dobles "/" generados por opcionales vacíos
    url = url.replace(/\/+/g, "/");

    // Eliminar "/" al final si no estaba en el patrón original
    if (url.length > 1 && this.pattern.at(-1) !== "/") {
      url = url.replace(/\/$/, "");
    }

    // Añadir query params sobrantes
    const queryEntries = Object.entries(params).filter(
      ([key]) => !this.keys.some((k) => k.name === key)
    );

    if (queryEntries.length > 0) {
      const qs = queryEntries
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");

      url += `?${qs}`;
    }

    return url;
  }
}
// end CHATGPT

const ResourceContext = React.createContext();
const DEFAULT_EMPTY_RESOURCE = {
  default: {
    data: [],
    loading: false,
    loaded: false,
    error: false,
    // params: ,
    // pagination: ,
    // pending: ,
  },
};

function resourceReducer(state, action) {
  console.log(action.type, action, state);
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        [action.resource]: {
          ...state[action.resource],
          [action.scope]: {
            ...(state[action.resource][action.scope] ||
              DEFAULT_EMPTY_RESOURCE.default),
            data: {...action.payload.data},
          },
        },
      };
    case "FETCH_STARTED":
      return {
        ...state,
        [action.resource]: {
          ...state[action.resource],
          [action.scope]: {
            ...(state[action.resource][action.scope] ||
              DEFAULT_EMPTY_RESOURCE.default),
            loading: true,
          },
        },
      };
    case "FETCH_SUCCEEDED":
      return {
        ...state,
        [action.resource]: {
          ...state[action.resource],
          [action.scope]: {
            ...(state[action.resource][action.scope] ||
              DEFAULT_EMPTY_RESOURCE.default),
            loaded: true,
            loading: false,
            data: action.updateStateWithFetchedData
              ? action.payload.data
              : state[action.resource][action.scope].data,
          },
        },
      };
    case "FETCH_FAILED":
      return {
        ...state,
        [action.resource]: {
          ...state[action.resource],
          [action.scope]: {
            ...(state[action.resource][action.scope] ||
              DEFAULT_EMPTY_RESOURCE.default),
            loaded: false,
            loading: false,
            error: action.payload.error,
          },
        },
      };
    default: {
      throw new Error(`Unsupported action type: ${action.type}`);
    }
  }
}

// eslint-disable-next-line react/prop-types
function ResourceProvider({ routes, ...props }) {
  const initialState = {};
  for (const key in routes) {
    initialState[key] = { ...DEFAULT_EMPTY_RESOURCE };
  }
  const [resource, dispatchResource] = React.useReducer(
    resourceReducer,
    initialState
  );
  return (
    <ResourceContext.Provider
      value={[resource, dispatchResource, routes]}
      {...props}
    />
  );
}

const useResource = (resource, scope = "default") => {
  const context = React.useContext(ResourceContext);
  if (!context) {
    throw new Error(`useResource must be used within a Provider`);
  }

  const [state, dispatch, routes] = context;

  const set = (data) => {
    dispatch({
      type: "SET_DATA",
      resource,
      scope,
      payload: {
        data,
      },
    });
  };

  const fetch = (
    params = {},
    options = {},
    action = "get",
    updateStateWithFetchedData = true
  ) => {
    const url = new PatternURL(
      routes[resource]?.[action]?.url || routes[resource].url
    );

    const promise = window.fetch(
      url.build({
        ...routes[resource]?.params,
        ...routes[resource]?.[action]?.params,
        ...params,
      }),
      {
        ...routes[resource].options,
        ...options,
      }
    );

    dispatch({
      type: "FETCH_STARTED",
      resource,
      scope,
      payload: {
        params,
        options,
        action,
        updateStateWithFetchedData,
      },
      updateStateWithFetchedData,
    });

    promise
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(new Error(response.statusText));
        }
      })
      .then((data) =>
        dispatch({
          type: "FETCH_SUCCEEDED",
          resource,
          scope,
          payload: {
            data,
          },
          updateStateWithFetchedData,
        })
      )
      .catch((error) => {
        dispatch({
          type: "FETCH_FAILED",
          resource,
          scope,
          payload: {
            error,
          },
          updateStateWithFetchedData,
        });
      });
    return promise;
  };

  const GET = (params = {}, options = {}, updateStateWithFetchedData = true) =>
    fetch(
      params,
      { method: "GET", ...options },
      "get",
      updateStateWithFetchedData
    );
  const post = (
    params = {},
    options = {},
    updateStateWithFetchedData = false
  ) =>
    fetch(
      params,
      { method: "POST", ...options },
      "post",
      updateStateWithFetchedData
    );
  const put = (params = {}, options = {}, updateStateWithFetchedData = false) =>
    fetch(
      params,
      { method: "PUT", ...options },
      "put",
      updateStateWithFetchedData
    );
  const remove = (
    params = {},
    options = {},
    updateStateWithFetchedData = false
  ) =>
    fetch(
      params,
      { method: "DELETE", ...options },
      "delete",
      updateStateWithFetchedData
    );

  if (!state[resource]) {
    throw new Error(`No routes for resource "${resource}".`);
  }

  return [
    state[resource][scope] || { ...DEFAULT_EMPTY_RESOURCE.default },
    {
      get: GET,
      post,
      put,
      remove,
      fetch,
      set,
    },
  ];
};

export { ResourceProvider, useResource };
