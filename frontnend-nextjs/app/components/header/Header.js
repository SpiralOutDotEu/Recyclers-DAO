import React from "react";
import Navbar from "./Navbar";
import BetaBanner from "./BetaBanner";
const Header = () => {
    return (
        <div>
            {/* Main header (navbar) */}
            <BetaBanner />
            <Navbar />
        </div>
    );
};
export default Header;