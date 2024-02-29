import { useRouter } from "next/router";
import { useEffect } from "react";


const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token.trim() !== "") {
      router.push("/game");
    } else {
      router.push("/login");
    }
  }, []);
};

export default Index;
