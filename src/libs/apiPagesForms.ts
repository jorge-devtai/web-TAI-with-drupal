// libs/apiForms.ts
import apiConfig from "@libs/apiConfig";
const { endpoints } = apiConfig;
/* 
export async function getDataForm() {
  try {
    const response = await fetch(endpoints.pageForms);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const payload = await response.json();
    // Ojo: aquí era data.length, debe ser payload.data.length
    if (!Array.isArray(payload.data) || payload.data.length === 0) {
      throw new Error("Data is not in expected format or is empty");
    }

    const formData = payload.data.map((form: any) => {
      const {
        id,
        attributes: {
          title: titleForm = "",
          field_description: description = "",
          path: { alias: pathAlias = "" } = {},
          drupal_internal__id: internalId = "",
        } = {},
      } = form;

        // Te dejo ambos por si los quieres
      return { id, titleForm, description, pathAlias, internalId};
    });

    return formData;
  } catch (error) {
    console.error("Error fetching form data:", error);
    return null;
  }
}

export async function getAllForms() {
    try {
        const response = await fetch(endpoints.forms);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data.data) || data.data.length === 0) {
            throw new Error("Data is not in expected format or is empty");
        }

        // Extraer solo ID y label de cada formulario
        const formsList = data.data.map((form: any) => {
            const {
                id,
                attributes: {
                    label: titleForm = '',
                    drupal_internal__id: internalId = ''
                } = {}
            } = form;

            return { 
                id, 
                internalId,
                titleForm, 
            };
        });

        console.log("All forms list:", formsList);
        return formsList;
    } catch (error) {
        console.error("Error fetching forms list:", error);
        return null;
    }
} */

export async function getDataForm() {
  try {
    const response = await fetch(endpoints.pageForms);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const payload = await response.json();
    
    if (!Array.isArray(payload.data) || payload.data.length === 0) {
      throw new Error("Data is not in expected format or is empty");
    }   

    const formsData = payload.data.map((form:any) => {
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

    console.log("All forms list:", formsData);
    return formsData;

  } catch (error) {
    console.error("Error fetching forms list:", error);
    return null;
  }
}
