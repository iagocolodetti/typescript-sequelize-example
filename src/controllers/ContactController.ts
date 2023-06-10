import database from "../database";

import IContact from "../interfaces/IContact";
import Contact from '../models/Contact';

export default {
    async create(contact: IContact) {
        let transaction;
        try {
            transaction = await database.getTransaction();
            const { name, phone, email } = contact;
            const result = await Contact.create({ name, phone, email }, { transaction });
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
            const result = await Contact.findAll({ raw: true });
            return result;
        } catch (error: any) {
            throw error;
        }
    },

    async getByID(id: number) {
        try {
            const result = await Contact.findOne({ where: { id }, raw: true });
            if (result) {
                return result;
            } else {
                throw new Error('Contact not found');
            }
        } catch (error: any) {
            throw error;
        }
    },

    async update(id: number, contact: IContact) {
        let transaction;
        try {
            const result = await Contact.findOne({ where: { id }, raw: false });
            if (result) {
                transaction = await database.getTransaction();
                const { name, phone, email } = contact;
                await result.update({ name, phone, email }, { transaction });
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
