import database from './database';

import Contact from './models/Contact';
import IContact from './interfaces/IContact';
import ContactController from './controllers/ContactController';

const newContact: IContact = {
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

async function test() {
    await database.connect();
    
    await Contact.truncate({ restartIdentity: true });

    const contact: IContact = await ContactController.create(newContact);
    console.log('create ->', contact);

    console.log('read ->', await ContactController.read());

    console.log('getByID ->', await ContactController.getByID(contact.id!));

    contact.name = 'NewName LastName';
    contact.phone[0].phone = '9999-8888'
    contact.phone[1].phone = '';
    contact.email.push({
        email: 'email4@gmail.com'
    });
    await ContactController.update(contact.id!, contact);
    console.log('update ->', await ContactController.getByID(contact.id!));

    await ContactController.delete(contact.id!);
    console.log('delete ->', await ContactController.read());

    await database.close();
}

test();
