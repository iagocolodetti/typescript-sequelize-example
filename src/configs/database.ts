import { join } from 'path';
import { SequelizeOptions } from 'sequelize-typescript';

const databaseConfig: SequelizeOptions = {
    database: 'contact_book',
    username: '',
    password: '',
    dialect: 'sqlite',
    storage: join(__dirname, '../../contact_book.sqlite'),
    logging: false,
    define: {
        timestamps: false,
        underscored: true
    }
}

export default databaseConfig;
