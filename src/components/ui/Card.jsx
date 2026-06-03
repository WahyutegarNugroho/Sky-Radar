export function Card({ children, className = '', as = 'div', ...props }) {
  const Comp = as;
  return (
    <Comp className={`bg-white ${className}`} {...props}>
      {children}
    </Comp>
  );
}

export function CardSecondary({ children, className = '', as = 'div', ...props }) {
  const Comp = as;
  return (
    <Comp className={`bg-gray-50 ${className}`} {...props}>
      {children}
    </Comp>
  );
}

export function CardInteractive({ children, className = '', as = 'div', ...props }) {
  const Comp = as;
  return (
    <Comp className={`bg-white border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer ${className}`} {...props}>
      {children}
    </Comp>
  );
}
