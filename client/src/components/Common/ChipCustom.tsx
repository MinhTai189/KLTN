import { Chip, ChipProps } from "@material-ui/core"
import { styled } from "@material-ui/styles"

interface Props extends ChipProps {

}

const ChipStyle = styled(Chip)(({ theme }) => ({
    background: 'var(--background) !important',
    height: 22,

    '& .MuiChip-label': {
        fontSize: '0.8em',
    },

    '&.MuiChip-sizeSmall': {
        height: 18,

        '& .MuiChip-label': {
            fontSize: '0.65em',
        },
    },

    '& .MuiChip-avatar': {
        width: 18,
        height: 18
    },

    '& .MuiChip-avatarSmall': {
        width: 15,
        height: 15
    },
}))

export const ChipCustom = (props: Props) => {
    return (
        <ChipStyle {...props} />
    )
}
