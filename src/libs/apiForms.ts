// libs/apiForms.ts
import apiConfig from "@libs/apiConfig";
const { endpoints } = apiConfig;

export async function getDataForm() {
  try {
    const response = await fetch(endpoints.forms);
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
          label: titleForm = "",
          drupal_internal__id: internalId = "",
          description: descriptionRaw = "",
        } = {},
      } = form;

      let formSchema: any = null;
      try {
        formSchema = typeof descriptionRaw === "string" ? JSON.parse(descriptionRaw) : descriptionRaw;
      } catch {
        formSchema = null;
      }

      // Te dejo ambos por si los quieres
      return { id, titleForm, internalId, descriptionRaw, formSchema };
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
}