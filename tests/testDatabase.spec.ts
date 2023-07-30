import database from '../src/database';

import Contact from '../src/models/Contact';
import ContactController from '../src/controllers/ContactController';
import IContact from '../src/interfaces/IContact';

let MOCK_CONTACT: IContact = {
    name: 'Name LastName',
    alias: 'NLN',
    phone: [{
        phone: '1111-2222'
    },{
        phone: '3333-4444'
    },{
        phone: '5555-6666'
    }],
    email: [{
        email: 'email1@gmail.com'
    },{
        email: 'email2@gmail.com'
    },{
        email: 'email3@gmail.com'
    }]
};

describe('testDatabase', () => {
    beforeAll(async () => {
        await database.connect();
        await Contact.truncate({ restartIdentity: true });
    });

    afterAll(async () => {
        await database.close();
    });
    
    describe('should fail to create a new contact', () => {
        it('name validation', async () => {
            const contact = structuredClone(MOCK_CONTACT);
            contact.name = 'aa'
            await expect(ContactController.create(contact)).rejects.toThrowError();
            const result = await ContactController.read();
            expect(result.length).toEqual(0);
        });

        it('alias validation', async () => {
            const contact = structuredClone(MOCK_CONTACT);
            contact.alias = 'aa'
            await expect(ContactController.create(contact)).rejects.toThrowError();
            const result = await ContactController.read();
            expect(result.length).toEqual(0);
        });

        it('phone validation', async () => {
            const contact = structuredClone(MOCK_CONTACT);
            contact.phone[0].phone = '12';
            await expect(ContactController.create(contact)).rejects.toThrowError();
            const result = await ContactController.read();
            expect(result.length).toEqual(0);
        });

        it('email validation', async () => {
            const contact = structuredClone(MOCK_CONTACT);
            contact.email[0].email = 'email1@gmail';
            await expect(ContactController.create(contact)).rejects.toThrowError();
            const result = await ContactController.read();
            expect(result.length).toEqual(0);
        });
    });

    it('should create a new contact', async () => {
        const result: IContact = await ContactController.create(MOCK_CONTACT);
        expect(result.name).toEqual(MOCK_CONTACT.name);
        expect(result.alias).toEqual(MOCK_CONTACT.alias);
        expect(result.phone.length).toEqual(MOCK_CONTACT.phone.length);
        MOCK_CONTACT.phone.map(p => {
            expect(result.phone.some(_p => _p.phone == p.phone)).toBeTruthy();
        });
        expect(result.email.length).toEqual(MOCK_CONTACT.email.length);
        MOCK_CONTACT.email.forEach(e => {
            expect(result.email.some(_e => _e.email == e.email)).toBeTruthy();
        });
        MOCK_CONTACT = result;
    });

    it('should read contact list', async () => {
        const result: IContact[] = await ContactController.read();
        expect(result.length).toEqual(1);
        expect(result[0]).toStrictEqual(MOCK_CONTACT);
    });

    it('should get contact by id', async () => {
        const result: IContact = await ContactController.getByID(MOCK_CONTACT.id!);
        expect(result).toStrictEqual(MOCK_CONTACT);
    });

    it('should update contact', async () => {
        MOCK_CONTACT.name = 'NewName LastName'; // Change
        MOCK_CONTACT.phone[0].phone = '9999-8888' // Change
        const deletedPhone = MOCK_CONTACT.phone[1].phone;
        MOCK_CONTACT.phone[1].phone = ''; // Delete
        MOCK_CONTACT.email.push({
            email: 'email4@gmail.com' // Add
        });
        await ContactController.update(MOCK_CONTACT.id!, MOCK_CONTACT);
        const result: IContact = await ContactController.getByID(MOCK_CONTACT.id!);
        expect(result.name).toEqual(MOCK_CONTACT.name);
        expect(result.alias).toEqual(MOCK_CONTACT.alias);
        expect(result.phone.length).toEqual(MOCK_CONTACT.phone.length - 1);
        expect(result.phone.some(_p => _p.phone == MOCK_CONTACT.phone[0].phone)).toBeTruthy();deletedPhone
        expect(result.phone.some(_p => _p.phone == deletedPhone)).toBeFalsy();
        expect(result.email.length).toEqual(MOCK_CONTACT.email.length);
        expect(result.email.some(_e => _e.email == MOCK_CONTACT.email[MOCK_CONTACT.email.length - 1].email)).toBeTruthy();
    });

    it('should delete contact', async () => {
        await ContactController.delete(MOCK_CONTACT.id!);
        const result = await ContactController.read();
        expect(result.length).toEqual(0);
    });
});
