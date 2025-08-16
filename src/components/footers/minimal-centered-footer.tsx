import { ArrowUpRight } from "lucide-react";

const MinimalCenteredFooter = () => {
  const navigation = [
    { name: "Components", href: "#" },
    { name: "Examples", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "TypeScript", href: "#" },
  ];

  const social = [
    { name: "GitHub", href: "https://github.com/your-username/component-library" },
    { name: "NPM Package", href: "https://www.npmjs.com/package/your-component-library" },
    { name: "Storybook", href: "https://your-storybook-url.com" },
    { name: "Design System", href: "https://your-design-system-url.com" },
  ];

  const legal = [
    { name: "MIT License", href: "#" },
    { name: "Contributing", href: "#" },
    { name: "Changelog", href: "#" },
  ];

  return (
    <section className="flex flex-col items-center gap-14 py-32 bg-background">
      <nav className="container flex flex-col items-center gap-4">
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="font-medium transition-opacity hover:opacity-75"
              >
                {item.name}
              </a>
            </li>
          ))}
          {social.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="flex items-center gap-0.5 font-medium transition-opacity hover:opacity-75"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.name} <ArrowUpRight className="size-4" />
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {legal.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="text-sm text-muted-foreground transition-opacity hover:opacity-75"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};

export { MinimalCenteredFooter };