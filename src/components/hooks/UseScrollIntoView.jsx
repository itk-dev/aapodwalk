import { useEffect, useState } from "react";

export const useScrollToLocation = (scroll, idOfElement) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!hasScrolled && scroll) {
      const elementToScrollTo = document.getElementById(idOfElement);
      if (elementToScrollTo) {
        elementToScrollTo.scrollIntoView({ behavior: "smooth" });
        setHasScrolled(true);
      }
    }
  }, [hasScrolled]);
};

export default {};
