// src/pages/api/submit-lead.ts
export async function POST({ request }: { request: Request }) {
  const formData = await request.formData();
  
  const leadData = {
    form_id: formData.get('form_id'),
    form_title: formData.get('form_title'),
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    country: formData.get('country'),
    city: formData.get('city'),
    phone_number: formData.get('phone_number'),
    email: formData.get('email'),
    submitted_at: new Date().toISOString()
  };

  console.log('Lead data received:', leadData);

  // Aquí puedes procesar los datos como necesites
  // - Guardar en base de datos
  // - Enviar a CRM
  // - Enviar email
  // - etc.

  return new Response(JSON.stringify({ 
    success: true, 
    message: 'Form submitted successfully',
    data: leadData
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}