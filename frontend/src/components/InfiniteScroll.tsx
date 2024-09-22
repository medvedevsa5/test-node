import { FC, useEffect, useState } from 'react'
import clsx from 'clsx';
import UserService from '../services/UserService';
import { ILink } from '../models/ILink';

import "../styles/infinite-scroll.css";

interface InfiniteScrollProps {
    className?: string
}

const InfiniteScroll: FC<InfiniteScrollProps> = ({ className }) => {
    const [cursor, setCursor] = useState<number>(0);
    const [links, setLinks] = useState<ILink[]>([]);
    const [fetching, setFetching] = useState(false);
    const [isEnded, setIsEnded] = useState(false);

    useEffect(() => {
        UserService.getLinks(cursor).then(
            (response) => {
                setLinks([...links, ...response.data.links]);
                setIsEnded(response.data.isEnded);
                setCursor(cursor + 1);
            }
        ).finally(() => setFetching(false));
    }, [fetching]);

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)
        return () => document.removeEventListener('scroll', scrollHandler);
    }, []);

    const scrollHandler = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight &&
            !fetching &&
            !isEnded) {
                console.log(fetching, isEnded);
            setFetching(true);
        }
    }

    return (<>
        <ul className={clsx(className, 'infinite-scroll')}>
            {links?.map((link, id) =>
                <li key={id} className='infinite-scroll__element'>
                    <div> Сокращенная: {link.short} </div>
                    <div> Оригинал: {link.full} </div>
                    <div> Кол-во кликов: {link.clickCount} </div>
                </li>
            )}
        </ul>
        {fetching && <div>Загрузка...</div>}
    </>
    );
}

export default InfiniteScroll;