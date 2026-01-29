import type { SVGProps } from "react";

export function SportlightLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L12 22" stroke="hsl(var(--primary))" />
      <path d="M22 12L2 12" stroke="hsl(var(--primary))" />
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 22a10 10 0 1 1-10-10" />
    </svg>
  );
}
