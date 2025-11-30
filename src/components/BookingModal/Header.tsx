import Image from "next/image";
import React from "react";
import { Doctor } from "@/types/doctor";

interface HeaderProps {
  doctor: Doctor;
}

const Header: React.FC<HeaderProps> = ({ doctor }) => {
  return (
    <div className="flex items-center gap-3 mb-2 mt-2 p-1.5 rounded-3xl bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800/30">
      <div className="relative">
        <Image
          src={doctor.image || "/images/default-doctor.svg"}
          alt={doctor.name}
          width={44}
          height={44}
          className="rounded-full border-3 border-white dark:border-zinc-800 shadow-lg ring-2 ring-purple-200 dark:ring-pink-400/30"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/default-doctor.svg";
          }}
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-800 flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-lg text-purple-700 dark:text-pink-400 truncate">
          {doctor.name}
        </div>
        <div className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">
          {doctor.specialty}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-1">4.8</span>
        </div>
      </div>
    </div>
  );
};

export default Header;