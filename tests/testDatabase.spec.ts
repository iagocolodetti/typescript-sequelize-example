import database from '../src/database';

import Contact from '../src/models/Contact';
import ContactController from '../src/controllers/ContactController';
import IContact from '../src/interfaces/IContact';

let MOCK_CONTACT: IContact = {
    name: 'Name LastName',
    phone: '1111-2222',
    email: 'email1@gmail.com'
};

describe('testDatabase', () => {
    beforeAll(async () => {
        await database.connect();
        await Contact.truncate({ restartIdentity: true });
    });

    afterAll(async () => {
        await database.close();
    });

    it('should create a new contact', async () => {
        const result = await ContactController.create(MOCK_CONTACT);
        expect(result.name).toBe(MOCK_CONTACT.name);
        MOCK_CONTACT = result;
    });

    it('should read contact list', async () => {
        const result = await ContactController.read();
        expect(result.length).toBe(1);
    });

    it('should get contact by id', async () => {
        const result = await ContactController.getByID(MOCK_CONTACT.id!);
        expect(result).toStrictEqual(MOCK_CONTACT);
    });

    it('should update contact name', async () => {
        MOCK_CONTACT.name = 'NewName LastName';
        await ContactController.update(MOCK_CONTACT.id!, MOCK_CONTACT);
        const result = await ContactController.getByID(MOCK_CONTACT.id!);
        expect(result.name).toEqual(MOCK_CONTACT.name);
    });

    it('should delete contact', async () => {
        await ContactController.delete(MOCK_CONTACT.id!);
        const result = await ContactController.read();
        expect(result.length).toBe(0);
    });
});
