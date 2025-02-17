import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "var(--accent-color)",
        gradient: {
          start: "var(--gradient-start)",
          end: "var(--gradient-end)",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'white',
            a: {
              color: 'var(--accent-color)',
              '&:hover': {
                color: 'var(--accent-color)',
                opacity: 0.8,
              },
            },
            blockquote: {
              borderLeftColor: 'var(--accent-color)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
};

export default config;
