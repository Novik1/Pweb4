import { userService } from '../services';

export const getAll = async () => {
    const res = await userService.getQuizzes();
    return await res;
};

export const getById = async (id) => {
    const res = await userService.getQuiz(id);
    console.log(JSON.stringify(res));
    return await res;
};

export const getScore = async (quiz_id, question_id, user_id, answer) => {
    const res = await userService.submitResponse(quiz_id, question_id, user_id, answer);
    return res;
};