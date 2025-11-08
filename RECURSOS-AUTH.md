# Recursos de Autenticación - Configuración Completa ✅

## ✨ Cambios Implementados

He configurado la página home inicial (login y registro) con las especificaciones exactas:

### 📐 Estructura y Layout

✅ **Viewport:** 1920x1080px  
✅ **División:** 50% ilustración (izquierda) / 50% formulario (derecha)  
✅ **Layout responsivo:** Usando Flexbox con `w-1/2` para cada sección

### 🎨 Background e Ilustración

✅ **Imagen de fondo:** Configurada en `/recursos/background-illustration-access.jpg`  
✅ **Overlay:** Capa sólida #EFEDEB con opacidad 50%  
✅ **Cobertura:** `bg-cover bg-center bg-no-repeat` para cubrir toda la sección

### ✍️ Tipografía de la Frase Destacada

✅ **Texto:** "A space for readers, dreamers, and those who lose themselves in stories"  
✅ **Font-family:** Vollkorn (serif) - ya configurado con `next/font/google`  
✅ **Font-size:** 98.076px  
✅ **Font-weight:** 400 (normal)  
✅ **Line-height:** 93.479px (95.312% del font-size)  
✅ **Letter-spacing:** -2.942px  
✅ **Text-align:** right  
✅ **Width:** 829px  
✅ **Color:** var(--sds-color-text-default-secondary) = #4A4A3A

### 📍 Posicionamiento

✅ **Logo:** Esquina superior izquierda (absolute positioning)  
✅ **Texto principal:** Centrado verticalmente y horizontalmente en la sección izquierda  
✅ **Contenedor:** Con padding adecuado para evitar tocar los bordes

## 📁 Archivos Creados/Modificados

1. **`/components/auth/AuthLayout.tsx`** - Nuevo componente compartido para login y registro
2. **`/app/(auth)/login/page.tsx`** - Actualizado para usar AuthLayout
3. **`/app/(auth)/register/page.tsx`** - Actualizado para usar AuthLayout
4. **`/app/globals.css`** - Agregada variable CSS `--sds-color-text-default-secondary`
5. **`/public/recursos/logo-nook.svg`** - Logo temporal creado
6. **`/public/recursos/README.md`** - Instrucciones para recursos

## 🖼️ Recursos Necesarios

### ⚠️ IMPORTANTE: Debes agregar tu imagen de fondo

Coloca tu imagen de background en:
```
/public/recursos/background-illustration-access.jpg
```

**Especificaciones de la imagen:**
- Dimensiones: 960x1080px (o similar, se ajustará automáticamente)
- Formato: JPG, PNG, o WEBP
- Contenido: La ilustración con los números en cajas naranjas (482, 244, 143, 224)

### Logo

Ya he creado un logo temporal SVG simple. Puedes:
1. Reemplazarlo con tu logo real en `/public/recursos/logo-nook.svg`
2. O mantener el temporal si prefieres

## 🎯 Características Implementadas

✅ **Misma estructura para login y registro** - Solo cambian los campos del formulario  
✅ **Overlay legible** - Capa semi-transparente para asegurar legibilidad del texto  
✅ **Estilos exactos** - Line-height y letter-spacing aplicados correctamente  
✅ **Responsive** - Prioriza desktop 1920x1080 pero funciona en otras resoluciones  
✅ **Formulario intacto** - No se modificó la funcionalidad existente

## 🚀 Próximos Pasos

1. **Agrega tu imagen de background:**
   ```
   /public/recursos/background-illustration-access.jpg
   ```

2. **Opcional - Reemplaza el logo:**
   ```
   /public/recursos/logo-nook.svg
   ```

3. **Verifica en el navegador:**
   ```bash
   pnpm dev
   ```
   Luego visita:
   - http://localhost:3000/login
   - http://localhost:3000/register

## 💡 Notas Técnicas

- El componente `AuthLayout` es reutilizable para ambas páginas de autenticación
- Los estilos inline se usan para valores exactos que no son parte del sistema de diseño de Tailwind
- La fuente Vollkorn se carga desde Google Fonts en el layout principal
- El color del overlay (#EFEDEB) coincide con el color de fondo principal de la app

## 🔧 Personalización

Si necesitas ajustar alguna especificación, edita:
- **Layout:** `/components/auth/AuthLayout.tsx`
- **Colores:** `/app/globals.css` (variables CSS)
- **Tipografía:** `/app/layout.tsx` (configuración de fuentes)

