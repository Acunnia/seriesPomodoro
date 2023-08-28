require('dotenv/config');
const mongoose = require('mongoose');
const RoleModel = require('./models/role.model');

const RoleModelInitial = [
    { name: 'Usuario', admin_level: 1, users: [] },
    { name: 'Moderador', admin_level: 2, users: [] },
    { name: 'Admin', admin_level: 5, users: [] },
];

const SettingsModelInitial = [
    
]

async function populateInitialData() {
    try {
        await mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await populateRole()

        console.log('Datos iniciales insertados correctamente');
        process.exit(0);
    } catch (error) {
        console.error('Error al insertar datos iniciales:', error);
        process.exit(1);
    }
}

async function populateRole() {
    return await RoleModel.insertMany(RoleModelInitial)
}

populateInitialData();