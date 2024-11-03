import { Form} from "react-bootstrap";
import MealFormBase from "../MealFormBase/MealFormBase";
import { useMeal } from "../MealContext/MealContext";
import { Dayjs } from 'dayjs';
import StatusHandler from "../StatusHandler/StatusHandler";
import Popup from "../Popup/Popup";
import useMealForm from "../../Hooks/useMealForm";
import RecipeSearch from "../RecipeSearch/RecipeSearch";
import { useEffect, useState } from "react";
import { getFamiliesWithUsersByUserId } from "../../Api/api";
import { FamilyWithUsersInterface } from "../../Api/apiInterface";
import FamilySelect from "./FamilySelect";

interface FamilyMealFormProps {
    isForFamily?: boolean
    selectedDate?: Dayjs
}

const FamilyMealForm: React.FC<FamilyMealFormProps> = ({ isForFamily, selectedDate }) => {
    const {
        modalShow,
        setModalShow,
        resetMealContext,
        mode,
        status,
        errorMessages,
        formType,
        setStatus,
        setErrorMessages,
        isFromRecipeList,
    } = useMeal();

    const { handleSubmit } = useMealForm(selectedDate);
    const [familyUsersList, setFamilyUsersList] = useState<FamilyWithUsersInterface[]>([]);

    useEffect(() => {
        setStatus("loading");
        setErrorMessages([]);
        getFamiliesWithUsersByUserId()
            .then(fu => {
                setFamilyUsersList(fu.data);
                setStatus("success");
            })
            .catch(error => {
                console.log("Error getting families with users", error);
                const errorMessage = error?.response?.data?.message || "Error getting families with users";
                setStatus("error");
                setErrorMessages([...errorMessages, errorMessage]);
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isFromMealForm = true;

    return (
        <Popup
            customclass="meal-form"
            show={modalShow && formType=="family"}
            onHide={() => { setModalShow(false); resetMealContext(); }}
            title={`${mode} Meal`}
            body="">
            <Form onSubmit={handleSubmit}>
                <FamilySelect data={familyUsersList}/>
                <RecipeSearch isFromMealForm={isFromMealForm} isReadOnly={isFromRecipeList}/>
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