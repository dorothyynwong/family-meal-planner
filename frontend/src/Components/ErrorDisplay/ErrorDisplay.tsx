interface ErrorDisplayProps {
    errorMessages: string[];
}
const ErrorDisplay:React.FC<ErrorDisplayProps> = ({errorMessages}) => {
    return(<>
    {errorMessages.map(
        (errorMessage, index) => (<div key={index}>{errorMessage}</div>))}
    </>)
}

export default ErrorDisplay;