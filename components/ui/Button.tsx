import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-semibold " +
  "transition-[background-color,color,box-shadow,transform] duration-200 ease-[var(--ease-out-soft)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-card hover:bg-primary-hover hover:shadow-hover hover:-translate-y-0.5",
  secondary:
    "bg-background text-foreground border border-border hover:border-foreground/30 hover:-translate-y-0.5",
  ghost: "bg-transparent text-foreground hover:bg-surface",
  inverse:
    "bg-background text-foreground hover:bg-surface hover:-translate-y-0.5 shadow-card",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** 끝에 화살표 아이콘 표시 */
  withArrow?: boolean;
};

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

type LinkProps = CommonProps & { href: string };

/**
 * 공용 버튼 (DESIGN.md §4). href가 있으면 Next Link, 없으면 <button>.
 * 최소 터치 타깃 44px(h-11). hover 시 살짝 떠오르는 마이크로 인터랙션.
 */
export default function Button(props: ButtonProps | LinkProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className = "",
    withArrow = false,
  } = props;
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {children}
      {withArrow && <Arrow />}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={cls}>
        {content}
      </Link>
    );
  }

  // 공용/스타일 관련 prop은 DOM에 흘리지 않는다(className 등이 cls를 덮어쓰는 버그 방지)
  const {
    href: _href,
    withArrow: _wa,
    variant: _variant,
    size: _size,
    className: _className,
    children: _children,
    ...buttonProps
  } = props as ButtonProps;
  void _href;
  void _wa;
  void _variant;
  void _size;
  void _className;
  void _children;
  return (
    <button className={cls} {...buttonProps}>
      {content}
    </button>
  );
}

function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-200 ease-[var(--ease-out-soft)] group-hover:translate-x-0.5"
    >
      <path
        d="M3 8h9M8.5 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
