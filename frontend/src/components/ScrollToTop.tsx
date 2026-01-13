<<<<<<< HEAD
import {useState, useEffect } from "react";

const ScrollToTop=()=>{
=======
import { useState, useEffect } from "react";

const ScrollToTop = () => {
>>>>>>> main

    const [isVisible, setIsVisible] = useState<boolean>(false);


<<<<<<< HEAD
useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
 window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;
  return(

    <button className="fixed bottom-12 left-2 z-10 h-12 w-12 rounded-full bg-gray-800/60 text-white hover:scale-110 transition" onClick={scrollToTop}
>↑</button>
  )
=======
    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };
        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) return null;
    return (

        <button className="fixed bottom-12 left-2 z-10 h-12 w-12 rounded-full bg-gray-800/60 text-white hover:scale-110 transition" onClick={scrollToTop}
        >↑</button>
    )
>>>>>>> main
}

export default ScrollToTop;
