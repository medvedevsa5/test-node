import clsx from 'clsx';

import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { registerUser } from '../store/features/userActions';
import { useAppDispatch } from '../store/storeHooks';

import { Link } from 'react-router-dom';

import { z } from 'zod';

import "../styles/register-form.css";

const registerSchema = z.object({
    email: z.string().email("Некорректный email"),
    password: z.string()
        .min(3)
        .max(32)
});

interface RegisterFormProps {
    className?: string
}

interface RegisterFormFields {
    email: string,
    password: string
}

const RegisterForm: FC<RegisterFormProps> = (props) => {
    const [formData, setFormData] = useState<RegisterFormFields>({} as RegisterFormFields);

    const dispatch = useAppDispatch();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            registerSchema.parse(formData);
            await dispatch(registerUser({ ...formData }));
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
        <form onSubmit={handleSubmit} className={clsx(props.className, 'register-form')}>
            <h2>Регистрация</h2>
            <input type="email" name="email" onChange={handleChange} />
            <input type="password" name="password" onChange={handleChange} />
            <button type="submit">Регистрация</button>
            <Link to="/login">Уже есть аккаунт?</Link>
        </form>
    );
}

export default RegisterForm;