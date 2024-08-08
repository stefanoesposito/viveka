import { useEffect, useState, useRef } from "react";
import vivekaData from "./data/viveka.json";
import Sutra from "./components/Sutra";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { Input, Button } from "@mui/material";
import { BiRefresh } from "react-icons/bi";
import Footer from "./components/Footer";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';

function App() {
    const [sutras, setSutras] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResultsCount, setSearchResultsCount] = useState(0);
    const [showNavBar, setShowNavBar] = useState(true);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [expanded, setExpanded] = useState(false);

    const handleAccordionToggle = (event, isExpanded) => {
        setExpanded(isExpanded);
    };

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
                                            <i>Cliccare sul n° del sutra interessato</i>
                                        </small>
                                    )}
                                </div>
                            </div>
                        </nav>
                    )}

                    <Accordion expanded={expanded} onChange={handleAccordionToggle} style={{backgroundColor: '#fafafa', marginBottom: 30}}>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Typography>{expanded ? 'Introduzione' : 'Leggi l\'introduzione'}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <p>Il <em>Vivekacūḍāmaṇi</em> (letteralmente il "Gran Gioiello della Discriminazione") è un'opera letteraria attribuita al grande Maestro Samkara, uno dei principali esponenti dell'Advaita Vedanta, la Scuola della non-dualità. Si tratta di uno dei più popolari manuali di insegnamento, uno dei testi di "sostentamento spirituale" della tradizione Advaita Vedanta. Non si tratta di un testo semplicemente "filosofico o polemico": è principalmente una <strong>pratica istruzione</strong>, un aiuto concreto al viaggio spirituale di un Advaitin verso la liberazione (<em>Moksha</em>), non quindi un testo di "filosofia per amore della filosofia".</p>

                                <p>Il testo consiste di 580 versi (<em>sūtra</em>) ed è narrato sotto forma di <em>satsang</em> (dialogo tra maestro e discepolo) in cui si susseguono tematiche relative a religione, spiritualità, metafisica, filosofia, con lo scopo di aiutare l'individuo a liberarsi dall'illusione attraverso l'uso della discriminazione (<em>Viveka</em>).</p>

                                <p>Per Samkara è esclusivamente questa <em>Viveka</em>, il discernimento, e conseguentemente il <em>Vairagya</em> (il distacco) a portare all'integrale soluzione dei coaguli energetici che velano l'identità col <em>Brahman</em> e quindi alla Libeazione (Moksha).</p>

                                <p>Tutte le altre pratiche religiose come la <em>bhakti</em> (la devozione nei confronti della divinità), o l'attività sacrificale e le restanti pratiche cultuali e morali, non consentono il raggiungimento del fine ultimo, ma solo l'ottenimento di rinascite favorevoli.</p>

                                <p>Nel trattato, celebrato per secoli come un lucido trattato introduttivo all'Advaita Vedanta, i concetti sono presentati in modo penetrante, incisivo e chiaro, e comprendono una serie di soggetti che vanno dalla preparazione di sé, all'imparare a discernere il reale dal non-reale, al controllare la propria personalità al fine di liberarsi, alla finale realizzazione dell'Essere-senza-secondo.</p>

                                <p>Nel Dialogo vengono inotre dettagliatamente descritti i cinque "involucri" (detti <em>Kosha</em>) o "guaine" che velano la conoscenza dell'Ātman: </p>

                                <ol>
                                    <li>l'involucro fatto di cibo (corpo grossolano)</li>
                                    <li>l'involucro fatto di energia vitale (parte del corpo sottile)</li>
                                    <li>l'involucro fatto di mente (parte del corpo sottile)</li>
                                    <li>l'involucro fatto di intelletto (parte del corpo sottile)</li>
                                    <li>l'involucro fatto di beatitudine (<em>ananda</em>) (corpo causale o spirituale)</li>
                                </ol>

                                <p>Mentre il dalogo si snoda, la coscienza del Discepolo è riaccordata, ed "intonata" sulla nota fondamentale dell'Essere-Brahman, fino a trasfigurarsi completamente e realizzare la propria identità senza-secondo.</p>

                                <p>Al sutra 483 il Discepolo esclama:</p>
                                <p><em>"Dove se n’è andato l’universo? Chi l’ha fatto svanire? L’ho appena scorto ed ecco che esso è già sparito. O meraviglia di un miraggio!"</em></p>
                                <p>e più avanti nel testo (sutra 496) realizza:</p>
                                <p><em>"Sono l’oceano dell’illimitata beatitudine ed è in me che le onde senza fine dell’universo si formano e si dissolvono nel gioco capriccioso della māyā."</em></p>
                                <p> e ancora (sutra 513):</p>
                                <p><em>"In verità sono questo Brahman non-duale, sostrato di tutti i fenomeni, che illumina con la sua luce tutto lo spettacolo, che assume molteplici forme, che è onnipresente, eterno, puro, immutabile e assoluto"</em></p>

                                <p>Alla fine di questo dialogo-satsang il discepolo, realizzata la propria identità di <em>Ātman-Brahman</em>, si congeda dal Maestro e le loro strade si dividono, senza attaccamento, senza alcun residuo di sentimentalismo.</p>
                                <p>In realtà non c'è più un "discepolo": realizzato l'Essere-senza-secondo, un nuovo Maestro va per la sua strada, e si offrirà spontaneamente a chi busserà per essere.</p>
                                <div>
                                    <p><small>Il testo è tratto da <strong><em>Vivekacūḍāmaṇi</em>: Il gran gioiello della discriminazione</strong> (a cura di Raphael), Editrice Asram Vidya, Roma, 1981</small></p>
                                </div>
                            </Typography>
                            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <CloseIcon onClick={handleAccordionToggle} fontSize={'small'} style={{ cursor: 'pointer' }}></CloseIcon>
                            </div>
                        </AccordionDetails>
                    </Accordion>
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
