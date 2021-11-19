import { makeStyles } from '@material-ui/core'
import { ChipCustom } from 'components/Common'
import { memo } from 'react'
import { getColorChip, styleChips } from 'utils'

interface Props {
    listTag: string[]
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

export const ListTag = memo(({ listTag }: Props) => {
    const classes = useStyles()

    return (
        <ul className={classes.root}>
            {listTag.map((tag, index) => {
                const color = getColorChip()

                if (!tag) return null

                return (
                    <li
                        className="tag"
                        key={index}
                    >
                        <ChipCustom
                            // @ts-ignore
                            style={styleChips[color]}
                            label={tag}
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