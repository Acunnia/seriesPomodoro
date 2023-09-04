const Role = require('../models/role.model');
const User = require('../models/user.model');

async function checkDB() {
    
    const roles = await Role.find().exec();
    if (roles.length === 0) {
        console.log("Crearting default roles")
        populateRoles();
    }

    const adminUser = await User.find({username: "Admin"}).exec();
    if (adminUser.length === 0) {
        console.log("Creating admin user")
        populateAdmin();
    }
}

async function populateRoles(){
    return await Role.insertMany([{name: "User", admin_level: 1},{name: "Admin", admin_level: 5}])
}

async function populateAdmin(){
    const adminRole = await Role.findOne({name: "Admin"}).exec()
    const adminUser = new User({username: "Admin", password: "defaultAdmin", email: "admin@newadmin.com", role: adminRole._id})
    adminUser.save().then(savedUser => {
        return Role.findOne(savedUser.role._id).then(role => {
            role.users.push(savedUser._id);
            role.save()
        })
    })
}

module.exports = checkDB;