import * as React from "react";

import { cn } from "./utils";

import primaryLogo from "../../assets/images/Asli_Bogor_Logo_Primary.svg";
import secondaryLogo from "../../assets/images/Asli_Bogor_Logo_Secondary.svg";
import logomarkLogo from "../../assets/images/Asli_Bogor_Logomark.svg";

type LogoVariant = "primary" | "secondary" | "logomark";

export interface AsliBogorLogoProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: LogoVariant;
}

const logoSources: Record<LogoVariant, string> = {
  primary: primaryLogo,
  secondary: secondaryLogo,
  logomark: logomarkLogo,
};

const defaultAlt: Record<LogoVariant, string> = {
  primary: "Logo utama Asli Bogor",
  secondary: "Logo sekunder Asli Bogor",
  logomark: "Logomark Asli Bogor",
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

