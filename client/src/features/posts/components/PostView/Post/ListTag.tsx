import { makeStyles } from '@material-ui/core'
import { ChipCustom } from 'components/Common'
import { memo } from 'react'
import { getColorChip, styleChips } from 'utils'

interface Props {

}

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexWrap: 'wrap',

        '& .tag:not(:last-child)': {
            marginRight: 8
        }
    }
})

export const ListTag = memo((props: Props) => {
    const classes = useStyles()

    return (
        <ul className={classes.root}>
            {new Array(7).fill(1).map((_, index) => {
                const color = getColorChip()

                return (
                    <li
                        className="tag"
                        key={index}
                    >
                        <ChipCustom
                            // @ts-ignore
                            style={styleChips[color]}
                            label='#sachse'
                            size='medium'
                            color='primary'
                        />
                    </li>
                )
            })}
        </ul>
    )
}
)