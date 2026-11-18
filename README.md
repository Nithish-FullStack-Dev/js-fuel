# JS Fuel — Premium 3D Scroll Website V4

This version restructures the experience into independent stacked blocks so the 3D models stop when their own section is finished.

## Final flow

1. **Station opening** — full JS Fuel station only; no content over the opening frame.
2. **Petrol** — one direct camera move to the far-left first-row dispenser. The camera then locks. Blur appears first, copy reveals in sequence, copy exits, then the camera is allowed to move again.
3. **Diesel** — one direct move to the adjacent left dispenser. Camera locks while content reveals/exits.
4. **CNG** — one direct cross to the first right dispenser. Camera locks while content reveals/exits on the left.
5. **LPG** — one direct move to the far-right dispenser. Camera locks while content reveals/exits.
6. **Static fuel bridge** — a normal red HTML block below the station. No 3D model continues into this section.
7. **Standalone dispenser block** — a completely separate 3D canvas. The dispenser starts large and central over oversized editorial typography, then moves right, becomes smaller and rotates to a subtle three-quarter view.
8. **Final content block** — normal HTML content after the dispenser canvas has ended.
9. **Footer** — dark premium footer.

## Important behavior

- The station and dispenser are **not rendered in one global fixed canvas**.
- The station canvas exists only inside `StationExperience`.
- The dispenser canvas exists only inside `PumpExperience`.
- Later sections cannot appear behind or on top of the completed station model.
- Camera hold ranges are hard-coded so there is no camera catch-up while fuel copy is being shown.
- Text animation is scroll driven and staggered: blur → label → heading → body → note → exit.

## Station timing

The first-row camera timeline is defined in `src/components/ExperienceCanvas.tsx`:

- Opening hold: `0.00–0.08`
- Move to Petrol: `0.08–0.16`
- Petrol camera hold: `0.16–0.285`
- Move to Diesel: `0.285–0.36`
- Diesel camera hold: `0.36–0.485`
- Move to CNG: `0.485–0.56`
- CNG camera hold: `0.56–0.685`
- Move to LPG: `0.685–0.76`
- LPG hold through the end of the station chapter

Approximate first-row dispenser centers used for the camera choreography:

- Petrol: x `-4.95`
- Diesel: x `-2.45`
- CNG: x `+2.45`
- LPG: x `+4.95`

## Main files

- `src/components/StationExperience.tsx` — station block, scroll progress and staggered fuel copy.
- `src/components/ExperienceCanvas.tsx` — station camera timeline and lighting.
- `src/components/StationModel.tsx` — supplied station GLB.
- `src/components/PumpExperience.tsx` — standalone pump block and editorial copy.
- `src/components/PumpCanvas.tsx` — standalone pump 3D canvas.
- `src/components/DispenserModel.tsx` — pump position, scale and rotation choreography.
- `src/App.tsx` — stacked page order.
- `src/styles.css` — all layouts, blur treatment, typography, stacked blocks and responsive rules.

## Models

The supplied GLB files are kept in:

- `public/models/js-fuel-station.glb`
- `public/models/js-fuel-dispenser.glb`

## Run

```bash
npm install
npm run dev
```

Production:

```bash
npm run build
npm run preview
```

Recommended: Node.js 20.19+ or Node.js 22+.
