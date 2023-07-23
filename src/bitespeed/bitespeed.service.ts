import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto, GetContacts } from './dtos/create-contact.dto';
import { ContactEntity, LinkedPrecedence } from './entities/contact.entity';

@Injectable()
export class BitespeedService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>,
  ) {}

  async createContact(body: CreateContactDto) {
    var primaryContact = await this.contactRepository.findOne({
      where: { email: body.email, phoneNumber: body.phoneNumber },
    });

    if (!primaryContact) {
      primaryContact = await this.contactRepository.findOne({
        where: { email: body.email },
      });
    }

    if (!primaryContact) {
      primaryContact = await this.contactRepository.findOne({
        where: { phoneNumber: body.phoneNumber },
      });
    }

    if (primaryContact) {
      const secondaryContact = new ContactEntity();
      secondaryContact.email = body.email;
      secondaryContact.phoneNumber = body.phoneNumber;
      secondaryContact.linkedId = primaryContact.id;
      secondaryContact.linkPrecedence = LinkedPrecedence.secondary;
      const res = await this.contactRepository.save(secondaryContact);
      return res;
    }

    const newPrimaryContact = new ContactEntity();
    newPrimaryContact.email = body.email;
    newPrimaryContact.phoneNumber = body.phoneNumber;
    newPrimaryContact.linkPrecedence = LinkedPrecedence.primary;

    const res = await this.contactRepository.save(newPrimaryContact);
    return res;
  }

  async getContacts(body: GetContacts) {
    const builder = this.contactRepository.createQueryBuilder('contacts');

    var contact = builder.where('contacts.linkPrecedence = :linkPrecedence', {
      linkPrecedence: LinkedPrecedence.primary,
    });

    if (body.email && body.phoneNumber) {
      builder
        .andWhere('contacts.email = :email', { email: body.email })
        .andWhere('contacts.phoneNumber = :phoneNumber', {
          phoneNumber: body.phoneNumber,
        });
    } else if (body.email) {
      builder.andWhere('contacts.email = :email', { email: body.email });
    } else if (body.phoneNumber) {
      builder.andWhere('contacts.phoneNumber = :phoneNumber', {
        phoneNumber: body.phoneNumber,
      });
    }

    const primaryContact = await contact.getOne();

    const result = builder.where('contacts.linkPrecedence = :linkPrecedence', {
      linkPrecedence: LinkedPrecedence.secondary,
    });

    if (primaryContact) {
      builder.andWhere('contacts.linkedId = :linkedId', {
        linkedId: primaryContact.id,
      });
    } else {
      if (body.email && body.phoneNumber) {
        builder
          .andWhere('contacts.email = :email', { email: body.email })
          .andWhere('contacts.phoneNumber = :phoneNumber', {
            phoneNumber: body.phoneNumber,
          });
      } else if (body.email) {
        builder.andWhere('contacts.email = :email', { email: body.email });
      } else if (body.phoneNumber) {
        builder.andWhere('contacts.phoneNumber = :phoneNumber', {
          phoneNumber: body.phoneNumber,
        });
      }
    }

    const secondaryContacts = await result.getMany();

    if (primaryContact) {
      var primaryEmail = primaryContact.email;
      var primaryPhoneNumber = primaryContact.phoneNumber;
      var primaryContactId = primaryContact.id;
    } else {
      const contact = await this.contactRepository.findOne({
        where: {
          id: secondaryContacts[0].linkedId,
        },
      });
      primaryContactId = contact.id;
      primaryEmail = contact.email;
      primaryPhoneNumber = contact.phoneNumber;
    }

    const emails = [
      primaryEmail,
      ...secondaryContacts.map((e) => {
        return e.email;
      }),
    ];

    const uniqueEmails = Array.from(new Set(emails));

    const phoneNumbers = [
      primaryPhoneNumber,
      ...secondaryContacts.map((e) => {
        return e.phoneNumber;
      }),
    ];
    const uniquePhoneNumbers = Array.from(new Set(phoneNumbers));

    const secondaryContactIds = secondaryContacts.map((e) => {
      return e.id;
    });

    return {
      contact: {
        primaryContactId: primaryContactId,
        emails: uniqueEmails,
        phoneNumbers: uniquePhoneNumbers,
        secondaryContactIds: secondaryContactIds,
      },
    };
  }
}
