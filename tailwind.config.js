/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PRIMARY COLORS
        primary: {
          orange: '#F99912',
          lime: '#9ACD32',
          purple: '#9370DB',
        },
        // SECONDARY COLORS
        secondary: {
          teal: '#14B8A6',
          indigo: '#6366F1',
          rose: '#F43F5E',
          cyan: '#06B6D4',
          amber: '#F59E0B',
          fuchsia: '#D946EF',
        },
        // ACCENT COLORS
        accent: {
          mint: '#10B981',
          emerald: '#059669',
          sky: '#0EA5E9',
          pink: '#EC4899',
          red: '#EF4444',
          blue: '#3B82F6',
        },
      },
      backgroundImage: {
        // PRIMARY GRADIENTS
        'gradient-primary': 'linear-gradient(135deg, #F99912 0%, #9ACD32 50%, #9370DB 100%)',
        'gradient-balanced': 'linear-gradient(135deg, #9370DB 0%, #06B6D4 25%, #9ACD32 50%, #F99912 75%, #F43F5E 100%)',
        
        // ORANGE GRADIENTS
        'gradient-orange-lime': 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)',
        'gradient-orange-rose': 'linear-gradient(135deg, #F99912 0%, #F43F5E 100%)',
        'gradient-orange-amber': 'linear-gradient(120deg, #F99912 0%, #F59E0B 100%)',
        
        // LIME GRADIENTS
        'gradient-lime-purple': 'linear-gradient(135deg, #9ACD32 0%, #9370DB 100%)',
        'gradient-lime-emerald': 'linear-gradient(135deg, #9ACD32 0%, #059669 100%)',
        'gradient-lime-cyan': 'linear-gradient(135deg, #9ACD32 0%, #06B6D4 100%)',
        
        // PURPLE GRADIENTS
        'gradient-purple-orange': 'linear-gradient(135deg, #9370DB 0%, #F99912 100%)',
        'gradient-purple-indigo': 'linear-gradient(135deg, #9370DB 0%, #6366F1 100%)',
        'gradient-purple-fuchsia': 'linear-gradient(135deg, #9370DB 0%, #D946EF 100%)',
        
        // TEAL/CYAN GRADIENTS
        'gradient-teal-purple': 'linear-gradient(135deg, #14B8A6 0%, #9370DB 100%)',
        'gradient-cyan-sky': 'linear-gradient(135deg, #06B6D4 0%, #0EA5E9 100%)',
        
        // ROSE/PINK GRADIENTS
        'gradient-rose-pink': 'linear-gradient(135deg, #F43F5E 0%, #EC4899 100%)',
        'gradient-rose-fuchsia': 'linear-gradient(135deg, #F43F5E 0%, #D946EF 100%)',
        
        // INDIGO GRADIENTS
        'gradient-indigo-cyan': 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
        'gradient-indigo-sky': 'linear-gradient(135deg, #6366F1 0%, #0EA5E9 100%)',
        
        // MULTI-COLOR GRADIENTS (Balanced)
        'gradient-warm': 'linear-gradient(120deg, #F99912 0%, #F59E0B 50%, #EC4899 100%)',
        'gradient-cool': 'linear-gradient(120deg, #06B6D4 0%, #6366F1 50%, #9370DB 100%)',
        'gradient-sunset': 'linear-gradient(120deg, #F99912 0%, #F43F5E 50%, #D946EF 100%)',
        'gradient-forest': 'linear-gradient(120deg, #059669 0%, #9ACD32 50%, #14B8A6 100%)',
        'gradient-ocean': 'linear-gradient(120deg, #0EA5E9 0%, #06B6D4 50%, #14B8A6 100%)',
        'gradient-vibrant': 'linear-gradient(120deg, #F43F5E 0%, #F99912 25%, #9ACD32 50%, #14B8A6 75%, #9370DB 100%)',
        
        // SHADE VARIANTS
        'gradient-orange-shade': 'linear-gradient(135deg, #F99912 0%, #C77A0E 100%)',
        'gradient-lime-shade': 'linear-gradient(135deg, #9ACD32 0%, #7DA520 100%)',
        'gradient-purple-shade': 'linear-gradient(135deg, #9370DB 0%, #7851A9 100%)',
        
        // LIGHT TINTS
        'gradient-soft-warm': 'linear-gradient(135deg, #FED7AA 0%, #C4F34B 100%)',
        'gradient-soft-cool': 'linear-gradient(135deg, #A3E4D7 0%, #D8B4FE 100%)',
        'gradient-soft-mixed': 'linear-gradient(135deg, #FECACA 0%, #BEF264 50%, #AED9E0 100%)',
      },
    },
  },
  plugins: [],
}
