"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Code2, Zap, Shield, Smartphone, Palette, ArrowRight } from "lucide-react";
import { useState } from "react";

const mockTableData = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Editor" },
];

export const HeroSection = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const features = [
    { icon: Code2, title: "TypeScript Ready", desc: "Full type safety out of the box" },
    { icon: Shield, title: "Accessible", desc: "WCAG compliant with ARIA support" },
    { icon: Smartphone, title: "Responsive", desc: "Works perfectly on all devices" },
    { icon: Palette, title: "Customizable", desc: "Themeable with CSS variables" },
    { icon: Zap, title: "Performant", desc: "Optimized for speed and efficiency" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-400/10 to-yellow-600/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Badge variant="secondary" className="mb-4 px-3 py-1.5 text-sm font-medium">
                  Professional UI Components
                </Badge>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Beautiful Components
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Built for Scale
                </span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Discover our premium InputField and DataTable components. 
                TypeScript-first, accessible, and beautifully designed for modern applications.
              </motion.p>
            </div>

            {/* Feature highlights */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex flex-col items-center text-center p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                >
                  <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Button
                size="lg"
                onClick={() => scrollToSection("input-field")}
                className="group px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore InputField
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("data-table")}
                className="group px-8 py-6 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
              >
                View DataTable
                <ChevronDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right column - Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* InputField Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <motion.div
                      className="w-3 h-3 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    InputField Component
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Interactive Demo
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        placeholder="Type something amazing..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="transition-all duration-300 focus:shadow-lg"
                      />
                    </motion.div>
                    {inputValue && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-blue-600 dark:text-blue-400 font-medium"
                      >
                        You typed: "{inputValue}"
                      </motion.p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* DataTable Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <motion.div
                      className="w-3 h-3 bg-blue-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                    DataTable Component
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-200 dark:border-gray-600">
                      <div>Name</div>
                      <div>Email</div>
                      <div>Role</div>
                    </div>
                    {mockTableData.map((row, index) => (
                      <motion.div
                        key={row.id}
                        className={`grid grid-cols-3 gap-2 text-sm p-2 rounded cursor-pointer transition-all duration-200 ${
                          selectedRow === row.id
                            ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                        onClick={() => setSelectedRow(selectedRow === row.id ? null : row.id)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="font-medium text-gray-900 dark:text-white truncate">
                          {row.name}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 truncate">
                          {row.email}
                        </div>
                        <div>
                          <Badge variant={row.role === "Admin" ? "default" : "secondary"} className="text-xs">
                            {row.role}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center text-gray-500 dark:text-gray-400 cursor-pointer"
            onClick={() => scrollToSection("input-field")}
          >
            <span className="text-sm font-medium mb-2">Explore Components</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};