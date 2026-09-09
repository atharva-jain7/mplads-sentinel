import os

BASE = r"c:\Users\Atharva Jain\Desktop\mplads-sentinel\frontend"

# package.json
package_json = """{
  "name": "mplads-sentinel-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.1",
    "lucide-react": "^0.439.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "chart.js": "^4.4.4",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.45",
    "tailwindcss": "^3.4.10",
    "vite": "^5.4.2"
  }
}
"""
with open(os.path.join(BASE, "package.json"), "w", encoding="utf-8") as f:
    f.write(package_json)

# vite.config.js
vite_config = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
"""
with open(os.path.join(BASE, "vite.config.js"), "w", encoding="utf-8") as f:
    f.write(vite_config)

# tailwind.config.js
tailwind_config = """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0A2540',
          blue: '#1E3A8A',
          light: '#F4F7FB',
          border: '#E2E8F0',
          saffron: '#FF671F',
          green: '#046A38'
        },
        risk: {
          critical: '#DC2626',
          high: '#EA580C',
          medium: '#D97706',
          low: '#16A34A'
        }
      }
    },
  },
  plugins: [],
}
"""
with open(os.path.join(BASE, "tailwind.config.js"), "w", encoding="utf-8") as f:
    f.write(tailwind_config)

# postcss.config.js
postcss_config = """export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"""
with open(os.path.join(BASE, "postcss.config.js"), "w", encoding="utf-8") as f:
    f.write(postcss_config)

# index.html
index_html = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/emblem.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MPLADS Sentinel | Government Risk Prioritization & Monitoring</title>
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    <!-- Inter Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  </head>
  <body class="bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"""
with open(os.path.join(BASE, "index.html"), "w", encoding="utf-8") as f:
    f.write(index_html)

# emblem.svg
emblem_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF671F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
</svg>
"""
with open(os.path.join(BASE, "public", "emblem.svg") if os.path.exists(os.path.join(BASE, "public")) else os.path.join(BASE, "emblem.svg"), "w", encoding="utf-8") as f:
    f.write(emblem_svg)

print("Frontend base config created.")
