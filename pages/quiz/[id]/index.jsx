import {useState} from "react";
import {useRouter} from "next/router";
import {getAll, getById, getScore} from "../../quiz";

const styles = {
    questionTitle: {
        fontSize: '20px'
    },
    questionDescription: {
        fontSize: '16px'
    }
}

export async function getStaticProps({params}) {
    const quiz = await getById(params.id);

    return {
        props: {
            quiz
        }
    }
}

export async function getStaticPaths() {
    const quizzes = await getAll();
    const paths = quizzes.map(quiz => ({params: {id: `${quiz.id}`}}));

    return {
        paths,
        fallback: false
    }
}

let correctAnswers = 0;

const Quiz = ({quiz}) => {
    const router = useRouter();
    const [index, setIndex] = useState(0);
    const question = quiz.questions[index];

    const nextQuestion = () => {
        if (index >= quiz.questions.length - 1) {
            finishQuiz();
        } else {
            setIndex(index + 1);
        }
    };

    const prevQuestion = () => {
        if (index !== 0) {
            setIndex(index - 1);
        }
    };

    const finishQuiz = () => {
        alert(`Your score is ${correctAnswers}/${quiz.questions.length}`);
        router.push("/home");
    };

    const checkOption = async (quiz_id, question_id, user_id, option) => {            
        const answer = await getScore(quiz_id, question_id, user_id, option);
        if (answer.correct) {
            correctAnswers += 1;
        }
        nextQuestion();
    };

    return (
        <div className="container">
            <div className="text-3xl font-bold my-8">{quiz.title}</div>

            <div className="question d-flex w-50 flex-row justify-content-around align-items-center border">
                <div className="flex flex-col rounded-md shadow-md w-full py-4 px-4 mb-4">
                    <div style={styles.questionTitle}>Question {index + 1}</div>
                    <div style={styles.questionDescription}>{question.question}</div>
                </div>
                <div className="d-flex flex-column flex-wrap justify-between text-center gap-4">
                    {question.answers.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => checkOption(quiz.id, question.id, 1558, option)}
                            className={`block md:w-5/12 w-full option rounded-md shadow-md p-2`}
                        >{option}</button>
                    ))}
                </div>
            </div>

            <div className="d-flex justify-content-right gap-x-4 mt-10 justify-center">
                {index > 0 ? (
                    <p className="px-2 button rounded border border-green-500">
                        <button onClick={prevQuestion}>Previous</button>
                    </p>
                ) : null}

                {index < quiz.questions.length - 1 ? (
                    <p className="px-2 button rounded border">
                        <button onClick={nextQuestion}>Next</button>
                    </p>
                ) : null}
            </div>
        </div>
    );
};

export default Quiz;