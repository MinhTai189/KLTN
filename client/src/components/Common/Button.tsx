import { styled, Button } from "@material-ui/core"

interface Props {
    sizeBtn?: 'small' | 'medium' | 'large' | 'xlarge'
    [key: string]: any
}

const BtnXLarge = styled(Button)(({ theme }) => ({
    background: 'white',
    borderRadius: 0,
    padding: '10px 24px',
    minWidth: 95,
    border: `5px solid ${theme.palette.primary.main}`,

    "& .MuiButton-label": {
        fontSize: 16,
        lineHeight: 1,
        textTransform: 'initial',
        color: theme.palette.primary.main,

        "& a": {
            color: theme.palette.primary.main,
        }
    }
}))

const BtnLarge = styled(Button)(({ theme }) => ({
    background: 'white',
    borderRadius: 0,
    padding: '8px 24px',
    minWidth: 95,
    border: `5px solid ${theme.palette.primary.main}`,

    "& .MuiButton-label": {
        fontSize: 14,
        lineHeight: 1,
        textTransform: 'initial',
        color: theme.palette.primary.main,

        "& a": {
            color: theme.palette.primary.main,
        }
    }
}))

const BtnMedium = styled(Button)(({ theme }) => ({
    background: 'white',
    borderRadius: 0,
    padding: '6px 16px',
    minWidth: 75,
    border: `4px solid ${theme.palette.primary.main}`,

    "& .MuiButton-label": {
        fontSize: 13,
        lineHeight: 1,
        textTransform: 'initial',
        color: theme.palette.primary.main,

        "& a": {
            color: theme.palette.primary.main,
        }
    }
}))

const BtnSmall = styled(Button)(({ theme }) => ({
    background: 'white',
    borderRadius: 0,
    padding: '4px 8px',
    minWidth: 55,
    border: `3px solid ${theme.palette.primary.main}`,

    "& .MuiButton-label": {
        fontSize: 11,
        lineHeight: 1,
        textTransform: 'initial',
        color: theme.palette.primary.main,

        "& a": {
            color: theme.palette.primary.main,
        }
    }
}))

export const ButtonCustom = ({ sizeBtn = 'medium', ...props }: Props) => {
    let Component = BtnMedium

    if (sizeBtn === 'xlarge')
        Component = BtnXLarge
    if (sizeBtn === 'large')
        Component = BtnLarge
    if (sizeBtn === 'small')
        Component = BtnSmall

    return (
        <Component {...props} variant='contained' />
    )
}
