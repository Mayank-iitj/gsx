"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter, MessageCircle, Mail, ArrowRight } from "lucide-react";

export const FooterComponent = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const navigationSections = [
    {
      title: "Components",
      links: [
        { label: "InputField", href: "#inputfield" },
        { label: "DataTable", href: "#datatable" },
        { label: "All Components", href: "#components" },
        { label: "Playground", href: "#playground" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Getting Started", href: "#getting-started" },
        { label: "Design System", href: "#design-system" },
        { label: "Examples", href: "#examples" },
        { label: "Best Practices", href: "#best-practices" }
      ]
    },
    {
      title: "Documentation",
      links: [
        { label: "API Reference", href: "#api" },
        { label: "Theming Guide", href: "#theming" },
        { label: "Changelog", href: "#changelog" },
        { label: "Migration Guide", href: "#migration" }
      ]
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com",
      hoverColor: "hover:text-purple-600 dark:hover:text-purple-400"
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "https://twitter.com",
      hoverColor: "hover:text-blue-500 dark:hover:text-blue-400"
    },
    {
      icon: MessageCircle,
      label: "Discord",
      href: "https://discord.com",
      hoverColor: "hover:text-indigo-600 dark:hover:text-indigo-400"
    }
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                ComponentUI
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Professional React components built with TypeScript and Tailwind CSS. 
                Create beautiful, accessible interfaces with our comprehensive component library.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`text-muted-foreground ${social.hoverColor} transition-colors duration-200`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          {navigationSections.map((section) => (
            <div key={section.title} className="lg:col-span-2">
              <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Section */}
          <div className="lg:col-span-4">
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Stay Updated
            </h4>
            <p className="text-muted-foreground text-sm mb-4">
              Get the latest updates, new components, and design tips delivered to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-sm"
                  required
                />
                <Button
                  type="submit"
                  size="sm"
                  className="px-3"
                  disabled={isSubscribed}
                >
                  {isSubscribed ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {isSubscribed && (
                <p className="text-green-600 dark:text-green-400 text-xs animate-in slide-in-from-bottom-2">
                  ✓ Successfully subscribed!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
              <p>© 2024 ComponentUI. All rights reserved.</p>
              <div className="flex items-center space-x-4">
                <a href="#privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <span>•</span>
                <a href="#terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <span className="inline-flex items-center space-x-1">
                <span>Version</span>
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                  2.1.0
                </code>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};