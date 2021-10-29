import { Input, InputNumber } from "antd"

interface Props {
    label: string
    name: string
    placeHolder: string
    type?: string
    min?: number
    max?: number
    step?: number
    rows?: number
}

const { TextArea } = Input

export const InputField = ({ label, name, placeHolder, type = 'text', min, max, step, rows }: Props) => {
    let input = <Input placeholder={placeHolder} name={name} />

    if (type === 'number')
        input = <InputNumber style={{ width: '100%' }} step={step} placeholder={placeHolder} name={name} min={min} max={max} />

    if (type === 'area')
        input = <TextArea name={name} placeholder={placeHolder} rows={rows} />

    return (
        <div style={{ margin: '8px 0' }}>
            <label htmlFor={name}>{label}</label>
            {
                input
            }
        </div>
    )
}
