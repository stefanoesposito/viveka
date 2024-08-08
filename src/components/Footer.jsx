import React from 'react'
import "./Footer.css";

const Footer = () => {
    return (
        <>
        <footer className="footer">
            <div>
                Made with love by <a
                target="_blank"
                className="linkWho"
                href="https://linktr.ee/stefanoesposito75"
                rel="noreferrer"
            >
                Stefano Esposito
            </a>
            </div>
            <p style={{textAlign: 'center'}}><small><em>Questo sito non utilizza cookies</em></small></p>
        </footer>
        </>
    )
}

export default Footer