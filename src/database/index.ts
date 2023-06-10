import { Sequelize } from 'sequelize-typescript';

import dbconfig from '../configs/database';

import Contact from '../models/Contact';

const sequelize = new Sequelize(dbconfig);

export default {
    async connect() {
        try {
            await sequelize.authenticate();
            sequelize.addModels([Contact]);
            console.log('Conexão com o banco de dados estabelecida.');
        } catch {
            console.log('Não foi possível estabelecer a conexão com o banco de dados.');
        }
    },
    
    async close() {
        await sequelize.close();
        console.log('Conexão com o banco de dados encerrada.');
    },

    async getTransaction() {
        return await sequelize.transaction();
    }
};
