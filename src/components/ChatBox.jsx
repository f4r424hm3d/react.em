import { useEffect } from "react";

const ChatWidget = () => {
  useEffect(() => {
    var s1 = document.createElement("script");
    s1.async = true;
    s1.src = "https://embed.tawk.to/689eb9de12063c1922f5201f/1j2m0c3qc";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    document.body.appendChild(s1);
  }, []);

  return null; // ye component sirf script inject karega, UI me kuch render nahi hoga
};

export default ChatWidget;
