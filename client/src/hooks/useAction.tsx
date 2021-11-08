import { ReactComponent as Love } from 'assets/images/love.svg'
import { ReactComponent as Kiss } from 'assets/images/kiss.svg'
import { ReactComponent as Haha } from 'assets/images/haha.svg'
import { ReactComponent as Wow } from 'assets/images/wow.svg'
import { ReactComponent as Cry } from 'assets/images/cry.svg'
import { ReactComponent as Angry } from 'assets/images/angry.svg'
import LovePNG from 'assets/images/love.png'
import KissPNG from 'assets/images/kiss.png'
import HahaPNG from 'assets/images/haha.png'
import WowPNG from 'assets/images/wow.png'
import CryPNG from 'assets/images/cry.png'
import AngryPNG from 'assets/images/angry.png'

export const useAction = () => {
    const listAction = [
        { icon: <Love />, label: 'Thích', png: LovePNG },
        { icon: <Kiss />, label: 'Yêu', png: KissPNG },
        { icon: <Haha />, label: 'Haha', png: HahaPNG },
        { icon: <Wow />, label: 'Wow', png: WowPNG },
        { icon: <Cry />, label: 'Khóc', png: CryPNG },
        { icon: <Angry />, label: 'Giận', png: AngryPNG },
    ]

    return listAction
}
