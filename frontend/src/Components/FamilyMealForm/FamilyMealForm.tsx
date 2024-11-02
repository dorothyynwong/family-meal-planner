import { Form} from "react-bootstrap";
import MealFormBase from "../MealFormBase/MealFormBase";
import { useMeal } from "../MealContext/MealContext";
import { Dayjs } from 'dayjs';
import StatusHandler from "../StatusHandler/StatusHandler";
import Popup from "../Popup/Popup";
import useMealForm from "../../Hooks/useMealForm";
import RecipeSearch from "../RecipeSearch/RecipeSearch";

interface FamilyMealFormProps {
    isForFamily?: boolean
    selectedDate?: Dayjs
}

const FamilyMealForm: React.FC<FamilyMealFormProps> = ({ isForFamily, selectedDate }) => {
    const {
        selectedFamily,
        modalShow,
        setModalShow,
        resetMealContext,
        mode,
        status,
        errorMessages,
    } = useMeal();

    const { handleSubmit } = useMealForm(isForFamily, selectedDate);

    const isFromMealForm = true;

    return (
        <Popup
            customclass="meal-form"
            show={modalShow}
            onHide={() => { setModalShow(false); resetMealContext(); }}
            title={`${mode} Meal`}
            body="">
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="meal-family-name">
                    <Form.Control
                        type="text"
                        className="mt-3 meal-family-name"
                        readOnly
                        placeholder={selectedFamily?.familyName} />
                </Form.Group>
                <RecipeSearch isFromMealForm={isFromMealForm}/>
                <MealFormBase isForFamily={isForFamily} selectedDate={selectedDate} />
                <StatusHandler
                    status={status}
                    errorMessages={errorMessages}
                    loadingMessage="Submitting/Loading meal ..."
                    successMessage=""
                >
                    <></>
                </StatusHandler>
            </Form>
        </Popup>
    )
}

export default FamilyMealForm;