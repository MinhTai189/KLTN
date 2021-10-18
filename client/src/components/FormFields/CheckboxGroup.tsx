import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@material-ui/core'
import { FieldOption } from 'models'
import { ChangeEvent, useState } from 'react'
import { Control, useController } from 'react-hook-form'

interface Props {
    label: string;
    options: Array<FieldOption>;
    initialState: any;
    control: Control<any>;
    name: string;
    size?: 'small' | 'medium'
}

const arrayTrueValue = (data: object) => {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const result: string[] = []

    values.forEach((value, index) => {
        if (value) {
            result.push(keys[index])
        }
    })

    return result
}

export const CheckboxGroup = ({ label, options, initialState, control, name, size = 'medium' }: Props) => {
    const [checkedList, setCheckedList] = useState<any>(initialState)
    const { field: { onChange } } = useController({
        name,
        control
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckedList((prev: typeof initialState) => {
            const data = { ...prev, [e.target.name]: e.target.checked }
            const arrayData = arrayTrueValue(data)

            onChange(arrayData)

            return data
        })
    }

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">{label}</FormLabel>
            <FormGroup>
                {options.map((option, index) => (
                    <FormControlLabel
                        key={index}
                        control={<Checkbox checked={checkedList[option.value]} size={size} onChange={handleChange} name={option.value} />}
                        label={option.label}
                    />
                ))}
            </FormGroup>
        </FormControl>
    )
}
