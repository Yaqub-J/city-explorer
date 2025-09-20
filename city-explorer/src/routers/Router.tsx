/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../app/hooks";
import { login, selectCurrentUser } from "@/auth/authSlice";
import Layout from "@/layout/dashboard/Layout";
import Login from "@/auth/Login";
import BusinessDashboard from "@/roles/business/pages/BusinessDashboard";
import BusinessEvents from "@/roles/business/pages/BusinessEvents";
import BusinessDeals from "@/roles/business/pages/BusinessDeals";
import BusinessReviews from "@/roles/business/pages/BusinessReviews";
import BusinessAnalytics from "@/roles/business/pages/BusinessAnalytics";
import BusinessNotifications from "@/roles/business/pages/BusinessNotifications";
import BusinessSettings from "@/roles/business/pages/BusinessSettings";
import Dashboard from "@/roles/individual/pages/Dashboard";
import Explore from "@/roles/individual/pages/Explore";
import ExploreAI from "@/roles/individual/pages/ExploreAI";
import ExploreMaps from "@/roles/individual/pages/ExploreMaps";
import Profile from "@/roles/individual/pages/Profile";
import BusinessPage from "@/roles/business/pages/BusinessPage";
import Interests from "@/roles/individual/pages/Interests";
import EditProfile from "@/roles/individual/pages/EditProfile";
import PaymentPage from "@/roles/individual/pages/PaymentPage";
import Signup from "@/auth/Signup";
// Organization routes

type ProtectedRoute = {
  user: any;
  children?: any;
};

const ProtectedRoute = ({ user, children }: ProtectedRoute) => {
  //wrapper component for protected routes
  // const isAuth = !!user;
  console.log("ProtectedRoute user:", user);
  const isAuth = true;

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const NoNav = () => (
  <>
    <Outlet />
  </>
);

const Router = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false); // <-- hydration state

  const [currentUserRole, setCurrentUserRole] = useState<
    "individual" | "business"
  >("individual");
  // let currentUserRole = null;
  // if (user) {
  //   currentUserRole = user.role;
  // }
  if (!currentUserRole) {
    setCurrentUserRole("individual");
  }

  useEffect(() => {
    //log the user back in with local storage data
    const userString = localStorage.getItem("user");
    const access_tokenString = localStorage.getItem("access_token");
    const refresh_tokenString = localStorage.getItem("refresh_token");

    if (userString && access_tokenString && refresh_tokenString && !user) {
      const data = JSON.parse(userString) as any;
      const access_token = JSON.parse(access_tokenString) as string;
      const refresh_token = JSON.parse(refresh_tokenString) as string;

      dispatch(login({ data, access_token, refresh_token }));
    }
    setIsAuthLoaded(true); // <-- set loaded after checking localStorage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    //route the user to dashboard, if a logged in user tries to access signin page
    if (
      !!user &&
      (location.pathname === "/" || location.pathname === "/login")
    ) {
      navigate("/dashboard");
    }
  }, [navigate, user]);

  if (!isAuthLoaded) {
    // Show loading spinner while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<NoNav />}>
        {/* public routes that dont have the sidebar nav */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="*" element={<h1>Url does not match</h1>} />
        {/*
         Landing page routing below 
         Landing page path should be '/' while login and signup should be '/login' and '/register' respectfully 
        */}
      </Route>
      {/* Admin routes */}
      {currentUserRole === "business" ? (
        <Route
          //protected pages
          element={
            <ProtectedRoute user={user}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<BusinessDashboard />} />
          <Route path="/events" element={<BusinessEvents />} />
          <Route path="/deals" element={<BusinessDeals />} />
          <Route path="/reviews" element={<BusinessReviews />} />
          <Route path="/analytics" element={<BusinessAnalytics />} />
          <Route path="/notifications" element={<BusinessNotifications />} />
          <Route path="/settings" element={<BusinessSettings />} />
        </Route>
      ) : (
        // Organization route
        <Route
          //protected pages
          element={
            <ProtectedRoute user={user}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/business/:id" element={<BusinessPage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/ai" element={<ExploreAI />} />
          <Route path="/maps" element={<ExploreMaps />} />
          <Route path="/settings" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Route>
      )}
      <Route path="*" element={<h1>404, page not found</h1>} />
    </Routes>
  );
};

export default Router;
