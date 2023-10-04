import React from "react";
import Navbar from "./Navbar";
import BetaBanner from "./BetaBanner";
import ErrorBanner from './ErrorBanner';
import DevBanner from "./DevBanner";

const Header = () => {
    return (
        <div>
            {/* Main header (navbar) */}
            <DevBanner />
            <BetaBanner />
            <Navbar />
            {/* <ErrorBanner /> */}
        </div>
    );
};
export default Header;