import { useNavigate } from "react-router-dom";
import { useFakeAuth } from "../contexts/FakeAuthContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isAuth } = useFakeAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuth) navigate("/");
    },
    [isAuth, navigate]
  );

  return isAuth ? children : null;
}

export default ProtectedRoute;
