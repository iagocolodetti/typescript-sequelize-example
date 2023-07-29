import { Table, Column, Model, PrimaryKey, ForeignKey, BelongsTo, AutoIncrement, DataType, AllowNull, CreatedAt, UpdatedAt, AfterCreate, DefaultScope } from 'sequelize-typescript';

import Contact from './Contact';

@DefaultScope(() => ({
    attributes: {
        exclude: ['contact_id', 'created_at', 'updated_at']
    }
}))
@Table({ tableName: 'email' })
class Email extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING(60))
    email!: string;

    @AllowNull(false)
    @ForeignKey(() => Contact)
    @Column(DataType.INTEGER)
    contact_id!: number;

    @BelongsTo(() => Contact)
    contact!: Contact;

    @CreatedAt
    created_at?: Date;

    @UpdatedAt
    updated_at?: Date;

    @AfterCreate
    static excludeFields(email: Email) {
        const { dataValues } = email;
        delete dataValues.contact_id;
        delete dataValues.created_at;
        delete dataValues.updated_at;
    }
}

export default Email;
