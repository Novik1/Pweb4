import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete,
    getQuizzes,
    getQuiz,
    submitResponse
};

function login(name, surname) {
    return fetchWrapper.get("https://pure-caverns-82881.herokuapp.com/api/v54/users")
        .then(user => {
            let id = user.filter( function(user) { if (user.name == name && user.surname == surname) return user.id});
            
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        });
}

function logout() {
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/account/login');
}

function register(user) {
    return fetchWrapper.post("https://pure-caverns-82881.herokuapp.com/api/v54/users", JSON.stringify({
        "data": {
            "name": user.name,
            "surname": user.surname
        }
    }));
}

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(x => {
            if (id === userSubject.value.id) {
                const user = { ...userSubject.value, ...params };
                localStorage.setItem('user', JSON.stringify(user));

                userSubject.next(user);
            }
            return x;
        });
}

function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}

function getQuizzes() {
    return fetchWrapper.get('https://pure-caverns-82881.herokuapp.com/api/v54/quizzes');
}

function getQuiz(id) {
    const url = 'https://pure-caverns-82881.herokuapp.com/api/v54/quizzes/' + id;
    return fetchWrapper.get(url);
}

function submitResponse(quiz_id, question_id, user_id, answer) {

    const url = 'https://pure-caverns-82881.herokuapp.com/api/v54/quizzes/' + quiz_id + '/submit';

    const body = JSON.stringify({"data": {
        "question_id": question_id,
        "answer": answer,
        "user_id": user_id
    }})

    return fetchWrapper.post(url, body);
}