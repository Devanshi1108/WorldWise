import { createContext, useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const fakeAuthContext = createContext();

function FakeAuthProvider({ children }) {
  //const navigate = useNavigate();
  const initialState = {
    user: null,
    isAuth: false,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, isAuth } = state;

  function reducer(state, action) {
    switch (action.type) {
      case "login":
        return { ...state, user: action.payload, isAuth: true };
      case "logout":
        return { ...state, user: null, isAuth: false };
      default:
        throw new Error("Action not found");
    }
  }

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    }
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <fakeAuthContext.Provider
      value={{
        user,
        isAuth,
        login,
        logout,
      }}
    >
      {children}
    </fakeAuthContext.Provider>
  );
}

function useFakeAuth() {
  const context = useContext(fakeAuthContext);
  if (context === undefined)
    throw new Error("useFake Provider used outside of its scope");
  return context;
}

export { FakeAuthProvider, useFakeAuth };
