import React from "react";

export default function MenuIcon(props: {
  svg?: React.SVGProps<SVGSVGElement>;
  path?: React.SVGProps<SVGPathElement>;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="30"
      viewBox="0 0 40 30"
      fill="none"
      {...props.svg}
    >
      <path
        d="M2 15H38M2 5H38M12 25H38"
        stroke="#FEFEFE"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props.path}
      />
    </svg>
  );
}