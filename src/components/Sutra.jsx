import React from "react";

const Sutra = ({ number, text, onClick }) => {
    const handleClick = () => {
        onClick(number);
    };

    return (
        <div className={"sutra"} id={`sutra-${number}`}>
            <p className={"number"} onClick={handleClick}>
                <strong>{number}</strong>.{" "}
            </p>
            <p dangerouslySetInnerHTML={{ __html: text }} />
        </div>
    );
};

export default Sutra;
