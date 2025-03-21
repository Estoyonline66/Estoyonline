import React from "react";

export default function MenuIcon(props: {
  svg?: React.SVGProps<SVGSVGElement>;
  path?: React.SVGProps<SVGPathElement>;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="22"
      viewBox="0 0 32 22"
      fill="none"
      {...props.svg}
    >
      <path
        d="M1 11H31M1 1H31M11 21H31"
        stroke="#FEFEFE"
        strokeOpacity="0.996078"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props.path}
      />
    </svg>
  );
}
