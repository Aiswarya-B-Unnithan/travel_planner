import axios from "axios";

const API_URL = "https://localhost:8000";

export const API = axios.create({
  baseUrl: API_URL,
  resposeType: "json",
});

export const apiRequest = async ({ url, token, data, method }) => {
  console.log("url", url);
  try {
    const result = await API(url, {
      method: method || "GET",
      data: data,
      Headers: {
        "content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return result?.data;
  } catch (error) {
    const err = error.response.data;
    console.log(err);
  }
};

export const handleFileUpload = async (uploadFile) => {
  console.log("uploadFile",uploadFile)
  const formData = new FormData();
  formData.append("file", uploadFile);
  console.log(formData)
  formData.append("upload_present", "image_present");
  console.log(formData)
  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dyb6rickd/image/upload/",
      formData
    );
    console.log("response",response)
    return response.data.secure_url;
  } catch (error) {
    console.log(error);
  }
};

export const getUserInfo = async (token, id) => {
  try {
    const uri = id === undefined ? "/users/get-user" : "/users/get-user/" + id;

    const res = await apiRequest({
      url: uri,
      token: token,
      method: "POST",
    });

    if (res?.message === "Authentication Failed") {
      localStorage.removeItem("user");
      window.alert("User Session Expired.Login Again");
      window.location.replace("/login");
    }
    return res?.user;
  } catch (error) {
    console.log(error);
  }
};

export const viewUserProfile = async (token, id) => {
  try {
    const res = await apiRequest({
      url: "/users/profile-view/",
      token: token,
      method: "POST",
      data: { id },
    });
  } catch (error) {
    console.log(error);
  }
};
