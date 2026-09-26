import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LogoProps {
  size?: number;
  height?: number;
  width?: number;
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  priority?: boolean;
}

/**
 * Official EaseLife Logo Icon (Mark Only)
 * Sourced from /EaseLife-icon.webp (extracted from EaseLife-logo.webp)
 */
export function EaseLifeIcon({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const iconHeight = size;
  const iconWidth = Math.round(size * (514 / 463));

  return (
    <Image
      src="/EaseLife-icon.webp"
      alt="EaseLife Icon"
      width={iconWidth}
      height={iconHeight}
      className={cn("object-contain shrink-0", className)}
      style={{ height: `${iconHeight}px`, width: "auto" }}
      priority
    />
  );
}

/**
 * Official EaseLife Brand Logo
 * Sourced from /EaseLife-logo.webp
 * Dimensions: 2169 x 725 (~2.99:1 aspect ratio)
 */
export function EaseLifeLogo({
  size = 32,
  height,
  width,
  showText = true,
  className = "",
  priority = true,
}: LogoProps) {
  if (!showText) {
    return <EaseLifeIcon size={size} className={className} />;
  }

  const logoHeight = height || size || 32;
  const logoWidth = width || Math.round(logoHeight * (2169 / 725));

  return (
    <div className={cn("inline-flex items-center select-none", className)}>
      <Image
        src="/EaseLife-logo.webp"
        alt="EaseLife — Structure Your Vision. Ease Your Days."
        width={logoWidth}
        height={logoHeight}
        priority={priority}
        className="object-contain"
        style={{ height: `${logoHeight}px`, width: "auto" }}
      />
    </div>
  );
}
