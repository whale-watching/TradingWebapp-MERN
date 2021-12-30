const logout = () => {
    window.localStorage.removeItem('userData');
    window.location.href = '/';
}