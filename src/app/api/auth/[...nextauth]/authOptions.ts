// see: https://next-auth.js.org/configuration/options
import { authorizeCrypto } from '@/app/api/auth/[...nextauth]/authorizeCrypto';
import { CustomPrismaAdapter } from './customPrismaAdapter';
import { prisma } from '@/prisma';
import { DoDaoJwtTokenPayload, Session } from '@/types/auth/Session';
import { User } from '@/types/auth/User';
import jwt from 'jsonwebtoken';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DefaultAdapter } from 'next-auth/adapters';

export const authOptions: AuthOptions = {
  // Setting error and signin pages to our /auth custom page
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    // see: https://next-auth.js.org/configuration/providers/credentials
    CredentialsProvider({
      id: 'crypto',
      name: 'Crypto Wallet Auth',
      credentials: {
        publicAddress: { label: 'Public Address', type: 'text' },
        signedNonce: { label: 'Signed Nonce', type: 'text' },
        spaceId: { label: 'Space Id', type: 'text' },
      },
      authorize: authorizeCrypto,
    }),
  ],
  adapter: CustomPrismaAdapter(prisma) as DefaultAdapter,
  // Due to a NextAuth bug, the default database strategy is no usable
  //  with CredentialsProvider, so we need to set strategy to JWT
  session: {
    strategy: 'jwt',
  },
  logger: {
    error(code: any , metadata: any) {
      console.error(code, metadata);
    },
    warn(code: string) {
      console.warn(code);
    },
    debug(code: string, metadata: any) {
      console.debug(code, metadata);
    },
  },
  callbacks: {
    async session({ session, user, token }: any): Promise<Session> {
      let userInfo: any = {};
      if (token.sub) {
        const dbUser: User | null = await prisma.user.findUnique({
          where: { id: token.sub },
        });
        if (dbUser) {
          userInfo.username = dbUser.username;
          userInfo.authProvider = dbUser.authProvider;
          userInfo.spaceId = dbUser.spaceId;
          userInfo.id = dbUser.id;
        }
      }
      const doDaoJwtTokenPayload: DoDaoJwtTokenPayload = {
        userId: userInfo.id,
        spaceId: userInfo.spaceId,
        username: userInfo.username,
        accountId: userInfo.id,
      };
      return {
        userId: userInfo.id,
        ...session,
        ...userInfo,
        dodaoAccessToken: jwt.sign(doDaoJwtTokenPayload, process.env.DODAO_AUTH_SECRET!),
      };
    },
    jwt: async ({ token, user, account, profile, isNewUser }: any) => {
      if (token.sub) {
        const dbUser: User | null = await prisma.user.findUnique({
          where: { id: token.sub },
        });

        if (dbUser) {
          token.spaceId = dbUser.spaceId;
          token.username = dbUser.username;
          token.authProvider = dbUser.authProvider;
        }
      }
      return token;
    },
  },
};
