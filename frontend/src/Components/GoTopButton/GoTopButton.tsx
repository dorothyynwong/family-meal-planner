import { useState, useEffect } from "react";
import "./GoTopButton.scss";
import { FaCaretUp } from "react-icons/fa6";
import { Button } from "react-bootstrap";

const GoTopButton: React.FC = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScrollToTopButtonVisiblity = () => {
      setShowButton(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScrollToTopButtonVisiblity);

    return () => {
      window.removeEventListener("scroll", handleScrollToTopButtonVisiblity);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {showButton && (
        <Button className="custom-button goTop__button" onClick={handleScrollToTop}>
          <FaCaretUp />
        </Button>

      )}
    </>
  );
}

export default GoTopButton;