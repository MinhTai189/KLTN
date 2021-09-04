import { Checkbox, FormControlLabel } from '@material-ui/core'
import { useState } from 'react'

interface Props {
    label: string;
    setValue: (value: boolean) => void
}

export function CheckboxField({ label, setValue, ...props }: Props) {
    const [checked, setChecked] = useState(false)

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked)
        setValue(e.target.checked)
    }

    return (
        <FormControlLabel
            control={<Checkbox checked={checked} onChange={handleCheckbox} color="primary" name="remember-me" />}
            label="Ghi nhớ đăng nhập"
            {...props}
        />
    )
}
