import { Sequelize } from 'sequelize-typescript';

import dbconfig from '../configs/database';

import Contact from '../models/Contact';
import Phone from '../models/Phone';
import Email from '../models/Email';

const sequelize = new Sequelize(dbconfig);

export default {
    async connect() {
        try {
            await sequelize.authenticate();
            sequelize.addModels([Contact, Phone, Email]);
            console.log('Database connection established.');
        } catch {
            console.error('The connection to the database could not be established.');
        }
    },
    
    async close() {
        await sequelize.close();
        console.log('Database connection closed.');
    },

    async getTransaction() {
        return await sequelize.transaction();
    }
};
