import { Body, Controller, Post } from '@nestjs/common';
import { BitespeedService } from './bitespeed.service';
import { CreateContactDto, GetContacts } from './dtos/create-contact.dto';

@Controller()
export class BitespeedController {
  constructor(private readonly contactService: BitespeedService) {}

  @Post('/identify')
  IdentifyContacts(@Body() body: GetContacts) {
    return this.contactService.getContacts(body);
  }

  @Post()
  createContact(@Body() body: CreateContactDto) {
    return this.contactService.createContact(body);
  }
}
