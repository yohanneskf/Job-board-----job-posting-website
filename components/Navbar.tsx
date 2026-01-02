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
  DocumentTextIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const linkClass = (href: string, baseClasses: string, isPrimary = false) => {
    const isActive = pathname === href;
    if (isPrimary) {
      return `${baseClasses} bg-teal-600 text-white hover:bg-teal-700 shadow-md transform hover:scale-105 transition-all`;
    }
    return `${baseClasses} ${
      isActive
        ? "bg-teal-50 text-teal-700 font-bold"
        : "text-gray-700 hover:bg-gray-100"
    }`;
  };

  const userRole = (session?.user as any)?.role || "FREELANCER";

  // Define links based on role
  const commonLinks = [
    { name: "Home", href: "/", icon: HomeIcon, isPrimary: false },
  ];

  const freelancerLinks = [
    {
      name: "Find Work",
      href: "/jobs",
      icon: MagnifyingGlassIcon,
      isPrimary: false,
    },
    {
      name: "My Proposals",
      href: "/proposals",
      icon: DocumentTextIcon,
      isPrimary: false,
    },
  ];

  const clientLinks = [
    {
      name: "Post a Job",
      href: "/jobs/post",
      icon: ClipboardDocumentListIcon,
      isPrimary: true,
    },
    { name: "Proposals / Jobs", href: "/proposals", icon: DocumentTextIcon }, // Client sees proposals for their jobs
  ];

  const roleLinks = userRole === "CLIENT" ? clientLinks : freelancerLinks;

  const navItems = [...commonLinks, ...roleLinks];

  return (
    <nav className="fixed top-0 w-full z-20 bg-white shadow-sm border-b border-gray-100 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href={"/"}
              className="flex items-center space-x-2 text-teal-600 hover:text-teal-800 transition"
            >
              <BriefcaseIcon className="size-8" />
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                Work<span className="text-teal-600">Hive</span>
              </span>
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

          <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={linkClass(
                  item.href,
                  "px-3 py-2 rounded-full text-sm font-medium transition duration-150 ease-in-out whitespace-nowrap",
                  item.isPrimary
                )}
              >
                {item.name}
              </Link>
            ))}

            {session ? (
              <div className="flex items-center space-x-3 ml-4 border-l pl-4 border-gray-200">
                <Link
                  href={"/profile"}
                  className={linkClass(
                    "/profile",
                    "flex items-center px-3 py-2 rounded-full text-sm font-medium transition duration-150 ease-in-out"
                  )}
                >
                  <UserCircleIcon className="h-5 w-5 mr-1" />
                  <span className="hidden lg:inline">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:bg-red-50 hover:text-red-600 p-2 rounded-full transition duration-150 ease-in-out"
                  title="Sign Out"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href={"/auth/signin"}
                  className="text-gray-700 hover:text-teal-600 font-medium px-3 py-2"
                >
                  Log In
                </Link>
                <Link
                  href={"/auth/signin"}
                  className="bg-teal-600 text-white px-5 py-2 rounded-full font-bold hover:bg-teal-700 transition shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`sm:hidden ${
          isOpen ? "block" : "hidden"
        } border-t border-gray-100`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={linkClass(
                  item.href,
                  "w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out",
                  item.isPrimary
                )}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                <Icon className="h-5 w-5 mr-3" aria-hidden="true" />
                {item.name}
              </Link>
            );
          })}

          {session ? (
            <>
              <Link
                href={"/profile"}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                <UserCircleIcon
                  className="h-5 w-5 mr-3 text-teal-600"
                  aria-hidden="true"
                />
                My Profile
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition duration-150 ease-in-out"
              >
                <ArrowLeftOnRectangleIcon
                  className="h-5 w-5 mr-3 text-red-600"
                  aria-hidden="true"
                />
                LogOut
              </button>
            </>
          ) : (
            <Link
              href={"/auth/signin"}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowRightOnRectangleIcon
                className="h-5 w-5 mr-3 text-teal-600"
                aria-hidden="true"
              />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
