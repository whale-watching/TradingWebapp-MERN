const logout = () => {
    window.localStorage.removeItem('loginData');
    window.location.href = '/';
}