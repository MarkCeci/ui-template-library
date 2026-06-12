import { iconMap, type IconName } from "@/lib/icon-map";

type IconProps = {
  icon: IconName;
  size?: number | string;
  color?: string;
  className?: string;
  title?: string;
};

export function Icon({
  icon,
  size = 20,
  color = "#475569",
  className,
  title,
}: IconProps) {
  const definition = iconMap[icon];
  const resolvedSize = typeof size === "number" ? `${size}px` : size;

  return (
    <svg
      aria-hidden={title ? undefined : true}
      className={["ui-icon", className].filter(Boolean).join(" ")}
      data-icon={icon}
      data-iconify={definition.iconify}
      role={title ? "img" : undefined}
      style={{
        width: resolvedSize,
        height: resolvedSize,
        color,
      }}
      viewBox="0 0 24 24"
    >
      {title ? <title>{title}</title> : null}
      {definition.paths.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}

export type { IconName };
