import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

// Import your logo assets
import { NavLink, useLocation, useNavigate } from "react-router";
import { logout } from "@/auth/authSlice";

type Props = {
  drawerWidth: number;
  handleDrawerToggle: () => void;
  mobileOpen: boolean;
};

function SideNav({ drawerWidth, handleDrawerToggle, mobileOpen }: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  // const user = useSelector(selectCurrentUser);
  const sideNavRef = useRef<HTMLDivElement>(null);
  const userRole: "admin" | "individual" | "organization" = "individual"; // Temporary user role assignment for development purposes

  // Handle click outside to close mobile drawer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileOpen &&
        sideNavRef.current &&
        !sideNavRef.current.contains(event.target as Node)
      ) {
        handleDrawerToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpen, handleDrawerToggle]);

  const handleLogout = () => {
    setIsLoading(true);
    dispatch(logout());
    navigate("/login");
    setIsLoading(false);
  };

  const adminNavItems = [
    {
      text: "Dashboard",
      link: "/dashboard",
    },
    {
      text: "Add Number",
      link: "/add-number",
    },
  ];

  const individualNavItems = [
    {
      text: "Home",
      link: "/dashboard",
    },
    {
      text: "Explore",
      link: "/explore",
    },
    {
      text: "Explore AI",
      link: "/ai",
    },
    {
      text: "Maps",
      link: "/maps",
    },
    {
      text: "Profile",
      link: "/settings",
    },
  ];

  const organizationNavItems = [
    {
      text: "Dashboard",
      link: "/dashboard",
    },
    {
      text: "Events",
      link: "/events",
    },
    {
      text: "Deals",
      link: "/deals",
    },
    {
      text: "Reviews",
      link: "/reviews",
    },
    {
      text: "Analytics",
      link: "/analytics",
    },
    {
      text: "Notifications",
      link: "/notifications",
    },
    {
      text: "Settings",
      link: "/settings",
    },
  ];

  // const navItems =
  //   user?.role === "admin"
  //     ? adminNavItems
  //     : user?.role === "individual"
  //     ? individualNavItems
  //     : organizationNavItems;

  const getUserNavItems = (role: "admin" | "individual" | "organization") => {
    switch (role) {
      case "admin":
        return adminNavItems;
      case "individual":
        return individualNavItems;
      case "organization":
        return organizationNavItems;
      default:
        return organizationNavItems;
    }
  };

  const navItems = getUserNavItems(userRole);

  const drawer = (
    <div className="px-4 h-full overflow-auto">
      <div className="my-12 flex justify-center items-center flex-col">
        <div className="flex items-center gap-2 w-full justify-between">
          <div className="w-full">
            <div className="w-full flex flex-col justify-center items-center">
              {/* <img
                src={connectedLogoDark}
                alt="connected logo"
                className="w-3/4 h-auto hidden dark:block"
              />
              <img
                src={connectedLogoLight}
                alt="connected logo"
                className="w-3/4 h-auto block dark:hidden"
              /> */}
            </div>
            <p className="text-lg font-bold uppercase mt-4 text-bg-primary-dark2">
              City Explorer
            </p>
          </div>
          <button onClick={handleDrawerToggle} className="block sm:hidden">
            <ChevronLeft className="text-[#95969D] cursor-pointer" />
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-between h-[75%]">
        <ul className="space-y-1">
          {navItems.map((item, index) => {
            // const isActive = location.pathname.includes(item.link);

            return (
              <li key={index} className="">
                <NavLink
                  to={item.link}
                  className={() =>
                    location.pathname.includes(`${item.link}`)
                      ? "text-white block w-full bg-bg-primary-dark2"
                      : "text-primary block w-full"
                  }

                  // onClick={() => navigate(`${item.link}`)}
                >
                  <div
                    className="flex items-center gap-2 p-3"
                    onClick={handleDrawerToggle}
                  >
                    <span
                      // className={`text-base ${
                      //   isActive ? "font-bold" : "font-lexend"
                      // }`}
                      className="text-base font-semibold"
                    >
                      {item.text}
                    </span>
                  </div>
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={handleLogout}
          >
            {isLoading ? "Loading..." : "LOGOUT"}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay for mobile when drawer is open */}
      <div
        className={`
          fixed inset-0 bg-black/50 z-30 sm:hidden
          transition-opacity duration-300 ease-in-out
          ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        aria-hidden="true"
      />

      <nav
        style={{ "--drawer-width": `${drawerWidth}px` } as React.CSSProperties}
        className="sm:w-[var(--drawer-width)] sm:flex-shrink-0"
      >
        {/* Mobile drawer */}
        <div
          ref={sideNavRef}
          className={`
            fixed inset-y-0 left-0 z-40 
            w-[var(--drawer-width)] 
            transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
            transition-transform duration-300 ease-in-out
            bg-bg-primary border-none
            block sm:hidden
          `}
        >
          <div className="h-full overflow-y-auto">{drawer}</div>
        </div>

        {/* Desktop permanent drawer */}
        <div className="hidden sm:block fixed inset-y-0 left-0 z-40 w-[var(--drawer-width)] bg-bg-primary border-none overflow-y-auto">
          {drawer}
        </div>
      </nav>
    </>
  );
}

export default SideNav;
