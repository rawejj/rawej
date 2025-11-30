"use client";

import React, { useState, useEffect } from "react";
import { DropdownMenu } from "./DropdownMenu";
import Button from "./Button";
import { useTranslations } from "@/providers/TranslationsProvider";

interface User {
  id: string;
  uuid: string;
  username: string;
  email: string;
  roles: string[];
  countryCode: string;
  mobile: string | null;
  firstName: string | null;
  lastName: string | null;
  gender: string;
  birthdate: string | null;
  status: {
    code: number;
    message: string;
  };
}

const UserAvatar: React.FC<{ onSignIn: () => void; refetchTrigger: number }> = ({ onSignIn, refetchTrigger }) => {
  const { t } = useTranslations();
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/v1/auth/me", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [refetchTrigger]);

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setShowDropdown(false);
      // Optionally redirect or refresh
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const getInitials = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  const getDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (loading) return;
          if (!user) {
            onSignIn();
          } else {
            setShowDropdown(!showDropdown);
          }
        }}
        disabled={loading}
        className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition-colors ${
          loading
            ? "bg-zinc-300 dark:bg-zinc-600 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
            : "bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
        }`}
      >
        {loading ? "..." : user ? getInitials(user) : (
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
        )}
      </button>
      {user && showDropdown && (
        <>
          {/* Triangle pointer */}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white dark:border-b-zinc-800 translate-y-1"></div>
          <DropdownMenu
            isOpen={showDropdown}
            onClose={() => setShowDropdown(false)}
            style={{ minWidth: "200px" }}
          >
            <div className="bg-white dark:bg-zinc-800 p-4 shadow-lg rounded-lg">
              <div className="mb-3">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{getDisplayName(user)}</p>
                {user.mobile && <p className="text-sm text-zinc-600 dark:text-zinc-400">{user.countryCode}{user.mobile}</p>}
              </div>
              <Button
                onClick={handleLogout}
                variant="secondary"
                fullWidth
                className="text-sm"
              >
                {t("auth.logout", "Logout")}
              </Button>
            </div>
          </DropdownMenu>
        </>
      )}
    </div>
  );
};

export default UserAvatar;