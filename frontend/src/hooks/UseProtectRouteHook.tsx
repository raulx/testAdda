import { useLocation, Outlet, Navigate } from "react-router-dom";

const UseProtectRouteHook = () => {
  const auth = localStorage.getItem("auth");
  const location = useLocation();
  if (auth) {
    return <Outlet />;
  } else {
    return (
      <Navigate
        to={"/"}
        state={{
          from: location,
          message: "You Need to Login or Register First.",
        }}
        replace
      />
    );
  }
};

export default UseProtectRouteHook;
