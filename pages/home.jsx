import Link from "next/link";
import {getAll} from "./quiz";

const styles = {
    mainTitle: {
        fontSize: '2.5em',
    },
    quizTitle: {
        fontSize: '1.3em',
    },
    quizLink: {
        marginTop: '1rem'
    }
}

function getCards(data) {
    return data.map((quiz) => (
        <div
            key={quiz.id}
            className="quiz my-2 border rounded p-3 d-flex flex-row align-center space-between"
        >
            <span style={styles.quizTitle}>{quiz.title}: {quiz.questions_count} Q</span>
            <div className="my-1">
                <Link href={`/quiz/${quiz.id}`}>
                    <a className="start-button mx-5 px-4 py-1 rounded border">
                        Start
                    </a>
                </Link>
            </div>
        </div>
    ));
}
export default function IndexPage({quizzes}) {
    return (
        <div className="container font-sans px-4 d-flex flex-column space-between">
            <h1 className="my-2" style={styles.mainTitle}>Choose the quiz</h1>
            <div>
                {getCards(quizzes)}
            </div>
        </div>
    );
}
export async function getStaticProps() {
    const quizzes = await getAll();
    return {
        props: {
            quizzes,
        }
    }
}