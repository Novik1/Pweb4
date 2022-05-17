import getConfig from 'next/config';
import { create } from 'yup/lib/Reference';

import { userService } from '../services';

const { publicRuntimeConfig } = getConfig();

export const fetchWrapper = {
    get,
    post,
    delete: _delete
};

function get(url) {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', ...authHeader(url), 'X-Access-Token': "09336c24b992c132cd059fb417823391cc6df58867b9d2410a6bdec3f0c45ec0"}
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body) {
    // console.log(body);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader(url), 'X-Access-Token': "09336c24b992c132cd059fb417823391cc6df58867b9d2410a6bdec3f0c45ec0" },
        body: body
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const user = userService.userValue;
    const isLoggedIn = user && user.token;
    const isApiUrl = url.startsWith(publicRuntimeConfig.apiUrl);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${user.token}` };
    } else {
        return {};
    }
}

function handleResponse(response) {
    return response.text().then(text => {
        console.log(text);
        const data = text && JSON.parse(text);
        console.log(data);

        if (!response.ok) {
            if ([401, 403].includes(response.status) && userService.userValue) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                userService.logout();
            }

        }

        return data;
    });
}