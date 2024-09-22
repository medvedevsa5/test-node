import clsx from 'clsx';

import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { redirect, useLocation } from 'react-router-dom';

import { z } from 'zod';

import "../styles/type-password-form.css";
import AuthService from '../services/AuthService';

const registerSchema = z.object({
    password1: z.string()
    .min(3)
    .max(32),

    password2: z.string()
        .min(3)
        .max(32)
});

interface RegisterFormProps {
    className?: string
}

interface RegisterFormFields {
    password1: string,
    password2: string
}

const RegisterForm: FC<RegisterFormProps> = (props) => {
    const [formData, setFormData] = useState<RegisterFormFields>({} as RegisterFormFields);

    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);

    if(!queryParams.has('token') && !queryParams.has('id')){
        redirect('/');
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            registerSchema.parse(formData);
            
            await AuthService.changePassword(queryParams.get('token')!, queryParams.get('id')!, formData.password1);
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
            <h2>Смена пароля</h2>
            <input type="password" name="password1" onChange={handleChange} />
            <input type="password" name="password2" onChange={handleChange} />
            <button type="submit">Сменить пароль</button>
        </form>
    );
}

export default RegisterForm;