# Alliyah Aruta — Editorial Portfolio

A working React + Vite portfolio inspired by the supplied screen recording: minimalist editorial layout, Instrument Serif typography, burgundy palette, animated project showcases, cursor-following radial button fills, magnetic interactions, custom pointer, scroll reveal, responsive navigation, light/dark toggle, and accessible motion preferences.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create production files:

```bash
npm run build
npm run preview
```

Deploy to Vercel as a Vite project (build command `npm run build`, output folder `dist`).

## Replace your content

- **Name, email, links, projects, technologies, awards:** `src/data.js`.
- **Project screenshots:** replace `public/images/dineprime.svg`, `momshies-kitchen.svg`, `medlink.svg`, `momshies-homemade.svg`, `yeshrheyy.svg`, or update the `image` path in `src/data.js` to a `.png`, `.jpg`, or `.webp` in `public/images/`.
- **Professional portrait:** hero currently uses an editorial `Aa` art panel intentionally. To use a portrait, add your image in `public/images/portrait.jpg`, then replace the `.hero-art` JSX in `src/main.jsx` with `<div className="hero-art portrait-art"><img src="/images/portrait.jpg" alt="Portrait of Alliyah Aruta" /></div>` and add `.portrait-art img{width:100%;height:100%;object-fit:cover}` to `src/style.css`.
- **Résumé:** place your actual résumé at `public/resume.pdf`. The existing download button points there. Until added, the download will not work.
- **Contact form:** uses a real `mailto:` handoff (not a fake successful submission). It opens the visitor's email app; to send directly, connect a backend or mail service.
- **Social URLs:** empty placeholders in `src/data.js` deliberately avoid invented links.
- **Theme:** saved in `localStorage`; defaults to system preference and otherwise light.

## Interaction details

- Magnetic CTA buttons follow the cursor slightly using native pointer events and CSS custom properties. Their hover fill starts at the exact pointer position.
- A custom pointer and delayed ring follow the mouse on fine-pointer devices.
- IntersectionObserver reveals sections as they enter view.
- Animated tab changes update the skills panel.
- Project case studies open as native accessible `<dialog>` overlays.
- Reduced-motion settings disable most motion and custom cursors.

## Reference fidelity

This is a hand-coded interpretation of the supplied recording, not a byte-for-byte reproduction of an unknown original website. The reference's broad layout, typography, sections and visual behavior are followed, with additional interactions requested by the user.
