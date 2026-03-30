"use client";
import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm mr-4  text-black px-2 py-1  relative z-20"
    >
      <Image
        src="/ntech-official-logo.png"
        alt="N-Tech Digital Solutions"
        width={200}
        height={48}
        className="h-9 w-auto max-h-10 object-contain md:h-10"
        priority
      />
      <span className="font-medium text-black dark:text-white">
        N-Tech Digital Solutions
      </span>
    </Link>
  );
};
