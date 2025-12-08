"use client";
import Link from "next/link";
import {
  BriefcaseIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation"; //

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const linkClass = (href: string, baseClasses: string) => {
    const isActive = pathname === href;
    return `${baseClasses} ${
      isActive
        ? "bg-teal-50 text-teal-700 font-bold"
        : "text-gray-700 hover:bg-gray-100"
    }`;
  };

  const navItems = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Browse Jobs", href: "/jobs", icon: MagnifyingGlassIcon },
    {
      name: "Post a Job",
      href: "/jobs/post",
      icon: ClipboardDocumentListIcon,
      isPrimary: true,
    },
  ];

  return (
    <nav className="fixed top-0 w-full z-10 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href={"/"}
              className="flex items-center space-x-2 text-teal-600 hover:text-teal-800"
            >
              <BriefcaseIcon className="size-6" />
              <h1 className="text-xl font-bold tracking-wide">Job Board</h1>
            </Link>
          </div>

          <div className="sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:space-x-2 lg:space-x-4 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={linkClass(
                  item.href,
                  "px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out whitespace-nowrap"
                )}
              >
                {item.name}
              </Link>
            ))}

            {session ? (
              <>
                <Link
                  href={"/dashboard"}
                  className={linkClass(
                    "/dashboard",
                    "px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                  )}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:bg-red-50 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out whitespace-nowrap"
                >
                  LogOut
                </button>
              </>
            ) : (
              <Link
                href={"/auth/signin"}
                className={linkClass(
                  "/auth/signin",
                  "px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out whitespace-nowrap"
                )}
              >
                LogIn
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className={`sm:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={linkClass(
                  item.href,
                  "w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
                )}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                <Icon
                  className="h-6 w-6 mr-3 text-teal-600"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}

          {session ? (
            <>
              <Link
                href={"/dashboard"}
                onClick={() => setIsOpen(false)}
                className={linkClass(
                  "/dashboard",
                  "w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
                )}
                aria-current={pathname === "/dashboard" ? "page" : undefined}
              >
                <UserIcon
                  className="h-6 w-6 mr-3 text-teal-600"
                  aria-hidden="true"
                />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition duration-150 ease-in-out"
              >
                <ArrowLeftOnRectangleIcon
                  className="h-6 w-6 mr-3 text-red-600"
                  aria-hidden="true"
                />
                LogOut
              </button>
            </>
          ) : (
            <Link
              href={"/auth/signin"}
              onClick={() => setIsOpen(false)}
              className={linkClass(
                "/auth/signin",
                "w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
              )}
            >
              <ArrowRightOnRectangleIcon
                className="h-6 w-6 mr-3 text-teal-600"
                aria-hidden="true"
              />
              LogIn
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
