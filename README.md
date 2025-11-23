# Color Simulator Prototype

This is a minimal React + Vite prototype of the "Palácio Tintas" color simulator MVP.

Features:
- Upload an image (photo of house/room)
- Draw a polygon by clicking to add vertices (click on the canvas)
- Close polygon to apply chosen catalog color preserving texture (blend)
- Download result as PNG

How to run:
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open the printed local URL (usually http://localhost:5173)

Notes:
- This prototype runs entirely on the client — no backend required for the basic flow.
- For a production-ready release, add image upload handling, catalog backend, auth, and optional AI segmentation.

