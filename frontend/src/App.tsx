import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AppDispatch,
  useLazyGetUserQuery,
  setUser,
  useRefreshLoginMutation,
  logInUser,
} from "./store/store";
import { isFetchBaseQueryError } from "./utils/helpers";

import RingLoader from "./components/RingLoader";

function App() {
  const isLoggedIn = localStorage.getItem("auth");
  const refreshAvailable = localStorage.getItem("refresh");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [fetchUserData, { isLoading }] = useLazyGetUserQuery();
  const [refreshLogin] = useRefreshLoginMutation();

  useEffect(() => {
    // load the user if user session is active and accessToken is available
    if (isLoggedIn) {
      const getUser = async () => {
        try {
          const res = await fetchUserData(null);
          // for server side errors
          if (res.error && isFetchBaseQueryError(res.error)) {
            localStorage.removeItem("auth");
          }

          // for client side errors
          if (res.error && !isFetchBaseQueryError(res.error)) {
            return toast.error("Error : Client side Error !");
          }
          if (res.data?.statusCode === 200) dispatch(setUser(res.data?.data));
        } catch (err) {
          console.error(`Error Occured : ${err}`);
        }
      };
      getUser();
    } else if (refreshAvailable) {
      // if user is loggesOut but refresh  token is available then login user automatically
      const refreshAccessToken = async () => {
        const res = await refreshLogin(null);
        if (res.error && isFetchBaseQueryError(res.error)) {
          localStorage.removeItem("refresh"); // remove refresh item
          // const serverError = res.error.data as ApiResponseType<UserData>;
          toast.error(`Session Expired !`, {
            autoClose: 3000,
            hideProgressBar: true,
          });
          navigate("/login");
        }

        // for client side errors
        if (res.error && !isFetchBaseQueryError(res.error)) {
          return toast.error("Error : Client side Error !");
        }
        // on sucess
        if (res.data?.statusCode === 200) {
          dispatch(logInUser(res.data?.data._id));
        }
      };
      refreshAccessToken();
    }
  }, [
    isLoggedIn,
    fetchUserData,
    dispatch,
    refreshAvailable,
    refreshLogin,
    navigate,
  ]);

  return (
    <>
      {isLoading ? (
        <>
          <RingLoader />
        </>
      ) : (
        <>
          <Outlet />
          <ToastContainer />
        </>
      )}
    </>
  );
}

export default App;
