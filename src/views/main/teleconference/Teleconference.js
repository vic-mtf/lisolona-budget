
import TeleconferenceProvider from '../../../utils/TeleconferenceProvider';
import ActionsWrapper from './actions/ActionsWrapper';
import TeleconferenceUI from './ui/TeleconferenceUI';

export default function Teleconference () {
    return (
        <TeleconferenceProvider>
            <ActionsWrapper>
                <TeleconferenceUI/>
            </ActionsWrapper>
        </TeleconferenceProvider>
    )
}
