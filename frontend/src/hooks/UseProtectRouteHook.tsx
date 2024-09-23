import { useLocation, Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const auth = localStorage.getItem("auth");
  const location = useLocation();
  if (auth) {
    return <Outlet />;
  } else {
    return (
      <Navigate
        to={"/login"}
        state={{
          from: location,
          message: "You Need to Login or Register First.",
        }}
        replace
      />
    );
  }
};

export default ProtectedRoute;
