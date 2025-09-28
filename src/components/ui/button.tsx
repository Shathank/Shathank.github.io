"use client";

import { Children, cloneElement, forwardRef } from 'react';
import type { ButtonHTMLAttributes, MouseEvent, ReactElement, ReactNode } from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
  asChild?: boolean;
};

type AsChildElementProps = {
  className?: string;
  children?: ReactNode;
  tabIndex?: number;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  'aria-disabled'?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-sky-600 text-white shadow-sm hover:bg-sky-500 focus-visible:outline-sky-500 disabled:bg-sky-300',
  secondary:
    'bg-slate-900 text-slate-100 hover:bg-slate-800 focus-visible:outline-slate-600 disabled:bg-slate-700',
  ghost:
    'bg-transparent hover:bg-slate-100 text-slate-700 focus-visible:outline-slate-300 disabled:text-slate-400',
  outline:
    'border border-slate-300 text-slate-800 hover:bg-slate-50 focus-visible:outline-slate-400 disabled:text-slate-400',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, icon, variant = 'primary', loading, disabled, asChild, onClick, ...rest }, ref) => {
    if (asChild) {
      const child = Children.only(children) as ReactElement<AsChildElementProps>;
      const additionalClickHandler = onClick as unknown as
        | ((event: MouseEvent<HTMLElement>) => void)
        | undefined;

      const childContent = child.props.children;

      return cloneElement(
        child,
        {
          className: cn(
            'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
            variantStyles[variant],
            (disabled || loading) && 'cursor-not-allowed opacity-60',
            child.props.className,
            className,
          ),
          'aria-disabled': disabled || loading ? true : undefined,
          tabIndex: disabled || loading ? -1 : child.props.tabIndex,
          onClick: (event: MouseEvent<HTMLElement>) => {
            if (disabled || loading) {
              event.preventDefault();
              event.stopPropagation();
              return;
            }

            child.props.onClick?.(event);
            additionalClickHandler?.(event);
          },
        },
        <>
          {loading && (
            <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
          )}
          {icon}
          <span>{childContent}</span>
        </>,
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          variantStyles[variant],
          (disabled || loading) && 'cursor-not-allowed opacity-60',
          className,
        )}
        disabled={disabled || loading}
        onClick={onClick}
        {...rest}
      >
        {loading && (
          <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
        )}
        {icon}
        <span>{children}</span>
      </button>
    );
  },
);

Button.displayName = 'Button';
