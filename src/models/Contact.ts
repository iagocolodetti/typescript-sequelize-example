import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, AllowNull, CreatedAt, UpdatedAt, DefaultScope, Scopes, AfterCreate } from 'sequelize-typescript';

@DefaultScope(() => ({
    attributes: { 
        exclude: ['created_at', 'updated_at']
    }
}))
@Table({ tableName: 'contact' })
class Contact extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING(45))
    name!: string;

    @AllowNull(true)
    @Column(DataType.STRING(20))
    phone!: string | null;

    @AllowNull(true)
    @Column(DataType.STRING(255))
    email!: string | null;
    
    @CreatedAt
    created_at?: Date;

    @UpdatedAt
    updated_at?: Date;

    @AfterCreate
    static excludeFields(contact: Contact) {
        const { dataValues } = contact;
        delete dataValues.created_at;
        delete dataValues.updated_at;
    }
}

export default Contact;
