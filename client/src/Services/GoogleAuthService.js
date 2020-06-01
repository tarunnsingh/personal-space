export default {
  login: ({ profileObj, tokenObj }) => {
    console.log(" << IN GOOGLEAUTHSERVICE >>");
    return fetch("/user/googlelogin", {
      method: "post",
      body: JSON.stringify({ profileObj, tokenObj }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else {
        return {
          isAuthenticated: false,
          user: { username: "", role: "", originalName: "", userIntro: "" },
          message: { msgBody: "Google Login Invalid ", msgError: true },
        };
      }
    });
  },
};
