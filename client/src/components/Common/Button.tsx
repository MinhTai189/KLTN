import { styled, Button } from "@material-ui/core"

interface Props {
    sizeBtn?: 'small' | 'medium' | 'large' | 'xlarge'
    variant?: 'text' | 'outlined' | 'contained'
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
    borderRadius: 25,
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
    borderRadius: 20,
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
        },

        [theme.breakpoints.down('sm')]: {
            fontSize: 11.5,
        }
    },

    [theme.breakpoints.down('sm')]: {
        padding: '4px 8px',
    }
}))

const BtnSmall = styled(Button)(({ theme }) => ({
    background: 'white',
    borderRadius: 15,
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

export const ButtonCustom = ({ sizeBtn = 'medium', variant = 'outlined', ...props }: Props) => {
    let Component = BtnMedium

    if (sizeBtn === 'xlarge')
        Component = BtnXLarge
    if (sizeBtn === 'large')
        Component = BtnLarge
    if (sizeBtn === 'small')
        Component = BtnSmall

    return (
        <Component {...props} variant={variant} />
    )
}
