import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as jsonData from './data.json';
import Devseeder from './dev';
import * as bcrypt from 'bcryptjs';

dotenv.config();

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  if (params.model === 'User' && params.action === 'create') {
    params.args.data.password = await hashPassword(params.args.data.password);
  }
  return next(params);
});

const hashPassword = async (password: any) => {
  let salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
export class DefaultSeeder {
  static async run(
    prisma: PrismaClient,
    permissions: PermissionDto[],
    roles: RolesDto[],
    user: UserDto,
  ) {
    await this.createAdmin(prisma, user);
  }

  static async createAdmin(prisma: PrismaClient, user: UserDto) {
    try {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          password: await hashPassword(user.password),
        },
        create: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          password: await hashPassword(user.password),
        },
      });

      console.log(
        `L'admin ${user.firstname} ${user.lastname} a été creer avec succès avec les valeurs email: ${user.email} password: ***************`,
      );
    } catch (error) {
      console.log(error);
      throw new Error("Erreur d'insertion de l'admin");
    }
  }
}

interface PermissionDto {
  id: number;
  name: string;
  method: string;
  url: string;
}

interface RolesDto {
  id: number;
  name: string;
  permissions: number[];
}

export interface UserDto {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

if (
  !process.env.ADMIN_FIRSTNAME ||
  !process.env.ADMIN_LASTNAME ||
  !process.env.ADMIN_EMAIL ||
  !process.env.ADMIN_PASSWORD
) {
  throw new Error('Des valeurs manquent dans le fichier .env');
}
const admin: UserDto = {
  id: 1,
  firstname: process.env.ADMIN_FIRSTNAME,
  lastname: process.env.ADMIN_LASTNAME,
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

DefaultSeeder.run(prisma, jsonData.permissions, jsonData.roles, admin)
  .then(async () => {
    if (process.env.NODE_ENV !== 'production') {
      Devseeder.run(prisma);
    }
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
