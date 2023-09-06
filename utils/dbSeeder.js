const AppConfig = require('../models/app-config.model');
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

    const appConfig = await AppConfig.find().exec()
    if (appConfig.length === 0) {
        populateConfig();
    } else if (appConfig.length >> 1) {
        dropConfigAndPopulate();
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

async function populateConfig(){
    return await AppConfig.insertMany([{create_category: 3,
    create_subcategory: 3,
    edit_category: 3,
    edit_subcategory: 3,
    delete_category: 5,
    delete_subcategory: 5,
    edit_user: 5,
    delete_user: 5,    
    create_role: 5,
    edit_role: 5,
    delete_role: 5,
    motd: "Wellcome to the seriesPomodoro forum",
    banner: "https://i.imgur.com/N9GbszF.jpg"}])
}

async function dropConfigAndPopulate(){

    return populateConfig();
}

module.exports = checkDB;