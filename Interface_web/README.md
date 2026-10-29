# Interface_web — Suite de Producción y Abastecimiento (PRODDSI)

Interfaz web de la suite de producción, construida con **React 19 + Vite + Tailwind CSS 4 + TypeScript** (sin librerías externas), siguiendo el mismo estilo y organización de paneles de la suite financiera (`contabilidad/Interface_web`).

## Alcance

La interfaz implementa **todas** las funcionalidades del documento normativo
[`../FUNCIONALIDADES.md`](../FUNCIONALIDADES.md):

- **15 módulos** y **293 funcionalidades**, cada una con un bloque de UI propio.
- **7 flujos end-to-end** y **roadmap de 5 fases** visibles en el Dashboard.
- Todo funciona con **datos de demostración** en estado local (aún no hay backend).

## Estructura

```
Interface_web/
├── CONVENCIONES.md          # Contrato de implementación por módulo
├── scripts/verify-coverage.mjs  # Verificador de cobertura + generador de catálogo
├── scripts/smoke-browser.mjs    # Smoke test real (chromium) de las 17 páginas
├── src/
│   ├── App.tsx              # Navegación por estado (sin router)
│   ├── components/
│   │   ├── Shell.tsx        # Layout: sidebar por fases + header con búsqueda global
│   │   └── ui.tsx           # Componentes compartidos
│   ├── data/
│   │   ├── coverage.ts      # GENERADO: catálogo de 293 funciones (no editar)
│   │   ├── modules.ts       # Registro de módulos y fases
│   │   ├── mock.ts          # Sesión simulada (planta, período, usuario)
│   │   └── <modulo>.ts      # Datos de demostración por módulo
│   ├── lib/format.ts        # Formateadores (COP, %, horas, fechas)
│   └── pages/
│       ├── Dashboard.tsx    # KPIs, roadmap, cobertura, flujos
│       ├── SuiteHome.tsx    # Selector de módulos por fase + transversales
│       ├── Especificacion.tsx # Flujos end-to-end, criterios, glosario, decisiones (§4–8)
│       └── <CODIGO>.tsx     # Una página por módulo (ABT…TRV)
```

## Cómo correr

```sh
pnpm install
pnpm dev        # http://localhost:8450
pnpm build      # typecheck + build de producción
```

## Garantía de cobertura

`node scripts/verify-coverage.mjs` lee `../FUNCIONALIDADES.md`, regenera el
catálogo tipado `src/data/coverage.ts` y **verifica que cada código `XXX-NN`
esté implementado en su página** `src/pages/XXX.tsx` como un bloque real
`<FunctionBlock code="XXX-NN">…</FunctionBlock>` con contenido (no vacío).
Si falta alguna funcionalidad, el script falla con la lista exacta de faltantes.

```sh
pnpm verify:coverage   # ✓ Cobertura completa: ninguna funcionalidad sin implementar.
```

Además, `pnpm smoke` levanta la app en chromium y recorre las 17 páginas
(suite, dashboard, especificación y los 15 módulos), hace clic en **todas las
pestañas de cada módulo**, cuenta que los 293 bloques se rendericen y falla si
aparece cualquier error de consola o excepción en el navegador.

Cada bloque de UI se escribe como `<FunctionBlock code="XXX-NN">…</FunctionBlock>`:
el título y la descripción normativa se renderizan automáticamente desde el
catálogo, garantizando sincronía con el documento.
