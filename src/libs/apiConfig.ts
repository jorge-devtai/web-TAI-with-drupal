const domain = import.meta.env.PUBLIC_DRUPAL_BASE_URL as string; 

const apiUrl = `${domain}/jsonapi`;
//const apiUrl = `http://localhost:8888/jsonapi`;

const endpoints = {
  articles: `${apiUrl}/node/article`,
  pages: `${apiUrl}/node/page`,
  tags: `${apiUrl}/taxonomy_term/tags`,
  authors: `${apiUrl}/user/user`,
};

export { domain, apiUrl, endpoints};
