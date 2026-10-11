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
                moduloCheckout = component "Módulo de Checkout" "Gestiona la UI del carrito y la recolección de datos del cliente." "React"
                moduloOrders = component "Módulo de Pedidos (Orders)" "Gestiona la lógica de negocio, reglas de transacción y persistencia de compras." "JavaScript / Context"
                moduloAdmin = component "Módulo Panel (Ruta /admin)" "Dashboard privado y formulario de login oculto para el dueño." "React"
                supabaseClient = component "Cliente Supabase (config/supabase.js)" "Punto único de entrada para el backend." "JavaScript"
            }
            

            supabase = container "Backend & Base de Datos (Supabase)" "Gestiona la persistencia de datos, seguridad y API generada automáticamente." "Supabase" "Database" {
                api = component "API REST (PostgREST)" "Proporciona los endpoints seguros para interactuar con las tablas." "PostgREST"
                auth = component "Servicio de Autenticación" "Gestiona la identidad de usuarios, administradores y generación de tokens JWT." "Supabase Auth"
                db = component "Base de Datos Relacional" "Tablas principales: productos, pedidos, detalles_pedido." "PostgreSQL"
            }
        }

        # Relaciones - Nivel Contexto
        cliente -> ecommerce "Busca productos y realiza pedidos"
        admin -> ecommerce "Administra el inventario y estado de ventas"
        ecommerce -> pasarela "Procesa pagos de tarjetas"
        erp -> ecommerce "Extrae reportes de ventas y stock (Futuro)"

        # Relaciones - Interacciones de Usuario con Componentes (Frontend)
        cliente -> moduloPublico "Navega por Inicio y páginas estáticas"
        cliente -> moduloCatalogo "Explora catálogo, aplica filtros y selecciona productos"
        cliente -> moduloCheckout "Agrega productos al carrito y llena el formulario de envío/pago"
        admin -> moduloAdmin "Accede para gestionar productos, pedidos e inventario"

        # Relaciones - Nivel Componente (Frontend)
        moduloCatalogo -> supabaseClient "Solicita lista y detalle de productos"
        moduloCheckout -> moduloOrders "Envía datos validados del formulario y carrito para su procesamiento"
        moduloOrders -> supabaseClient "Inserta nuevo pedido y detalles (Snapshot)"
        moduloOrders -> pasarela "Inicia intento de transacción y valida respuesta"
        moduloAdmin -> supabaseClient "CRUD de productos y actualización de estado de pedidos"
        
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