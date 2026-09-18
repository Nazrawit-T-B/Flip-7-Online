import {useNavigate} from 'react-router-dom';
import RuleCTA from '/src/components/RuleCTA';
import Objective from '../components/ObjectiveCTA';
import Anatomy from '../components/AnatomyCTA';
import Special from '../components/SpecialCTA';
import ProTip from '../components/ProtipCTA';
const How=()=>{
    return (

        <div>
            <RuleCTA/>
            <Objective/>
            <Anatomy/>
            <Special/>
            <ProTip/>
        </div>
    )
}
export default How;