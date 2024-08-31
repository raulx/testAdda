interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

const TypographyH1 = ({ children, className }: TypographyProps) => {
  return (
    <h1
      className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}
    >
      {children}
    </h1>
  );
};

const TypographyH2 = ({ children, className }: TypographyProps) => {
  return (
    <h2
      className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}
    >
      {children}
    </h2>
  );
};

const TypographyH3 = ({ children, className }: TypographyProps) => {
  return (
    <h3
      className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}
    >
      {children}
    </h3>
  );
};

const TypographyH4 = ({ children, className }: TypographyProps) => {
  return (
    <h4
      className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}
    >
      {children}
    </h4>
  );
};

const TypographyP = ({ children, className }: TypographyProps) => {
  return (
    <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}>
      {children}
    </p>
  );
};

const TypographyLead = ({ children, className }: TypographyProps) => {
  return (
    <p className={`text-xl text-muted-foreground ${className}`}>{children}</p>
  );
};

const TypographyBlockquote = ({ children, className }: TypographyProps) => {
  return (
    <blockquote className={`mt-6 border-l-2 pl-6 italic ${className}`}>
      {children}
    </blockquote>
  );
};

export {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyLead,
  TypographyBlockquote,
};
