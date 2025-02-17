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
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-mono)"],
      },
      typography: ({ theme }: { theme: any }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.white'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-links': 'var(--accent-color)',
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-counters': theme('colors.white'),
            '--tw-prose-bullets': theme('colors.white'),
            '--tw-prose-quotes': theme('colors.white'),
            '--tw-prose-code': 'var(--accent-color)',
            '--tw-prose-pre-code': theme('colors.white'),
            '--tw-prose-pre-bg': 'rgb(0 0 0 / 0.3)',
            '--tw-prose-quote-borders': 'var(--accent-color)',
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
