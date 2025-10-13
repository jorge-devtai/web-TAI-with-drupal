
import apiConfig from '@libs/apiConfig';

const { endpoints } = apiConfig;

export async function getDataForm() {
  try {
    const response = await fetch(endpoints.pageForms);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const payload = await response.json();
    
    if (!Array.isArray(payload.data) || payload.data.length === 0) {
      throw new Error("Data is not in expected format or is empty");
    }   

    const formsData = payload.data.map((form: any) => {
      const {
        id = "",
        attributes: {
          title: titleForm = "",
          field_description: descriptionForm = "",
          drupal_internal__nid: nid = "",
          path: { alias = "" } = {},
        } = {},
        relationships: {
          field_gge_banner_image: {
            data: bannerData = {},
            links: bannerLinks = {},
          } = {},
        } = {},
      } = form;

      const {
        id: bannerId = "",
        meta: { drupal_internal__target_id: bannerInternalId = "" } = {},
      } = bannerData;

      const bannerUrl = bannerLinks?.related?.href || "";
      const formUrl = alias ? alias : `/node/${nid}`;

      return {
        id,
        titleForm,
        descriptionForm,
        alias,
        formUrl,
        banner: {
          bannerId,
          bannerInternalId,
          bannerUrl,
        },
      };
    });

    console.log("All forms drupal service:", formsData);
    return formsData;

  } catch (error) {
    console.error("Error fetching forms list:", error);
    return null;
  }
}

export async function getLeadForms() {
  try {
    const response = await fetch(endpoints.leadForms);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const payload = await response.json();
    
    if (!Array.isArray(payload.data)) throw new Error("Lead forms data is not in expected format");
    
    // Filtrar solo formularios activos (status: true)
    const activeForms = payload.data.filter((form: any) => 
      form.attributes.status === true
    );

    console.log("Active lead forms:", activeForms);

    return activeForms;
  } catch (error) {
    console.error("Error fetching lead forms:", error);
    return null;
  }
}

// Función para combinar datos
export async function getCombinedForms() {
  try {
    const [pageForms, leadForms] = await Promise.all([
      getDataForm(),
      getLeadForms()
    ]);

    if (!pageForms || !leadForms) {
      return null;
    }

    const combined = [];

    for (const pageForm of pageForms) {
      // Buscar el formulario lead que coincida por path
      const matchingLeadForm = leadForms.find((leadForm:any) => {
        try {
          const leadFormData = JSON.parse(leadForm.attributes.description);
          return leadFormData.config.path === pageForm.alias;
        } catch (e) {
          console.warn('Error parsing lead form description:', e);
          return false;
        }
      });

      if (matchingLeadForm) {
        try {
          const leadFormData = JSON.parse(matchingLeadForm.attributes.description);
          combined.push({
            pageData: pageForm,
            leadFormConfig: matchingLeadForm,
            leadFormData
          });
        } catch (e) {
          console.warn('Error parsing lead form data for:', pageForm.alias, e);
        }
      }
    }

    console.log("Combined forms:", combined);
    return combined;

  } catch (error) {
    console.error("Error combining forms data:", error);
    return null;
  }
}

export async function getFormBySlug(slug: string) {
  const forms = await getCombinedForms();
  return forms?.find(form => 
    form.pageData.alias === `/${slug}` || 
    form.pageData.formUrl === `/${slug}` ||
    form.leadFormData.config.path === `/${slug}`
  ) || null;
}

/* export async function getFormBySlug(slug: string) {
  const forms = await getDataForm();
  return forms?.find((form: any) => form.alias === `/${slug}` || form.formUrl === `/${slug}`) || null;
} */