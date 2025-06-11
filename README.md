# 📊 Meta Marketing API para Google Sheets

Este repositorio permite conectar la **API de Meta Marketing (Facebook Ads)** a **Google Sheets** usando **Google Apps Script**. Incluye funciones para extraer datos de campañas, conjuntos de anuncios, anuncios y sus métricas de rendimiento directamente desde tus cuentas publicitarias.

> 🔗 Basado en el trabajo original de [JermayaL/Meta-Marketing-API](https://github.com/JermayaL/Meta-Marketing-API), adaptado y documentado en español.

---

## 🧩 Características

- ✅ Conexión segura mediante token de acceso.
- ✅ Extracción de métricas a nivel de campaña, adset y anuncio.
- ✅ Manejo de paginación automático.
- ✅ Menú personalizado en Google Sheets para refrescar datos con un clic.

---

## ⚙️ Instrucciones de uso

1. **Copiá el script:**
   - Abrí tu Google Sheets.
   - Irá a `Extensiones > Apps Script`.
   - Pegá el contenido del archivo `code.gs`.

2. **Configurá el token de acceso:**
   - Reemplazá el valor de `ACCESS_TOKEN` con tu token válido de Meta con permisos para Ads Insights.

3. **Creá las hojas necesarias:**
   - `Ad Accounts`
   - `Campaigns`
   - `Adsets`
   - `Ads`
   - `Campaign Insights`
   - `Adset Insights`
   - `Ad Insights`

4. **Refrescá los datos desde el menú personalizado:**
   - Recargá la hoja y aparecerá el menú “Meta Marketing API”.
   - Usá las opciones para cargar o actualizar los datos automáticamente.

---

## 🧪 Ejemplo de salida

Cada hoja se completa con datos tabulados, por ejemplo:

| ad_account | campaign_name | impressions | clicks | spend | ... |
|------------|----------------|-------------|--------|--------|-----|
| Cuenta 1   | Campaña Test   | 12,500      | 323    | $100   |     |

---

## 📄 Créditos

- Repositorio original: [Meta-Marketing-API de JermayaL](https://github.com/JermayaL/Meta-Marketing-API)
- Adaptado y traducido por: **Ignacio Muñoz Gomeñuka**
- Licencia: MIT

---

## 💬 Contacto

¿Preguntas o sugerencias?  
Podés contactarme vía [LinkedIn](https://www.linkedin.com/in/ignaciomg) o dejar un issue en el repo.

