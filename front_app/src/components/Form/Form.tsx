import React from "react";

interface FormProps {
    fields:
        {
            field_type: string,
            type: string,
            value?: string,
            placeholder?: string,
            required?: boolean,
            onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void,
            options?: [
                {
                    value: string,
                    label: string,
                }
            ]
        }[],
    buttonLabel: string,
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
}

const Form = ({fields, buttonLabel, onSubmit}: FormProps) => {
    return (
        <form onSubmit={onSubmit}>
            {fields.map((field, index) => {
                if (field.field_type === 'input') {
                    return (
                        <input
                            key={index}
                            type={field.type}
                            placeholder={field.placeholder || ''}
                            value={field.value || ''}
                            required={field.required || false}
                            onChange={field.onChange || (() => {
                            })}
                        />
                    );
                } else if (field.field_type === 'textarea') {
                    return (
                        <textarea
                            key={index}
                            placeholder={field.placeholder}
                            value={field.value}
                            required={field.required}
                            onChange={field.onChange || (() => {
                            })}
                        />
                    );
                } else if (field.field_type === 'select') {
                    return (
                        <select
                            key={index}
                            value={field.value}
                            required={field.required}
                            onChange={field.onChange || (() => {
                            })}
                        >
                            {field.options && field.options.map((option, index) => (
                                <option key={index} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    );
                }
            })}

            <button type="submit">{buttonLabel}</button>
        </form>
    );
}

export default Form;