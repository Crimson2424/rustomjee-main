import React from "react";

const FloorPlanIcon = ({ size, className, title }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={`lucide lucide-floor-plan-icon lucide-floor-plan ` + className}
    >
      <title>{title}</title>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
      <path d="M9 3v7" />
      <path d="M21 10h-7" />
      <path d="M3 15h9" />
    </svg>
  );
};

export { FloorPlanIcon };

<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="0.75"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="lucide lucide-floor-plan-icon lucide-floor-plan"
>
  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
  <path d="M9 3v7" />
  <path d="M21 10h-7" />
  <path d="M3 15h9" />
</svg>;
