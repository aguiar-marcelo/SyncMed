import * as React from "react";

export interface DotGridIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  title?: string;
  color?: string;
}

const DotGridIcon = React.forwardRef<SVGSVGElement, DotGridIconProps>(
  ({ size = 60, strokeWidth = 2, color = "currentColor", title, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 45 45"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role="img"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <circle cx="12" cy="5" r="1" />
      <circle cx="19" cy="5" r="1" />
      <circle cx="5" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
      <circle cx="19" cy="19" r="1" />
      <circle cx="5" cy="19" r="1" />
      <circle cx="12" cy="26" r="1" />
      <circle cx="19" cy="26" r="1" />
      <circle cx="5" cy="26" r="1" />
      <circle cx="12" cy="33" r="1" />
      <circle cx="19" cy="33" r="1" />
      <circle cx="5" cy="33" r="1" />
      <circle cx="12" cy="40" r="1" />
      <circle cx="19" cy="40" r="1" />
      <circle cx="5" cy="40" r="1" />
      <circle cx="33" cy="5" r="1" />
      <circle cx="40" cy="5" r="1" />
      <circle cx="26" cy="5" r="1" />
      <circle cx="33" cy="12" r="1" />
      <circle cx="40" cy="12" r="1" />
      <circle cx="26" cy="12" r="1" />
      <circle cx="33" cy="19" r="1" />
      <circle cx="40" cy="19" r="1" />
      <circle cx="26" cy="19" r="1" />
      <circle cx="33" cy="26" r="1" />
      <circle cx="40" cy="26" r="1" />
      <circle cx="26" cy="26" r="1" />
      <circle cx="33" cy="33" r="1" />
      <circle cx="40" cy="33" r="1" />
      <circle cx="26" cy="33" r="1" />
      <circle cx="33" cy="40" r="1" />
      <circle cx="40" cy="40" r="1" />
      <circle cx="26" cy="40" r="1" />
    </svg>
  ),
);

DotGridIcon.displayName = "DotGridIcon";
export default React.memo(DotGridIcon);
