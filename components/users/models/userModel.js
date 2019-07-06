const bookshelf = require("../../../database/database");

exports.User = bookshelf.Model.extend({
    tableName: 'user',
    hasTimestamps: true,
})

exports.findById = async (userId) => {
    let user = await this.User.where({'id': userId, 'deleted_at': null}).fetch();
    
    return user;
}

exports.findByEmail = async (email) => {
    let user = await this.User.where({'email': email.toLowerCase(), 'deleted_at': null}).fetch();
    console.log(JSON.stringify(user));
    return user;
};

exports.list = async (pageSize, page) => {
    console.log('userModel.list');
    let results = await this.User.query({'deleted_at': null}).fetchPage({
        pageSize: pageSize,
        page: page
    });

    return results;
}

exports.create = async (userData) => {
    try {
        let user = await this.User.forge({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email.toLowerCase(),
            password: userData.password
        }).save();

        return user;
    } catch (err) {
        console.log(JSON.stringify(err));
        return null;
    }
}

exports.update = async (id, userData) => {
    let user = await this.findById(id);
    for (const [key, value] of Object.entries(userData)) {
        user.set(key, value);    
    }

    try {
        user = await user.save();
        return user;
    }
    catch (err) {
        console.log(JSON.stringify(err));
        return null;
    }
}

exports.removeById = async (id) => {
    let user = await this.findById(id);
    user.set('deleted_at', new Date());
    user = await user.save();

    return user;
}