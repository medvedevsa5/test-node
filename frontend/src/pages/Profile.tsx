import { FC } from 'react';
import { useAppSelector } from '../store/storeHooks';
import InfiniteScroll from '../components/InfiniteScroll';

import "../styles/profile-page.css";

const Profile: FC = () => {
    const email = useAppSelector(state => state.user.user.email);
    return (
        <div className="profile-page">
            <h1 className="profile-page__email">{email}</h1>
            <InfiniteScroll />
        </div>
    )
}

export default Profile;