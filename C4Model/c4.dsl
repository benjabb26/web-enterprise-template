workspace "Aura Enterprise Template" "Arquitectura Monolito Modular - E-commerce" {

    model {
        cliente = person "Cliente / Comprador" "Navega por el catálogo, agrega al carrito y realiza compras."
        admin = person "Administrador" "Dueño del negocio. Gestiona inventario, actualiza productos y revisa pedidos."
        
        pasarela = softwareSystem "Pasarela de Pagos" "Plataforma externa (Mercado Pago, Niubiz, etc.) que procesa el cobro." "External"
        erp = softwareSystem "Sistema ERP (Futuro)" "Sistema externo del cliente para contabilidad y facturación (Ej. SAP, Odoo)." "External"

        ecommerce = softwareSystem "Aura Enterprise E-commerce" "Plataforma de ventas online estructurada como monolito modular." {
            
            spa = container "Aplicación Web Frontend" "Proporciona toda la interfaz de usuario y la lógica de negocio." "React, Vite" "Web Browser" {
    
                moduloPublico = component "Módulo Storefront (Estático)" "Renderiza la página de Inicio, Nosotros y navegación estática. No requiere base de datos." "React"
                moduloCatalogo = component "Módulo de Catálogo" "Renderiza la lista de productos, filtros y detalle." "React"
                moduloCheckout = component "Módulo de Checkout" "Gestiona el estado del carrito y la recolección de datos." "React"
                moduloAdmin = component "Módulo Panel (Ruta /admin)" "Dashboard privado y formulario de login oculto para el dueño." "React"
                supabaseClient = component "Cliente Supabase (config/supabase.js)" "Punto único de entrada para el backend." "JavaScript"

            }

            supabase = container "Backend & Base de Datos (Supabase)" "Gestiona la persistencia de datos, seguridad y API generada automáticamente." "Supabase" "Database" {
                api = component "API REST (PostgREST)" "Proporciona los endpoints seguros para interactuar con las tablas." "PostgREST"
                auth = component "Servicio de Autenticación" "Gestiona la identidad de usuarios, administradores y generación de tokens JWT." "Supabase Auth"
                db = component "Base de Datos Relacional" "Tablas principales: productos, clientes, pedidos, detalles_pedido." "PostgreSQL"
            }
        }

        # Relaciones - Nivel Contexto
        cliente -> ecommerce "Busca productos y realiza pedidos"
        admin -> ecommerce "Administra el inventario y estado de ventas"
        ecommerce -> pasarela "Procesa pagos de tarjetas"
        erp -> ecommerce "Extrae reportes de ventas y stock (Futuro)"

        # Relaciones - Nivel Contenedor
        
        cliente -> spa "Visita mediante el navegador"
        admin -> spa "Inicia sesión segura"
        spa -> supabase "Lee y escribe datos del catálogo/compras" "HTTPS/JSON"
        spa -> pasarela "Envía token o redirige para procesar pago" "HTTPS"
        erp -> supabase "Consume la API REST para sincronizar datos" "HTTPS/JSON"

        # Relaciones - Nivel Componente (Frontend)
        moduloCatalogo -> supabaseClient "Solicita lista y detalle de productos"
        moduloCheckout -> supabaseClient "Inserta nuevo cliente, pedido y detalles"
        moduloCheckout -> pasarela "Inicia intento de transacción"
        moduloAdmin -> supabaseClient "CRUD de productos y actualización de pedidos"
        
        # Relaciones - Nivel Componente (Backend)
        supabaseClient -> api "Consultas de datos" "HTTPS"
        supabaseClient -> auth "Valida credenciales y permisos" "HTTPS"
        api -> db "Ejecuta sentencias SQL (Select, Insert, Update)" "SQL"
        auth -> db "Verifica identidades en auth.users" "SQL"
    }

    views {
        systemContext ecommerce "Contexto" {
            include *
            autoLayout
        }

        container ecommerce "Contenedores" {
            include *
            autoLayout
        }

        component spa "Componentes_Frontend" {
            include *
            autoLayout
        }
        
        component supabase "Componentes_Backend" {
            include *
            autoLayout
        }

        styles {
            element "Software System" {
                background #1168bd
                color #ffffff
            }
            element "External" {
                background #999999
                color #ffffff
            }
            element "Person" {
                shape person
                background #08427b
                color #ffffff
            }
            element "Container" {
                background #438dd5
                color #ffffff
            }
            element "Database" {
                shape cylinder
            }
            element "Web Browser" {
                shape WebBrowser
            }
        }
    }
}