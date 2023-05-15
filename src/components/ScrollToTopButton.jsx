import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import "./ScrollToTopButton.css";

const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 300) {
            setShowButton(true);
        } else {
            setShowButton(false);
        }
    };

    function bookmarkPosition() {
        const bookmark = document.querySelector(".bookmark");
        bookmark.classList.add("active");
        setTimeout(() => {
            bookmark.classList.remove("active");
        }, 2000); // Mostra lo span per 2 secondi (2000 millisecondi)
    }

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <div style={{ position: "relative" }}>
                <button
                    className={`bookmark-button ${showButton ? "show" : ""}`}
                    title={"Metti un segnalibro"}
                    onClick={bookmarkPosition}
                >
                    <BsFillBookmarkPlusFill />
                </button>
                <span className="bookmark"></span>
            </div>
            <br />
            <button
                className={`scroll-to-top-button ${showButton ? "show" : ""}`}
                onClick={handleClick}
            >
                <FaArrowUp />
            </button>
        </>
    );
};

export default ScrollToTopButton;
