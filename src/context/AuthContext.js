import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  let [loading, setLoading] = useState(true);
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [isError, setIsError] = useState(false);
  let [message, setMessage] = useState("");
  let loginUser = async (e) => {
    e.preventDefault();
    // let response = await fetch("http://127.0.0.1:8000/api/token/", {
    //   method: "POST",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     email: e.target.email.value,
    //     password: e.target.password.value,
    //   }),
    // });
    let response = await axios.post("api/token/", {
      email: e.target.email.value,
      password: e.target.password.value,
    });
    console.log(response);
    let data = response.data;
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("profile");
    } else {
      setIsError(true);
      setMessage(data.detail);
    }
  };

  let updateToken = async () => {
    // let response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
    //   method: "POST",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     refresh: authTokens.refresh,
    //   }),
    // });
    let response = await axios.post("api/token/refresh/", {
      refresh: authTokens.refresh,
    });
    let data = response.data;
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logout();
    }
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/");
  };

  useEffect(() => {
    const fourMinutes = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  let contextData = {
    detail: {
      error: isError,
      message: message,
    },
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logout: logout,
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
