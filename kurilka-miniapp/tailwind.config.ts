import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        neon: "0 0 20px rgba(236,72,153,.35), 0 0 40px rgba(59,130,246,.25)",
        card: "0 10px 30px rgba(0,0,0,.35)"
      }
    }
  },
  plugins: []
} satisfies Config;
