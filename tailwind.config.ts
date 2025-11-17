import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent-yellow': '#FFE500',
        'accent-pink': '#FF006B',
        'accent-blue': '#00D4FF',
        'accent-green': '#00FF88',
      },
    },
  },
  plugins: [],
}

export default config
