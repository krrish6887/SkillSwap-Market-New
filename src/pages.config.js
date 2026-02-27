import Discover from './pages/Discover';
import Connect from './pages/Connect';
import PostSkill from './pages/PostSkill';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Discover": Discover,
    "Connect": Connect,
    "PostSkill": PostSkill,
    "Wallet": Wallet,
    "Profile": Profile,
}

export const pagesConfig = {
    mainPage: "Discover",
    Pages: PAGES,
    Layout: __Layout,
};