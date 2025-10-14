import apiConfig from "@libs/apiConfig";
const { endpoints } = apiConfig;

export async function getDataForm(slug: string) {
  try {
    // 1. Obtener TODOS los formularios
    const response = await fetch(endpoints.forms);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const payload = await response.json();
    if (!Array.isArray(payload.data) || payload.data.length === 0) throw new Error("No forms found");

    // 2. Buscar manualmente por path
    const form = payload.data.find((form: any) => {
      try {
        const description = form.attributes?.description || "";
        if (description) {
          const descriptionData = JSON.parse(description);
          const path = descriptionData?.config?.path?.replace(/^\//, "") || "";
          return path === slug;
        }
      } catch {
        return false;
      }
      return false;
    });

    if (!form) throw new Error(`Form with path ${slug} not found`);
    console.log("Form found for slug", slug, ":", form);

    // 3. Extraer datos del formulario encontrado
    const { id, attributes } = form;
    const {
      label: labelForm = "",
      field_lead_form_title: titleForm = "",
      field_lead_form_subtitle: subtitleForm = "",
      field_lead_form_image: imageForm = "",
      drupal_internal__id: internalId = "",
      description: descriptionRaw = "",
    } = attributes;

    // 4. Parsear el JSON del formulario
    let formSchema: any = null;
    try {
      formSchema = typeof descriptionRaw === "string" ? JSON.parse(descriptionRaw) : descriptionRaw;
    } catch {
      formSchema = null;
    }

    // 5. Extraer la configuración del formulario
    const config = formSchema?.config || {};
    const {
      type = null,
      area = null,
      redirect = "",
      commercial_list = null,
      validation = [],
      confirmation_page = [],
      form: formElements = [],
    } = config;

    // 6. Obtener items dentro de commercial_list (si existen)
    const items = Array.isArray(commercial_list?.items)
      ? commercial_list.items
      : [];


    // 9. Retornar todo el conjunto

    console.log("Complete form data for slug", slug, ":", {
      id,
      titleForm,
      subtitleForm,
      imageForm,
      labelForm,
      internalId,
      descriptionRaw,
      formSchema,

      type,
      area,
      redirect,
      commercial_list,
      validation,
      confirmation_page,
      formElements,

      items,
    });
    return {
      id,
      titleForm,
      subtitleForm,
      imageForm,
      labelForm,
      internalId,
      descriptionRaw,
      formSchema,

      type,
      area,
      redirect,
      commercial_list,
      validation,
      confirmation_page,
      formElements,

      items,
    };
  } catch (error) {
    console.error("Error fetching form data:", error);
    return null;
  }
}


export async function getAllForms() {
    try {
        const response = await fetch(endpoints.forms);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const payload = await response.json();
        if (!Array.isArray(payload.data) || payload.data.length === 0) {
            throw new Error("Data is not in expected format or is empty");
        }
        // Extraer ID, label y path de cada formulario
        const formsList = payload.data.map((form: any) => {
            const {
                id,
                attributes: {
                    label: labelForm = '',
                    drupal_internal__id: internalId = '',
                    description = ''
                } = {}
            } = form;
            
            // Parsear el JSON de description para obtener el path
            let path = '';
            try {
                if (description) {
                    const descriptionData = JSON.parse(description);
                    path = descriptionData?.config?.path.replace(/^\//, '') || '';
                }
            } catch (error) {
                console.warn("Error parsing description JSON:", error);
            }
            
            return { 
                id, 
                internalId,
                labelForm, 
                path
            };
        });
        console.log("All forms list:", formsList);
        return formsList;
    } catch (error) {
        console.error("Error fetching forms list:", error);
        return null;
    }
}