import { Box, makeStyles, Paper, Theme, Divider } from "@material-ui/core";
import { Typography } from "antd";
import { ButtonCustom } from "components/Common";
import { ChangeEvent, useState } from "react";
import { PriceSlider } from "./Filter/PriceSlider";
import { RateSelector } from "./Filter/RateSelector";
import { StatusCheckbox } from "./Filter/StatusCheckbox";
import { Utilities } from './Filter/Utilities'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { motelActions, selectFilterMotel } from 'features/motels/motelSlice'

interface Props {

}

interface IFilter {
    priceRange: number[],
    status: [boolean, boolean],
    rate: number,
    utilities: string[]
}



const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
        position: 'sticky',
        top: 60,

        '& .btn-wrapper': {
            display: 'flex',
            justifyContent: 'flex-end',

            '& .btn-refresh, & .btn-apply': {
                marginRight: theme.spacing(2),
                borderWidth: 1,
                borderRadius: 3,
                borderColor: '#ff4d4f',
                padding: theme.spacing(0.8, 1.5),

                '& .MuiButton-label': {
                    fontWeight: 400,
                    color: '#ff4d4f'
                }
            },

            '& .btn-apply': {
                margin: 0,
                border: 'none',
                background: theme.palette.primary.main,

                '& .MuiButton-label': {
                    color: '#fff !important'
                }
            },
        }
    },
    rows: {
        marginBottom: theme.spacing(3),

        '& .label': {
            fontWeight: 600,
            fontSize: '1em',
        },

        '& .seletors': {
            width: '95%',
            margin: 'auto',
        },
    },
}))

export const FilterSider = (props: Props) => {
    const classes = useStyles()
    const dispatch = useAppDispatch()
    const filterMotel = useAppSelector(selectFilterMotel)

    const [filter, setFilter] = useState<IFilter>({
        priceRange: [0, 20000000],
        status: [true, true],
        rate: 0,
        utilities: []
    })

    const handleChangePrice = (event: any, newValue: number | number[]) => {
        setFilter(prev => ({ ...prev, priceRange: (newValue as number[]) }));
    };

    const handleChangeStatus = (e: ChangeEvent<HTMLInputElement>) => {
        setFilter(prev => {
            const status = prev.status

            if (e.target.name === 'available')
                status[0] = e.target.checked
            else
                status[1] = e.target.checked

            return { ...prev, status }
        })
    }

    const handleSelectRate = (value: number) => {
        setFilter(prev => ({ ...prev, rate: prev.rate === value ? 0 : value }))
    }

    const handleSelectUtilities = (utility: string) => {
        setFilter(prev => {
            let utilities = prev.utilities;

            if (utilities.includes(utility))
                utilities = utilities.filter(util => util !== utility)
            else
                utilities = [...utilities, utility]

            return { ...prev, utilities }
        })
    }

    const handleResetFilter = () => {
        setFilter({
            priceRange: [0, 20000000],
            status: [true, true],
            rate: 0,
            utilities: []
        })
    }

    const handleFilterMotel = () => {
        let newFilter = {
            _price: filter.priceRange.join(','),
            _status: filter.status.join(','),
            _rate: filter.rate,
            __optional: filter.utilities.join(',')
        };

        dispatch(motelActions.setFilter({ ...filterMotel, ...newFilter }))
    }

    return (
        <Paper className={classes.root} component='aside'>
            <Box className={classes.rows}>
                <Typography className="label">
                    Giá thuê/tháng
                </Typography>

                <Box className='seletors'>
                    <PriceSlider
                        priceRange={filter.priceRange}
                        handleChangePrice={handleChangePrice}
                    />
                </Box>
            </Box>

            <Box className={classes.rows}>
                <Typography className="label">
                    Trạng thái
                </Typography>

                <Box className='seletors'>
                    <StatusCheckbox
                        filter={filter}
                        handleChangeStatus={handleChangeStatus}
                    />
                </Box>
            </Box>

            <Box className={classes.rows}>
                <Typography className="label">
                    Đánh giá
                </Typography>

                <Box className='seletors'>
                    <RateSelector
                        stars={filter.rate}
                        handleSelectRate={handleSelectRate}
                    />
                </Box>
            </Box>

            <Box className={classes.rows}>
                <Typography className="label">
                    Tiện ích
                </Typography>

                <Box className='seletors'>
                    <Utilities
                        utilities={filter.utilities}
                        handleSelectUtilities={handleSelectUtilities}
                    />
                </Box>
            </Box>

            <Divider style={{ marginTop: 48 }} />

            <Box className='btn-wrapper' mt={2}>
                <ButtonCustom
                    className='btn-refresh'
                    sizeBtn='small'
                    onClick={handleResetFilter}
                >
                    Thiết lập lại
                </ButtonCustom>

                <ButtonCustom
                    className='btn-apply'
                    sizeBtn='small'
                    onClick={handleFilterMotel}
                >
                    Áp dụng
                </ButtonCustom>
            </Box>
        </Paper>
    )
}
