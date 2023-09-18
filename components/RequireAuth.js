import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Loading from "./Loading";

function RequireAuth({ children }) {
  const { token } = useSelector((state) => state.account);
  const router = useRouter();
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [router, token]);
  return (
    <>
      {!token ? <Loading></Loading> : children}
    </>
  );
}

export default RequireAuth;
