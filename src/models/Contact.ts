import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, AllowNull } from 'sequelize-typescript';

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
}

export default Contact;
