import Love from 'assets/images/love.svg'
import Kiss from 'assets/images/kiss.svg'
import Haha from 'assets/images/haha.svg'
import Wow from 'assets/images/wow.svg'
import Cry from 'assets/images/cry.svg'
import Angry from 'assets/images/angry.svg'
import LovePNG from 'assets/images/love.png'
import KissPNG from 'assets/images/kiss.png'
import HahaPNG from 'assets/images/haha.png'
import WowPNG from 'assets/images/wow.png'
import CryPNG from 'assets/images/cry.png'
import AngryPNG from 'assets/images/angry.png'
import { ReactSVG } from 'react-svg'

export const useAction = () => {
    const listAction = [
        { icon: <ReactSVG src={Love} />, label: 'Thích', png: LovePNG, color: '#1ab4be' },
        { icon: <ReactSVG src={Kiss} />, label: 'Yêu', png: KissPNG, color: '#ff164d' },
        { icon: <ReactSVG src={Haha} />, label: 'Haha', png: HahaPNG, color: '#fda928' },
        { icon: <ReactSVG src={Wow} />, label: 'Wow', png: WowPNG, color: '#9c4299' },
        { icon: <ReactSVG src={Cry} />, label: 'Khóc', png: CryPNG, color: '#009f6d' },
        { icon: <ReactSVG src={Angry} />, label: 'Giận', png: AngryPNG, color: '#f33b3d' },
    ]

    return listAction
}
