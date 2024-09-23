import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useLocation, Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const { isLoggedIn } = useSelector((store: RootState) => {
    return store.auth.data;
  });
  const location = useLocation();

  if (isLoggedIn) {
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
