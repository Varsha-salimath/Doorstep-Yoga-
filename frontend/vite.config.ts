import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const stitchExportPath =
  'C:/Users/IL/Downloads/stitch_yogfit_yoga_booking_platform/stitch_yogfit_yoga_booking_platform'
const cursorAssetsPath =
  'C:/Users/IL/.cursor/projects/c-Users-IL-OneDrive-Varsity-Education-Management-Pvt-Ltd-Desktop-yogfit/assets'

export default defineConfig({
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), stitchExportPath, cursorAssetsPath],
    },
  },
  plugins: [react()],
})
