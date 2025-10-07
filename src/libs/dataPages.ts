import { endpoints } from "./apiConfig";

export async function getDataPages() {
    try{
        const response = await fetch(endpoints.pages);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data.data) || data.length === 0) throw new Error("Data is not in expected format or is empty");
        
        console.log("Raw Data Pages:", data);

        const dataPage = data.data.map((page: any) => {
        const { 
            id, 
            attributes: { 
                title: titlePage = '',
                path: { alias: slugPage = '' } = {},
                field_content: fieldContent = {},
                field_description: descriptionPage = ''
            } = {}
        } = page;

        const {
            value: valueContentPage = '',
            processed: processedContentPage = ''
        } = fieldContent || {}; 

        return { id, titlePage, slugPage, valueContentPage, processedContentPage, descriptionPage };
        });


        console.log("Data Pages fetched:", dataPage);

        return dataPage;   

    } catch (error) {
        console.error("Error fetching pages:", error);
        return null;
    }
}

export async function getAllPagesBySlug() {
    try{
        const response = await fetch(`${endpoints.pages}?fields[node--page]=path`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data.data) || data.length === 0) throw new Error("Data is not in expected format or is empty");

        const slugPages = data.data.map((page: any ) => page.attributes?.path?.alias || "");

        console.log("Pages fetched by slug:", slugPages);

        return slugPages;
        
    } catch (error) {
        console.error("Error fetching page by slug:", error);
        return null;
    }
}   