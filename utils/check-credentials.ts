import sha256 from 'crypto-js/sha256';
import prisma from '../prisma';

export const checkCredentials = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      password: true,
    },
  });
  if (user) {
    if (user.password == sha256(password).toString()) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } else {
      throw 'Invalid credentials';
    }
  } else {
    const user = await prisma.user.create({
      data: {
        email,
        password: sha256(password).toString(),
      },
    });
    const { password: usersPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};
