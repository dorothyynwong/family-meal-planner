import Popup from "../Popup/Popup";
import { Form} from "react-bootstrap";
import { useNavigate} from "react-router-dom";
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
    //isFromRecipe?: boolean
}


const MealForm: React.FC<MealFormProps> = ({ isForFamily, selectedDate}) => {


    const { mode,
        recipeName,
        selectedMealType,
        mealDate,
        modalShow,
        setModalShow,
        resetMealContext,
        status,
        errorMessages,
        formType,
        setFormType,
    } = useMeal();

    const navigate = useNavigate();
    const { handleSubmit} = useMealForm(isForFamily, selectedDate);

    const isFromMealForm = true;

 
    return (
        <Popup
            customclass="meal-form"
            show={modalShow}
            onHide={() => { setModalShow(false); resetMealContext();  }}
            title={`${mode} Meal`}
            body="">
            <Form onSubmit={handleSubmit}>
                <MealFormSelection 
                    mealFormType={formType} 
                    setMealFormType={setFormType}
                />
                
                {formType == "recipe" ?
                    <RecipeSearch recipeName={recipeName} onSearchClick={() => navigate(`/recipes-list`, { state: { isFromMealForm, mealDate, selectedMealType } })} />
                :
                    <SchoolMenuSelect />
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