import cookieParser from "cookie-parser";

const cookieoptions = {
    maxAge: 9000000,
    httpOnly: true,
    secure: true,
    sameSite: 'None',
};

export const cookieService = (app) => {
    app.use(cookieParser());
}

export const setCookie = (res, name, value, options = {}) => {
    const finalCookie = { ...cookieoptions, ...options};
    res.cookie(name, value, finalCookie);
};

export const getCookie = (req, name) => {
    return req.cookies[name];
}

export const removeCookie = (res, name, options = {}) =>{
    const finalCookie = { ...cookieoptions, ...options};
    res.clearCookie(name, finalCookie);
}