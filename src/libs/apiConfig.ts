const domain = import.meta.env.PUBLIC_DRUPAL_DEV_FORMS as string;
const apiUrl = `${domain}/jsonapi`;

const endpoints = {
  forms: `${apiUrl}/gge_af_connector_lead_form/gge_af_connector_lead_form`,
  pageForms: `${apiUrl}/node/forms`,
  leadForms: 'https://drupaldev.taiarts.com/jsonapi/gge_af_connector_lead_form/gge_af_connector_lead_form'
};

export default { domain, apiUrl, endpoints };
