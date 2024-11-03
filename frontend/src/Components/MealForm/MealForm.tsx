import Popup from "../Popup/Popup";
import { Form} from "react-bootstrap";
import { useMeal } from "../MealContext/MealContext";
import StatusHandler from "../StatusHandler/StatusHandler";
import "./MealForm.scss";
import  { Dayjs } from 'dayjs';
import RecipeSearch from "../RecipeSearch/RecipeSearch";
import MealFormSelection from "../MealFormSelection/MealFormSelection";
import MealFormBase from "../MealFormBase/MealFormBase";
import useMealForm from "../../Hooks/useMealForm";
import SchoolMenuSelect from "../SchoolMenuSelect/SchoolMenuSelect";

interface MealFormProps {
    isForFamily?: boolean
    selectedDate?: Dayjs
}

const MealForm: React.FC<MealFormProps> = ({ selectedDate}) => {
    const { mode,
        modalShow,
        setModalShow,
        resetMealContext,
        status,
        errorMessages,
        formType,
        setFormType,
        isFromRecipeList,
    } = useMeal();

    const { handleSubmit} = useMealForm(selectedDate);

    const isFromMealForm = true;

    return (
        <Popup
            customclass="meal-form"
            show={modalShow && (formType=="recipe" || formType=="school-meal")}
            onHide={() => { setModalShow(false); resetMealContext();  }}
            title={`${mode} Meal`}
            body="">
            <Form onSubmit={handleSubmit}>
                <MealFormSelection 
                    mealFormType={formType} 
                    setMealFormType={setFormType}
                />

                {
                    // !isFromRecipeList ? 
                        formType === "recipe" ? <RecipeSearch isFromMealForm={isFromMealForm} isReadOnly={isFromRecipeList} /> : <SchoolMenuSelect /> 
                    // : 
                    // <></>
                }
                <MealFormBase />
                <StatusHandler
                    status={status}
                    errorMessages={errorMessages}
                    loadingMessage="Submitting/Loading meal ..."
                    successMessage=""
                >
                    <></>
                </StatusHandler>
            </Form>
        </Popup>);
}

export default MealForm;