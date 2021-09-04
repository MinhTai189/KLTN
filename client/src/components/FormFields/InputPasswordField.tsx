import { FormHelperText } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { VisibilityOff } from '@material-ui/icons';
import Visibility from '@material-ui/icons/Visibility';
import React, { InputHTMLAttributes, useState } from 'react';
import { Control, useController } from 'react-hook-form';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    labelWidth: number;
    name: string;
    control: Control<any>
}

export const InputPasswordField = ({ label, labelWidth, name, control, ...props }: Props) => {
    const [showPassword, setShowPassword] = useState<Boolean>(false);
    const { field: { value, onBlur, onChange, ref }, fieldState: { invalid, error } } = useController({
        name,
        control
    })

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <FormControl variant="outlined" fullWidth margin='normal'>
            <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
            <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                inputRef={ref}
                error={invalid}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                }
                labelWidth={labelWidth}
                inputProps={props}
            />
            <FormHelperText style={{ color: '#f44336' }} id="component-error-text">{error?.message}</FormHelperText>
        </FormControl>
    )
}

