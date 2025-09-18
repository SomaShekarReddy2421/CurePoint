import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();
const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [doctors, setDoctors] = useState([]);
  const [userData, setUserData] = useState(false);
  const [loading, setLoading] = useState(true);

  const getDoctorsData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      console.log(data.doctors);
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        console.log("Something went Wrong in App Context");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });
      if (data?.success) {
        setUserData(data.user);
      } else {
        console.log("Error Occurred");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
  }, [token]);

  const value = {
    doctors,
    currencySymbol,
    setDoctors,
    getDoctorsData,
    token,
    setToken,
    backendUrl,
    setUserData,
    userData,
    loadUserProfileData,
    loading,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppContextProvider;
