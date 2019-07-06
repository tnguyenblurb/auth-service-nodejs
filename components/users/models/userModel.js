const bookshelf = require("../../../database/database");

exports.User = bookshelf.Model.extend({
    tableName: 'user',
    hasTimestamps: true,
})

exports.findById = async (userId) => {
    let user = await this.User.where('id', userId).fetch();
    
    return user;
}

exports.findByEmail = async (email) => {
    let user = await this.User.where({'email': email}).fetch();
    console.log(JSON.stringify(user));
    return user;
};

exports.list = async (pageSize, page) => {
    console.log('userModel.list');
    let results = await this.User.query({}).fetchPage({
        pageSize: pageSize,
        page: page
    });

    return results;
}

exports.create = async (userData) => {
    let user = await this.User.forge({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: userData.password
    }).save();
    
    return user;
}

exports.update = async (id, userData) => {
    let user = await this.findById(id);
    for (let i in userData) {
        user[i] = userData[i];
    }

    user = await user.save();

    return user;
}

exports.update = async (id, userData) => {
    let user = await this.findById(id);
    for (let i in userData) {
        user[i] = userData[i];
    }

    user = await user.save();

    return user;
}

exports.removeById = async (id) => {
    let user = await this.findById(id);
    user.deleted_at = new Date();
    user = await user.save();

    return user;
}