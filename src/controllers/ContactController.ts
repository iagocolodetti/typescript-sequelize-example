import { Transaction } from "sequelize";
import database from "../database";

import IContact from "../interfaces/IContact";
import Contact from '../models/Contact';
import Email from "../models/Email";
import Phone from "../models/Phone";
import IPhone from "../interfaces/IPhone";
import IEmail from "../interfaces/IEmail";

export default {
    async create(contact: IContact) {
        let transaction: Transaction | undefined;
        try {
            transaction = await database.getTransaction();
            const result = await Contact.create(contact as any, {
                include: [
                    Phone,
                    Email
                ],
                transaction
            }, );
            await transaction.commit();
            return result.get({ plain: true });
        } catch (error: any) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    },

    async read() {
        try {
            const result = (await Contact.findAll({ raw: false })).map(contact => contact.get({ plain: true }));
            return result;
        } catch (error: any) {
            throw error;
        }
    },

    async getByID(id: number) {
        try {
            const result = await Contact.findOne({ where: { id }, raw: false });
            if (result) {
                return result.get({ plain: true });
            } else {
                throw new Error('Contact not found');
            }
        } catch (error: any) {
            throw error;
        }
    },

    async update(id: number, contact: IContact) {
        let transaction: Transaction | undefined;
        try {
            const result = await Contact.findOne({ where: { id }, raw: false });
            if (result) {
                transaction = await database.getTransaction();
                const { id: contact_id, name, alias, phone, email } = contact;
                await Promise.all(phone.map(async (p: IPhone) => {
                    if (p.phone.length > 0) {
                        await Phone.upsert({
                            id: p.id,
                            phone: p.phone,
                            contact_id
                        }, { transaction });
                    } else {
                        await Phone.destroy({ where: { id: p.id, contact_id }, transaction });
                    }
                }));
                await Promise.all(email.map(async (e: IEmail) => {
                    if (e.email.length > 0) {
                        await Email.upsert({
                            id: e.id,
                            email: e.email,
                            contact_id
                        }, { transaction });
                    } else {
                        await Email.destroy({ where: { id: e.id, contact_id }, transaction });
                    }
                }));
                await result.update({ name, alias }, { transaction });
                await transaction.commit();
            } else {
                throw new Error('Contact not found');
            }
        } catch (error: any) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    },

    async delete(id: number) {
        try {
            const result = await Contact.findOne({ where: { id }, raw: false });
            if (result) {
                await result.destroy();
            } else {
                throw new Error('Contact not found');
            }
        } catch (error: any) {
            throw error;
        }
    }
};
