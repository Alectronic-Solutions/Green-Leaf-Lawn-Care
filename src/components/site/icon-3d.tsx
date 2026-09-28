import { cn } from "@/lib/utils";
import { assetPath } from "@/lib/asset-path";

// Every icon on the site is one of these 3D renders (Fluent Emoji, MIT).
// They sit directly on the surface with a soft contact shadow and never get
// a chip or circle behind them. Run `npm run fetch-icons` to add more.
export type Icon3DName =
  | "bell" | "blossom" | "books" | "briefcase" | "broom" | "bug" | "bulb"
  | "calendar" | "camera" | "chat" | "clipboard" | "clock" | "coin" | "dog"
  | "droplet" | "envelope" | "evergreen" | "fallen-leaf" | "flag" | "gift"
  | "glowing-star" | "handshake" | "herb" | "hourglass" | "house" | "hundred"
  | "ice" | "id" | "joystick" | "leaf" | "link" | "lock" | "map"
  | "maple-leaf" | "medal" | "memo" | "mobile" | "money" | "muted" | "party"
  | "paw" | "phone" | "pin" | "receipt" | "repeat" | "rock" | "ruler"
  | "search" | "seedling" | "sheaf" | "shield" | "snowflake" | "snowman"
  | "sparkles" | "speaker" | "star" | "stopwatch" | "sun-cloud" | "sun"
  | "tools" | "tractor" | "tree" | "trophy" | "tulip";

export function iconSrc(name: Icon3DName) {
  return assetPath(`/icons/3d/${name}.webp`);
}

export function Icon3D({
  name,
  size = 40,
  className,
  float = false,
  label,
}: {
  name: Icon3DName;
  size?: number;
  className?: string;
  /** Lift gently when the nearest `.group` ancestor is hovered. */
  float?: boolean;
  /** Accessible name. Omit for decorative icons next to visible text. */
  label?: string;
}) {
  return (
    <img
      src={iconSrc(name)}
      width={size}
      height={size}
      alt={label ?? ""}
      aria-hidden={label ? undefined : true}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn(
        "icon-3d inline-block shrink-0 select-none",
        float && "icon-3d-float",
        className
      )}
      style={{ width: size, height: size }}
    />
  );
}
