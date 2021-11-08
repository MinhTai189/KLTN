import { Box, makeStyles, Theme } from '@material-ui/core'
import { RatingStar } from './RatingStar'
import { Alert } from '@material-ui/lab'
import { ButtonSubmit } from 'components/Common'

interface Props {
    setRateFormValue: (state: number) => void
    setContentFormValue: (state: string) => void
    contentFormValue: string
    rateFormValue: number
    handleRateSubmit: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .ratingStar': {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },

        '& .rows': {
            marginBlock: theme.spacing(2),

            "& .label": {
                fontSize: 15,
                fontWeight: 600,
                display: 'inline-block',
                color: theme.palette.text.primary
            },

            "& .text-area": {
                width: '100%',
                height: 'fit-content',
                padding: theme.spacing(1),
                display: 'grid',
                placeItems: 'center',
                background: '#fff',
                boxShadow: '0 0px 3px 2px #ccc',
                position: 'relative',

                '& textarea': {
                    width: '100%',
                    resize: 'none',
                    outline: 'none',
                    border: 'none',
                    background: 'inherit',
                },

                '& small': {
                    position: 'absolute',
                    bottom: 2,
                    right: 5,
                    fontWeight: 600,
                    color: '#666'
                }
            }
        }
    }
}))

export const RateForm = ({ setRateFormValue, setContentFormValue, contentFormValue, rateFormValue, handleRateSubmit }: Props) => {
    const classes = useStyles()

    return (
        <form className={classes.root}>
            <Alert severity='info'>
                Nếu bạn có thông về nhà trọ, bạn có thể thực hiện đánh giá. Đánh giá của bạn sẽ giúp các sinh viên có thêm thông tin để lựa tham khảo và lựa chọn được một nhà trọ ưng ý.
            </Alert>

            <div className="ratingStar">
                <RatingStar rateFormValue={rateFormValue} setRateFormValue={setRateFormValue} />
            </div>

            <div className="rows">
                <div className="text-area">
                    <textarea
                        value={contentFormValue}
                        onChange={(e) => setContentFormValue(e.target.value)}
                        name="comment"
                        rows={3}
                        placeholder='Hãy nhập một vài đánh giá...'
                        spellCheck='false'
                    />

                    <small style={{ color: contentFormValue.length > 100 ? '#f44336' : 'inherit' }}>{`${contentFormValue.length}/100`}</small>
                </div>
            </div>

            <Box mt={3} style={{ width: '100%', textAlign: 'right' }}>
                <ButtonSubmit onClick={handleRateSubmit} fullWidth variant='contained' color='primary'>Đánh giá</ButtonSubmit>
            </Box>
        </form>
    )
}
