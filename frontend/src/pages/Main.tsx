import { ChangeEvent, FormEvent, useState } from 'react';

import "../styles/main-page.css";
import { useAppSelector } from '../store/storeHooks';

import { z } from 'zod';
import UserService from '../services/UserService';

const urlSchema = z.string().url().refine((url) => {
    const { protocol, hostname } = new URL(url);
    return hostname === 'localhost' ||  protocol === 'http:' || protocol === 'https:';
  }, {
    message: 'Url должен начинаться  с http или https.',
  });

const Main = () => {
    const [formData, setFormData] = useState<string>('');

    const submitHandler = async (e: FormEvent ) => {
        try {
            e.preventDefault();
            urlSchema.parse(formData);
            //@ts-expect-error ...
            if(e.nativeEvent.submitter.name === 'short'){
                const result = await UserService.getShortened(formData);
                if(result){
                    setFormData(result.data.link.short);
                }
            } else {
                const result = await UserService.getFull(formData);
                if(result) {
                    setFormData(result.data);
                }
            }
            
        } catch (e) {
            console.log(e);
        }

    };

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setFormData(e.currentTarget.value);
    }

    const isAuth = useAppSelector(state => state.user.isAuth);

    return (
        <div className="main-page">
            {!isAuth ? <div className='main-page__message'> Для использования сервиса вам необходимо войти в систему </div> :
            <form onSubmit={submitHandler} className="main-page__form">
                <input className="main-page__input" placeholder='https://example.com' type="url" value={formData} onChange={changeHandler} />
                <button name="short" type="submit" className="main-page__button">Сократить</button>
                <button name="full" type="submit" className="main-page__button">Раскрыть</button>
            </form>}
        </div>
    )
}

export default Main;