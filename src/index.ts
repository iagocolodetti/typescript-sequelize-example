import database from './database';

import Contact from './models/Contact';
import IContact from './interfaces/IContact';
import ContactController from './controllers/ContactController';

const newContact: IContact = {
    name: 'Name LastName',
    phone: '1111-2222',
    email: 'email1@gmail.com'
};

async function test() {
    await database.connect();
    
    await Contact.truncate({ restartIdentity: true });

    const contact: IContact = await ContactController.create(newContact);
    console.log('create ->', contact);

    console.log('read ->', await ContactController.read());

    console.log('getByID ->', await ContactController.getByID(contact.id!));

    contact.name = 'NewName LastName';
    await ContactController.update(contact.id!, contact);
    console.log('update ->', await ContactController.getByID(contact.id!));

    await ContactController.delete(contact.id!);
    console.log('delete ->', await ContactController.read());

    await database.close();
}

test();
