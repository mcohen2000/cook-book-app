import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router';

export interface DropdownMenuLink {
  text: string;
  url?: string;
  onClick?: () => void;
}

type LinksProp =
  | DropdownMenuLink[]
  | ((props: { setOpen: (open: boolean) => void }) => DropdownMenuLink[]);

interface DropdownMenuProps {
  trigger: ReactNode;
  links?: LinksProp;
  children?:
    | ReactNode
    | ((props: { setOpen: (open: boolean) => void }) => ReactNode);
  align?: 'left' | 'right';
  className?: string;
}

const DropdownMenu = ({
  trigger,
  links,
  children,
  align = 'right',
  className = '',
}: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Support links as a function to get setOpen
  const resolvedLinks =
    typeof links === 'function' ? links({ setOpen }) : links;

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        className='focus:outline-none'
      >
        {trigger}
      </button>
      {open && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200`}
        >
          {resolvedLinks && resolvedLinks.length > 0
            ? resolvedLinks.map((link, idx) => {
                if (link.onClick) {
                  return (
                    <button
                      key={link.text + idx}
                      type='button'
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
                      onClick={() => {
                        setOpen(false);
                        link.onClick && link.onClick();
                      }}
                    >
                      {link.text}
                    </button>
                  );
                } else if (link.url) {
                  return (
                    <Link
                      key={link.text + idx}
                      to={link.url}
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      onClick={() => setOpen(false)}
                    >
                      {link.text}
                    </Link>
                  );
                } else {
                  return (
                    <span
                      key={link.text + idx}
                      className='block px-4 py-2 text-sm text-gray-400 cursor-not-allowed'
                    >
                      {link.text}
                    </span>
                  );
                }
              })
            : typeof children === 'function'
            ? (
                children as (props: {
                  setOpen: (open: boolean) => void;
                }) => ReactNode
              )({ setOpen })
            : children}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
