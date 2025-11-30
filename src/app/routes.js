const routes = {
  categories: {
    url: "https://jlorenzo.ddns.net/carta_restaurante/categorias/:id?",
    params: { usuario_id: 1 }, // defautl params for this action
    get: {
      url: "https://jlorenzo.ddns.net/carta_restaurante/categorias/:id?/",
    },
    post: {
      url: "https://jlorenzo.ddns.net/carta_restaurante/categorias/",
    },
    // put: {
    //   url: "https://jlorenzo.ddns.net/carta_restaurante/categorias/:id",
    // },
    // delete: {
    //   url: "https://jlorenzo.ddns.net/carta_restaurante/categorias/:id",
    // },
  },
  items: {
    url: "https://jlorenzo.ddns.net/carta_restaurante/productos/:id?",
    params: { usuario_id: 1 },
  },
};

export default routes;
