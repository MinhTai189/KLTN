import { styled, Button } from "@material-ui/core"

interface Props {
    [key: string]: any
}

const BtnCustom = styled(Button)(({ theme }) => ({
    borderRadius: 0,

    "& .MuiButton-label": {
        color: '#ffffffde',
        textTransform: 'capitalize'
    }
}))

export const ButtonSubmit = (props: Props) => {
    return (
        <BtnCustom {...props} />
    )
}
