import FirstStep from "./firstStep"
import SecondStep from "./secondStep";

const MemberForm = (props) => {
    const params = new URLSearchParams(props.location.search);
    const formStep = params.get('step');

    const stepsHelper = [
        <FirstStep />,
        <SecondStep />
    ]

    return stepsHelper[formStep]
}

export default MemberForm