import React from "react";

export default function MenuIcon(props: {
  svg?: React.SVGProps<SVGSVGElement>;
  path?: React.SVGProps<SVGPathElement>;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="50"
      viewBox="0 0 60 50"
      fill="none"
      {...props.svg}
    >
      <path
        d="M5 25H55M5 10H55M15 40H55"
        stroke="#FEFEFE"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props.path}
      />
    </svg>
  );
}