"use client";
import React,{useEffect,useState} from "react";
import LanguageSwitch from "./languageswitcher.jsx";

function Nav() {
    const logo="https://2022-pha5e-website-prod.s3.eu-west-3.amazonaws.com/assets/logo.svg";
    
    return(
        <div className="flex items-center justify-start pt-0 pl-4">
            <div className="flex-shrink-0 cursor-pointer">
                <a>
                    <img src={logo} alt="Logo" className="h-12 w-24" />
                </a>
            </div>
            <div className="absolute top-0 right-0 pr-8 pt-4 cursor-pointer">
                <ul className="flex space-x-12 text-white text-md">
                    <li><a><span>Our vision</span></a></li>
                    <li><a><span>Our team</span></a></li>
                    <li><a><span>Our project</span></a></li>
                    <li><a><span>Contact us</span></a></li>
                    <li ><LanguageSwitch></LanguageSwitch></li>
                </ul>
            </div>
        </div>
    );
}

export default Nav;