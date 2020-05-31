export default {
  updateIntro: (introData) => {
    console.log("HREE", JSON.stringify(introData));
    return fetch(`/user/updateIntro`, {
      method: "post",
      body: JSON.stringify(introData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status !== 401) {
        return response.json().then((data) => data);
      } else {
        return {
          isAuthenticated: false,
          user: { username: "", role: "" },
          message: { msgBody: "Invalid Credentials", msgError: true },
        };
      }
    });
  },
};
