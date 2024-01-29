import prisma from "@/libs/prismadb";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  theme: {
    colorScheme: "light",
    logo: "/logo.png",
    brandColor: "rgb(19, 145, 71)",
    buttonText: "Login",
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "",
      credentials: {
        email: {
          label: "Username",
          type: "username",
          placeholder: "Masukkan username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Masukkan password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        console.log(credentials);

        const user = await prisma.user.findUnique({
          where: {
            username: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id + "",
          email: user.username,
          name: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
    jwt: async ({ token, user }) => {
      // console.log('JWT Callback', { token, user })
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          role: u.role,
        };
      }

      const u = await prisma.user.findUnique({
        where: {
          id: parseInt(token?.id as string) || parseInt(token?.sub as string),
        },
      });

      if (u) {
        return {
          ...token,
          id: u.id + "",
          role: u.role,
          name: u.username,
          email: u.username,
        };
      }

      return token;
    },
  },
};
