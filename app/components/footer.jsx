import React from "react";
import Image from "next/image";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative p-4 mt-8  text-white w-full h-[80px] bg-black rounded-md overflow-hidden shadow-lg rounded-b-none">
      <div
        className="absolute inset-0 opacity-20 z-0"
        style={{
          backgroundImage: `url('/gallery/bunny1.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="container flex items-center justify-evenly h-full relative z-10">
        <div className="flex items-center space-x-4">
          <Image
            src="/gallery/kzz1.png"
            alt="Kaizen Logo"
            width={50}
            height={15}
            objectFit="cover"
            objectPosition="50% 50%"
          />
        </div>
        <div className="text-xs text-center md:text-sm">
          <p>© 2023 Kaizen. All rights reserved.</p>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/Ajeylani7"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/adam-jeylani777/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
