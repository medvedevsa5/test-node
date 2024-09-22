import { FC } from "react";
import "../styles/header.css";
import { useAppSelector } from "../store/storeHooks";
import { Link } from "react-router-dom";

import LogoutButton from "./LogoutButton";

const Header: FC = () => {
    const isAuth = useAppSelector((state) => state.user.isAuth);

    return (
        <div className="header">
            <Link className="header__logo" to="/">
                {" "}
                короткие-ссылки.рф{" "}
            </Link>
            {!isAuth ? (
                <Link className="header__profile" to="/login">
                    Войти
                </Link>
            ) : (
                <div className="header__profile">
                    <Link to="/profile">Профиль</Link>
                    <LogoutButton />
                </div>
            )}
        </div>
    );
};

export default Header;
