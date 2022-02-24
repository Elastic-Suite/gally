import jwtDecode from "jwt-decode";
import { ENTRYPOINT } from "config/entrypoint";

export default {
  login: ({ username, password }) => {
    const request = new Request(
      `${ENTRYPOINT}/authentication_token`,
      {
        method: "POST",
        body: JSON.stringify({ email: username, password }),
        headers: new Headers({ "Content-Type": "application/json" }),
      }
    );
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ token }) => {
        localStorage.setItem("token", token);
        // @Todo: Ugly fix awaiting the real front of the application.
        // Allows to reload the page after the authentication, to avoid infinite loading message.
        location.reload();
      });
  },
  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },
  checkAuth: () => {
    try {
      // @ts-ignore
      if (!localStorage.getItem("token") || new Date().getTime() / 1000 > jwtDecode(localStorage.getItem("token"))?.exp) {
        return Promise.reject();
      }
      return Promise.resolve();
    } catch (e) {
      // override possible jwtDecode error
      return Promise.reject();
    }
  },
  checkError: (err) => {
    if ([401, 403].includes(err?.status || err?.response?.status)) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: () => Promise.resolve(),
};
