"use client";
import React, { useState } from "react";

function LanguageSwitch() {
    const [activeLanguage, setActiveLanguage] = useState("EN");

    const toggleLanguage = () => {
        setActiveLanguage((prevLanguage) => (prevLanguage === "EN" ? "FR" : "EN"));
    };

    return (
        <div>
            <button  onClick={toggleLanguage} className="flex items-center space-x-0 cursor-pointer">
                <span className={activeLanguage === "FR" ? "underline" : ""}>FR</span>
                <span>/</span>
                <span className={activeLanguage === "EN" ? "underline" : ""}>EN</span>
            </button>
        </div>
    );
}

export default LanguageSwitch;