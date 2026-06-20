# Speak ESG — Instagram Stories (Remotion)

Secuencia de 3 Instagram Stories verticales **9:16** para Speak ESG sobre
**Mundial 2026 + sostenibilidad**.

- Resolución: **1080×1920**
- Frame rate: **30 fps**
- Composiciones: `Story1`, `Story2`, `Story3`

## Estructura

```
remotion/
├── package.json
├── remotion.config.ts
├── tsconfig.json
└── src/
    ├── index.ts            # registerRoot
    ├── Root.tsx            # define las 3 composiciones (1080x1920 @ 30fps)
    ├── components/
    │   ├── SafeArea.tsx    # safe areas de IG Story + guías de debug
    │   ├── Story1.tsx
    │   ├── Story2.tsx
    │   └── Story3.tsx
    ├── lib/
    │   └── theme.ts        # colores, fps, safe areas, duración
    └── assets/             # subir aquí refs y assets (ver assets/README.md)
```

## Comandos

```bash
cd remotion
npm install          # instalar dependencias
npm run studio       # abrir Remotion Studio (preview interactivo)
npm run still:story1 # exportar frame PNG de revisión de Story 1
npm run render:story1 # exportar MP4 de Story 1
```

Los MP4 y PNG se exportan a `remotion/out/`.
