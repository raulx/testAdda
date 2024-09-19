import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AppDispatch,
  useLazyGetUserQuery,
  logOutUser,
  setUser,
  useRefreshLoginMutation,
  logInUser,
} from "./store/store";
import { isFetchBaseQueryError } from "./utils/helpers";
import { ApiResponseType, UserData } from "./utils/types";
import { RootState } from "./store/store";
import RingLoader from "./components/RingLoader";

function App() {
  const { isLoggedIn } = useSelector((state: RootState) => {
    return state.auth.data;
  });
  const refreshAvailable = localStorage.getItem("refresh");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [fetchUserData, { isLoading }] = useLazyGetUserQuery();
  const [refreshLogin] = useRefreshLoginMutation();

  // load the user if user session is active
  useEffect(() => {
    if (isLoggedIn) {
      const getUser = async () => {
        try {
          const res = await fetchUserData(null);
          // for server side errors
          if (res.error && isFetchBaseQueryError(res.error)) {
            dispatch(logOutUser());
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
    }
  }, [isLoggedIn, fetchUserData, dispatch]);

  // if access token expired then refresh the access token
  useEffect(() => {
    if (refreshAvailable) {
      const refreshAccessToken = async () => {
        const res = await refreshLogin(null);
        if (res.error && isFetchBaseQueryError(res.error)) {
          localStorage.removeItem("refresh"); // remove refresh item
          const serverError = res.error.data as ApiResponseType<UserData>;
          toast.error(`Error : ${serverError.message}`, {
            autoClose: 3000,
            hideProgressBar: true,
          });
          navigate("/login");
        }

        // for client side errors
        if (res.error && !isFetchBaseQueryError(res.error)) {
          return toast.error("Error : Client side Error !");
        }
        if (res.data?.statusCode === 200) {
          dispatch(logInUser(res.data?.data._id));
        }
      };
      refreshAccessToken();
    }
  }, [refreshAvailable, navigate, dispatch, refreshLogin]);

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
