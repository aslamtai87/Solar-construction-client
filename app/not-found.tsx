"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { House } from 'lucide-react';
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center w-full justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Container for the 404 content */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        {/* 404 Heading */}
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-9xl font-bold text-gray-900 dark:text-gray-100"
        >
          404
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-2xl text-gray-600 dark:text-gray-300"
        >
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </motion.p>

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link href="/dashboard">
            <Button className="mt-6">
              <House className="mr-2 h-4 w-4" /> Go Back Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
