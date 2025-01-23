import { NavLink } from "react-router-dom";
import LOGO from "./logo.png";

const Logo = () => {
  return (
    <aside>
      <figure>
        {/* <a href="#">
          <img src={LOGO} alt="Logo" className="h-[70px]" />
        </a> */}
        {/* <NavLink to="/">
          <img src={LOGO} alt="Logo" className="h-[70px]" />
        </NavLink> */}
        <span>
          <a href="#" className="text-[#eb6378]  font-bold text-2xl">
            QSP Music
          </a>
        </span>
      </figure>
    </aside>
  );
};

export default Logo;
