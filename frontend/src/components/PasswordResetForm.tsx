import clsx from 'clsx';

import { ChangeEvent, FC, FormEvent, useState } from 'react';

import { z } from 'zod';

import "../styles/resetpd-form.css";
import AuthService from '../services/AuthService';

const passwordResetSchema = z.object({
    email: z.string().email("Некорректный email"),
})

interface PdResetFormProps {
    className?: string
}

interface PdResetFormFields {
    email: string,
}

const PdResetForm: FC<PdResetFormProps> = (props) => {
    const [formData, setFormData] = useState<PdResetFormFields>({} as PdResetFormFields);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            passwordResetSchema.parse(formData);
            await AuthService.requestChangePassword(formData.email);
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
        <form onSubmit={handleSubmit} className={clsx(props.className, 'resetpd-form')}>
            <h2>Сброс пароля</h2>
            <input type="email" name="email" onChange={handleChange} />
            <button type="submit">Сбросить пароль</button>
        </form>
    );
}

export default PdResetForm;