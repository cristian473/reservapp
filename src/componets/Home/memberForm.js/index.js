import FirstStep from "./firstStep"
import FourthStep from "./fourthStep";
import SecondStep from "./secondStep";
import ThirdStep from "./thirdStep";

const MemberForm = (props) => {
    const params = new URLSearchParams(props.location.search);
    const formStep = params.get('step');

    const stepsHelper = [
        <FirstStep />,
        <SecondStep />,
        <ThirdStep />,
        <FourthStep />
    ]

    return stepsHelper[formStep-1]
}

export default MemberForm