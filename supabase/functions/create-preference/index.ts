const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN');
    if (!mpAccessToken) {
      throw new Error('MP_ACCESS_TOKEN no está configurado en las variables de entorno.');
    }

    const { cartItems, cliente, pedidoId } = await req.json();

    const items = (cartItems || []).map((item: any) => ({
      id: String(item.id_producto ?? item.id ?? ''),
      title: String(item.nombre ?? item.title ?? 'Producto'),
      quantity: Number(item.cantidad ?? item.quantity ?? 1),
      unit_price: Number(item.precio ?? item.precio_unitario ?? item.unit_price ?? 0),
      currency_id: 'PEN',
    }));

    const payer = {
      name: cliente?.nombre_completo || cliente?.nombre || '',
      email: cliente?.correo_electronico || cliente?.email || '',
      phone: {
        number: String(cliente?.telefono || ''),
      },
      address: {
        street_name: cliente?.direccion_envio || '',
      },
    };

    const backUrls = {
      success: 'http://localhost:5173',
      failure: 'http://localhost:5173',
      pending: 'http://localhost:5173',
    };

    // Intentar crear la preferencia con auto_return configurado y external_reference vinculado al pedidoId
    let mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mpAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        payer,
        back_urls: backUrls,
        auto_return: 'approved',
        external_reference: pedidoId ? String(pedidoId) : undefined,
      }),
    });

    let mpData = await mpResponse.json();

    // Resiliencia: si falla por validación de auto_return / back_urls en localhost (HTTP no seguro), reintentar sin auto_return
    if (!mpResponse.ok) {
      const errorMsg = String(mpData?.message || mpData?.error || JSON.stringify(mpData) || '').toLowerCase();
      if (errorMsg.includes('auto_return') || errorMsg.includes('back_url')) {
        console.warn('Reintentando creación de preferencia sin auto_return debido a restricción de localhost en Mercado Pago...');
        const retryResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mpAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items,
            payer,
            back_urls: backUrls,
            external_reference: pedidoId ? String(pedidoId) : undefined,
          }),
        });

        const retryData = await retryResponse.json();
        if (retryResponse.ok) {
          mpResponse = retryResponse;
          mpData = retryData;
        } else {
          throw new Error(retryData?.message || retryData?.error || 'Error al comunicarse con Mercado Pago en el reintento.');
        }
      } else {
        throw new Error(mpData?.message || mpData?.error || 'Error al comunicarse con Mercado Pago.');
      }
    }

    return new Response(JSON.stringify({ preferenceId: mpData.id }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Error interno del servidor.' }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});
