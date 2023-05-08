import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { UserDto } from '.';
import { faker } from '@faker-js/faker';

dotenv.config();
export default class Devseeder {
  static async run(prisma: PrismaClient) {
    const users = Array.from({ length: 10 }, (_, k) => this.createRandomUser());
    await this.createUsers(prisma, users);
  }

  static createRandomUser(): UserDto {
    return {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }

  static async createUsers(prisma: PrismaClient, users: UserDto[]) {
    try {
      await Promise.all(
        users.map((user) => {
          return prisma.user.create({
            data: {
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              password: user.password,
            },
          });
        }),
      );

      console.log('Les Users ont été creer avec succes');
    } catch (error) {
      console.log(error);
      throw new Error("Erreur lors de l'insertion des users");
    }
  }
}
