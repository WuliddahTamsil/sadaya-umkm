import * as React from "react";

import { cn } from "./utils";

type LogoVariant = "primary" | "secondary" | "logomark";

export interface AsliBogorLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: LogoVariant;
}

const logoSources: Record<LogoVariant, string> = {
  primary: "/logo/sadaya_1.svg",
  secondary: "/logo/sadaya_2.svg",
  logomark: "/logo/sadaya_1.svg",
};

const defaultAlt: Record<LogoVariant, string> = {
  primary: "Logo utama SADAYA",
  secondary: "Logo sekunder SADAYA",
  logomark: "Logomark SADAYA",
};

const defaultSizes: Record<LogoVariant, string> = {
  primary: "h-10 w-auto",
  secondary: "h-10 w-auto",
  logomark: "h-10 w-10",
};

export const AsliBogorLogo = React.forwardRef<
  HTMLImageElement,
  AsliBogorLogoProps
>(({ variant = "primary", className, alt, ...props }, ref) => {
  return (
    <img
      ref={ref}
      src={logoSources[variant]}
      alt={alt ?? defaultAlt[variant]}
      draggable={false}
      className={cn(
        "select-none align-middle",
        defaultSizes[variant],
        className,
      )}
      {...props}
    />
  );
});

AsliBogorLogo.displayName = "AsliBogorLogo";
