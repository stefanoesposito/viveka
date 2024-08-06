import { useEffect, useState, useRef } from "react";
import vivekaData from "./data/viveka.json";
import Sutra from "./components/Sutra";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { Input, Button } from "@mui/material";
import { BiRefresh } from "react-icons/bi";
import Footer from "./components/Footer";

function App() {
    const [sutras, setSutras] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResultsCount, setSearchResultsCount] = useState(0);
    const [showNavBar, setShowNavBar] = useState(true);
    const [lastScrollTop, setLastScrollTop] = useState(0);

    const searchInputRef = useRef(null);

    const getData = async () => {
        await setSutras(vivekaData);
    };

    const saveScrollPosition = () => {
        const currentPosition = window.scrollY;
        localStorage.setItem("scrollPosition", currentPosition);
    };

    const restoreScrollPosition = () => {
        const savedPosition = localStorage.getItem("scrollPosition");
        if (savedPosition) {
            window.scrollTo({
                top: savedPosition,
                behavior: "smooth",
            });
        }
    };

    const searchReset = () => {
        setSearch("");
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const handleScroll = () => {
        const currentScrollTop = window.scrollY;
        const direction = currentScrollTop > lastScrollTop ? "down" : "up";
        if (direction === "down") {
            setTimeout(() => {
                setShowNavBar(false);
            }, 250);
        } else if (
            direction === "down" &&
            searchResultsCount > 0 &&
            searchResultsCount < 580
        ) {
            setShowNavBar(true);
        } else {
            setTimeout(() => {
                setShowNavBar(true);
            }, 200);
        }
        setLastScrollTop(currentScrollTop);
        saveScrollPosition();
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollTop]);

    const goToText = (number) => {
        setSearch("");
        const sutraElement = document.getElementById(`sutra-${number}`);
        if (sutraElement) {
            setTimeout(() => {
                sutraElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "nearest",
                    offset: { top: -300 },
                });
            }, 100);
        }
    };

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        restoreScrollPosition();
    }, [sutras, search]);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        setSearchResultsCount(
            sutras.filter((sutra) => {
                const normalizedSutra = sutra.sutra
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");
                const normalizedSearch = search
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");
                if (normalizedSearch === "") {
                    return true;
                } else return !!(normalizedSutra
                        .toLowerCase()
                        .includes(normalizedSearch.toLowerCase()) ||
                    sutra.number.includes(normalizedSearch.toLowerCase()));
            }).length
        );
    }, [sutras, search]);

    return (
        <>
            <div className="appContainer">
                <div className={"container"}>
                    {showNavBar && (
                        <nav className="navbar">
                            <div className="wrapper">
                                <h1 className={"title"} onClick={handleClick}>Vivekacudamani</h1>
                                <div className="searchWrapper">
                                    <div className={"search"}>
                                        <Input
                                            type="text"
                                            placeholder="Cerca nei sutra..."
                                            onChange={(e) => {
                                                setSearch(e.target.value);
                                            }}
                                            value={search}
                                            ref={searchInputRef}
                                            className={"searchInput"}
                                            autoFocus
                                        />
                                        <Button onClick={searchReset}>
                                            <BiRefresh />
                                        </Button>
                                    </div>
                                    {searchResultsCount > 1 && searchResultsCount < 580 ? (
                                        <p className={"foundText"}>
                                            Trovati <b>{searchResultsCount}</b> risultati
                                        </p>
                                    ) : searchResultsCount === 1 ? (
                                        <p className={"foundText"}>
                                            Trovato <b>{searchResultsCount}</b> risultato
                                        </p>
                                    ) : searchResultsCount === 0 ? (
                                        <p className={"foundText"}>
                                            <b>Zero</b> risultati, riprova
                                        </p>
                                    ) : null}
                                    {searchResultsCount !== 0 && searchResultsCount !== 580 && (
                                        <small className={"greyText"}>
                                            <i>Clicca su un sutra per raggiungerlo</i>
                                        </small>
                                    )}
                                </div>
                            </div>
                        </nav>
                    )}

                    {sutras
                        .filter((sutra) => {
                            const normalizedSutra = sutra.sutra
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "");
                            const normalizedSearch = search
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "");
                            if (normalizedSearch === "") {
                                return true;
                            } else return !!(normalizedSutra
                                    .toLowerCase()
                                    .includes(normalizedSearch.toLowerCase()) ||
                                sutra.number.includes(normalizedSearch.toLowerCase()));
                        })
                        .map((sutra) => {
                            return (
                                <Sutra
                                    key={sutra.number}
                                    number={sutra.number}
                                    text={sutra.sutra}
                                    onClick={() => goToText(sutra.number)}
                                />
                            );
                        })}
                </div>
                <Footer />
            </div>
            <ScrollToTopButton bookmark={saveScrollPosition} />
        </>
    );
}

export default App;
