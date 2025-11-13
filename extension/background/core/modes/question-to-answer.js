/**
 * Question to answer mode:
 * Simply turn the question into the answer by clicking on it
 * @param props
 */
function questionToAnswerMode(props) {
    const questionElement = props.questionElement;
    props.removeListener();
    const questionBackup = questionElement.innerHTML ?? '';
    questionElement.innerHTML = props.gptAnswer.response;
    questionElement.style.whiteSpace = 'pre-wrap';
    // To go back to the question / answer
    questionElement.addEventListener('click', function () {
        const contentIsResponse = questionElement.innerHTML === props.gptAnswer.response;
        questionElement.style.whiteSpace = contentIsResponse ? 'initial' : 'pre-wrap';
        questionElement.innerHTML = contentIsResponse ? questionBackup : props.gptAnswer.response;
    });
}
export default questionToAnswerMode;
//# sourceMappingURL=question-to-answer.js.map