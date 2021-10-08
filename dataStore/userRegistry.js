import User from "./User";

class userRegistry {

    constructor() {
        this.allUsers = {}; // {userId: {user}}
    }

    createAndRegisterUser() {
        let user = new User;
        return user;
    }

    getUser(userId) {

    }

    deleteUser(userId) {

    }
}

export default userRegistry;