import "./NavBar.css";
import { IUser } from "../../types/types";
import { Avatar, Link } from "@chakra-ui/react";

interface NavBarProps {
    user: IUser;
    logout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ user, logout }) => {
    
    // TODO icon with link to user profile page
    return (
        <div id="navbar-container" className="navbar-container">
            <Avatar size='sm' name={`${user.username}-avatar`} src={user.profileImage} />
            <Link onClick={(): void => logout()} color={"blue"}>log out</Link>
            <br></br>
            <Link href={`/${user.username}/profile`} color={"blue"}>edit profile </Link>
            <p>logged in as {user.username}</p>
        </div>
    );
};

export default NavBar;