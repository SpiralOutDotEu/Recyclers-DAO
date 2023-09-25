import React from "react";
import Navbar from "./Navbar";
import BetaBanner from "./BetaBanner";
import ErrorBanner from './ErrorBanner';

const Header = () => {
    return (
        <div>
            {/* Main header (navbar) */}
            <BetaBanner />
            <Navbar />
            <ErrorBanner />
        </div>
    );
};
export default Header;