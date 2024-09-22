import clsx from 'clsx';

import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { loginUser } from '../store/features/userActions';
import { useAppDispatch } from '../store/storeHooks';

import { z } from 'zod';
import { Link } from 'react-router-dom';

import "../styles/login-form.css";

const loginSchema = z.object({
    email: z.string().email("Некорректный email"),
    password: z.string()
        .min(3)
        .max(32)
})


interface LoginFormProps {
    className?: string
}

interface LoginFormFields {
    email: string,
    password: string
}

const LoginForm: FC<LoginFormProps> = (props) => {
    const [formData, setFormData] = useState<LoginFormFields>({} as LoginFormFields);

    const dispatch = useAppDispatch();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            loginSchema.parse(formData);
            await dispatch(loginUser({ ...formData }));
        } catch(error) {
            if(error instanceof z.ZodError){
                console.log(error.errors);
            }
        }

    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setFormData({
            ...formData,
            [e.currentTarget.name]: e.currentTarget.value,
        });
    };

    return (
        <form onSubmit={handleSubmit} className={clsx(props.className, 'login-form')}>
            <h2>Вход</h2>
            <input type="email" name="email" onChange={handleChange} />
            <input type="password" name="password" onChange={handleChange} />
            <button type="submit">Вход</button>
            <Link to="/register">Нет аккаунта?</Link>
            <Link to="/reset">Забыли пароль?</Link>
        </form>
    );
}

export default LoginForm;