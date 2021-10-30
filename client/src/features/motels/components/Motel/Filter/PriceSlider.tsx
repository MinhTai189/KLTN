import { Box, Slider, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { mapPriceMonth } from "utils/getPriceMotel";

interface Props {
    priceRange: number[]
    handleChangePrice: (event: any, newValue: number | number[]) => void
}

const useStyles = makeStyles({
    root: {
        '& .priceRange': {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',

            '& .text': {
                fontSize: '0.7em',
                fontWeight: 500
            }
        },
        '& .MuiSlider-root': {
            paddingBottom: 5,
        },
    },
})

const valuetext = (value: number) => {
    if (value === 0) return '0'

    return mapPriceMonth(value);
}

export const PriceSlider = ({ priceRange, handleChangePrice }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Slider
                value={priceRange}
                min={0}
                max={20000000}
                step={100000}
                onChange={handleChangePrice}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                valueLabelFormat={valuetext}
                color='secondary'
            />

            <div className="priceRange">
                <Typography className='text'>
                    {`${priceRange[0] !== 0 ? mapPriceMonth(priceRange[0]) : '0'}/tháng`}
                </Typography>

                <Typography className='text'>
                    {`${mapPriceMonth(priceRange[1])}/tháng`}
                </Typography>
            </div>
        </Box>
    )
}
